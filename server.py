from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import parse_qs, urlparse
import json
import sqlite3
import time

from content import MODULES, QUESTION_BANK, REVIEW_QUIZ, get_module, get_questions_for_module
from database import DB_PATH, init_db


ROOT = Path(__file__).parent.resolve()
STATIC_DIR = ROOT / "static"


def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def json_response(handler, payload, status=200):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def read_json(handler):
    length = int(handler.headers.get("Content-Length", 0))
    if length == 0:
        return {}
    raw = handler.rfile.read(length).decode("utf-8")
    return json.loads(raw or "{}")


def module_score(conn, user_id, module_id):
    row = conn.execute(
        """
        SELECT score, total
        FROM quiz_attempts
        WHERE user_id = ? AND module_id = ? AND quiz_type = 'module'
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (user_id, module_id),
    ).fetchone()
    if not row or row["total"] == 0:
        return None
    return round(row["score"] * 100 / row["total"])


def build_adaptive_path(conn, user_id):
    path = []
    for module in MODULES:
        score = module_score(conn, user_id, module["id"])
        visits = conn.execute(
            "SELECT visits, time_seconds FROM module_progress WHERE user_id = ? AND module_id = ?",
            (user_id, module["id"]),
        ).fetchone()

        if score is None:
            status = "Ξεκίνα εδώ" if not path else "Κλειδωμένη μέχρι να προχωρήσεις"
            action = "study"
        elif score < 60:
            status = "Χρειάζεται επανάληψη"
            action = "review"
        elif score < 85:
            status = "Καλή πρόοδος"
            action = "next"
        else:
            status = "Υψηλή επίδοση"
            action = "challenge"

        path.append(
            {
                "module_id": module["id"],
                "score": score,
                "visits": visits["visits"] if visits else 0,
                "time_seconds": visits["time_seconds"] if visits else 0,
                "status": status,
                "action": action,
            }
        )
    return path


def submit_quiz(payload):
    user_id = int(payload["user_id"])
    module_id = payload.get("module_id", "review")
    quiz_type = payload.get("quiz_type", "module")
    answers = payload.get("answers", {})
    seconds = int(payload.get("seconds", 0))

    questions = REVIEW_QUIZ if quiz_type == "review" else get_questions_for_module(module_id)
    score = 0
    details = []

    for question in questions:
        selected = answers.get(question["id"])
        is_correct = selected == question["answer"]
        score += 1 if is_correct else 0
        details.append(
            {
                "question_id": question["id"],
                "selected": selected,
                "correct": question["answer"],
                "is_correct": is_correct,
                "explanation": question["explanation"],
            }
        )

    with db() as conn:
        cur = conn.execute(
            """
            INSERT INTO quiz_attempts(user_id, module_id, quiz_type, score, total, time_seconds, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (user_id, module_id, quiz_type, score, len(questions), seconds, int(time.time())),
        )
        attempt_id = cur.lastrowid
        for detail in details:
            conn.execute(
                """
                INSERT INTO quiz_answers(attempt_id, question_id, selected_answer, correct_answer, is_correct)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    attempt_id,
                    detail["question_id"],
                    detail["selected"],
                    detail["correct"],
                    1 if detail["is_correct"] else 0,
                ),
            )
        conn.commit()
        path = build_adaptive_path(conn, user_id)

    percentage = round(score * 100 / len(questions)) if questions else 0
    if percentage < 60:
        recommendation = "Προτείνεται επανάληψη της θεωρίας και άσκηση με hints."
    elif percentage < 85:
        recommendation = "Μπορείς να συνεχίσεις στην επόμενη ενότητα και να κάνεις ένα επαναληπτικό quiz αργότερα."
    else:
        recommendation = "Ξεκλειδώνεται προχωρημένη πρόκληση με δυσκολότερες ερωτήσεις."

    return {
        "score": score,
        "total": len(questions),
        "percentage": percentage,
        "details": details,
        "recommendation": recommendation,
        "adaptive_path": path,
    }


def report_for_user(user_id):
    question_lookup = {
        question["id"]: question
        for questions in QUESTION_BANK.values()
        for question in questions
    }

    with db() as conn:
        attempts = conn.execute(
            """
            SELECT module_id, quiz_type, score, total, time_seconds, created_at
            FROM quiz_attempts
            WHERE user_id = ?
            ORDER BY created_at DESC
            """,
            (user_id,),
        ).fetchall()
        progress = conn.execute(
            "SELECT module_id, visits, time_seconds, last_visit FROM module_progress WHERE user_id = ?",
            (user_id,),
        ).fetchall()
        common_errors = conn.execute(
            """
            SELECT question_id, COUNT(*) AS mistakes
            FROM quiz_answers qa
            JOIN quiz_attempts at ON at.id = qa.attempt_id
            WHERE at.user_id = ? AND qa.is_correct = 0
            GROUP BY question_id
            ORDER BY mistakes DESC
            LIMIT 5
            """,
            (user_id,),
        ).fetchall()
        activity_attempts = conn.execute(
            """
            SELECT module_id, activity_title, matched_terms, total_terms, is_successful, created_at
            FROM activity_attempts
            WHERE user_id = ?
            ORDER BY created_at DESC
            """,
            (user_id,),
        ).fetchall()
        activity_difficulties = conn.execute(
            """
            SELECT module_id, activity_title, COUNT(*) AS misses
            FROM activity_attempts
            WHERE user_id = ? AND is_successful = 0
            GROUP BY module_id, activity_title
            ORDER BY misses DESC
            LIMIT 5
            """,
            (user_id,),
        ).fetchall()
        path = build_adaptive_path(conn, user_id)

    total_correct = sum(row["score"] for row in attempts)
    total_questions = sum(row["total"] for row in attempts)
    average = round(total_correct * 100 / total_questions) if total_questions else 0
    total_study_seconds = sum(row["time_seconds"] for row in progress) + sum(
        row["time_seconds"] for row in attempts
    )
    completed_modules = sum(1 for item in path if item["score"] is not None and item["score"] >= 60)

    return {
        "average": average,
        "total_study_seconds": total_study_seconds,
        "completed_modules": completed_modules,
        "total_modules": len(MODULES),
        "attempts": [dict(row) for row in attempts],
        "recent_attempts": [dict(row) for row in attempts[:5]],
        "progress": [dict(row) for row in progress],
        "common_errors": [
            {
                **dict(row),
                "prompt": question_lookup.get(row["question_id"], {}).get("prompt", row["question_id"]),
            }
            for row in common_errors
        ],
        "activity_attempts": [dict(row) for row in activity_attempts],
        "activity_difficulties": [dict(row) for row in activity_difficulties],
        "adaptive_path": path,
    }


class AppHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
    }

    def end_headers(self):
        if not self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
            self.send_header("Pragma", "no-cache")
        super().end_headers()

    def translate_path(self, path):
        parsed = urlparse(path)
        clean = parsed.path.lstrip("/") or "index.html"
        if parsed.path.startswith("/api/"):
            return str(STATIC_DIR / "index.html")
        return str(STATIC_DIR / clean)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/content":
            qs = parse_qs(parsed.query)
            user_id = int(qs.get("user_id", [0])[0] or 0)
            path = []
            if user_id:
                with db() as conn:
                    path = build_adaptive_path(conn, user_id)
            json_response(self, {"modules": MODULES, "review_quiz": REVIEW_QUIZ, "adaptive_path": path})
            return

        if parsed.path.startswith("/api/quiz/"):
            module_id = parsed.path.split("/")[-1]
            questions = REVIEW_QUIZ if module_id == "review" else get_questions_for_module(module_id)
            public_questions = [
                {key: value for key, value in question.items() if key != "answer"} for question in questions
            ]
            json_response(self, {"questions": public_questions})
            return

        if parsed.path == "/api/report":
            qs = parse_qs(parsed.query)
            user_id = int(qs.get("user_id", [0])[0] or 0)
            if not user_id:
                json_response(self, {"error": "Missing user_id"}, 400)
                return
            json_response(self, report_for_user(user_id))
            return

        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/users":
            payload = read_json(self)
            mode = (payload.get("mode") or "register").strip().lower()
            name = (payload.get("name") or "Μαθητής").strip()
            email = (payload.get("email") or "").strip().lower() or None
            with db() as conn:
                if email:
                    existing = conn.execute(
                        "SELECT id, name, email FROM users WHERE email = ?",
                        (email,),
                    ).fetchone()
                    if existing:
                        json_response(self, dict(existing))
                        return
                if mode == "login":
                    json_response(self, {"error": "User not found"}, 404)
                    return
                if mode == "register" and not email:
                    json_response(self, {"error": "Email is required"}, 400)
                    return
                cur = conn.execute(
                    "INSERT INTO users(name, email, created_at) VALUES (?, ?, ?)",
                    (name, email, int(time.time())),
                )
                conn.commit()
                json_response(self, {"id": cur.lastrowid, "name": name, "email": email})
            return

        if parsed.path == "/api/visit":
            payload = read_json(self)
            user_id = int(payload["user_id"])
            module_id = payload["module_id"]
            seconds = int(payload.get("seconds", 0))
            if not get_module(module_id):
                json_response(self, {"error": "Unknown module"}, 404)
                return
            now = int(time.time())
            with db() as conn:
                conn.execute(
                    """
                    INSERT INTO module_progress(user_id, module_id, visits, time_seconds, last_visit)
                    VALUES (?, ?, 1, ?, ?)
                    ON CONFLICT(user_id, module_id)
                    DO UPDATE SET
                        visits = visits + 1,
                        time_seconds = time_seconds + excluded.time_seconds,
                        last_visit = excluded.last_visit
                    """,
                    (user_id, module_id, seconds, now),
                )
                conn.commit()
            json_response(self, {"ok": True})
            return

        if parsed.path == "/api/quiz/submit":
            try:
                json_response(self, submit_quiz(read_json(self)))
            except (KeyError, ValueError) as exc:
                json_response(self, {"error": str(exc)}, 400)
            return

        if parsed.path == "/api/activity/submit":
            payload = read_json(self)
            user_id = int(payload["user_id"])
            module_id = payload["module_id"]
            title = (payload.get("title") or "Δραστηριότητα").strip()
            answer = (payload.get("answer") or "").strip()
            terms = payload.get("terms") or []
            answer_lower = answer.lower()
            matched = sum(1 for term in terms if str(term).lower() in answer_lower)
            total = len(terms)
            is_successful = total > 0 and matched == total

            with db() as conn:
                conn.execute(
                    """
                    INSERT INTO activity_attempts(
                        user_id, module_id, activity_title, answer_text,
                        matched_terms, total_terms, is_successful, created_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (user_id, module_id, title, answer, matched, total, 1 if is_successful else 0, int(time.time())),
                )
                conn.commit()

            json_response(
                self,
                {
                    "matched_terms": matched,
                    "total_terms": total,
                    "is_successful": is_successful,
                    "missing_terms": [term for term in terms if str(term).lower() not in answer_lower],
                },
            )
            return

        json_response(self, {"error": "Not found"}, 404)


if __name__ == "__main__":
    init_db()
    server = ThreadingHTTPServer(("127.0.0.1", 8000), AppHandler)
    print("JavaScript Tutor running at http://127.0.0.1:8000")
    server.serve_forever()
