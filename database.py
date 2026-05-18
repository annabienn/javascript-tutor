from pathlib import Path
import sqlite3


DB_PATH = Path(__file__).parent / "learning_progress.sqlite3"


SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS module_progress (
    user_id INTEGER NOT NULL,
    module_id TEXT NOT NULL,
    visits INTEGER NOT NULL DEFAULT 0,
    time_seconds INTEGER NOT NULL DEFAULT 0,
    last_visit INTEGER NOT NULL,
    PRIMARY KEY (user_id, module_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    module_id TEXT NOT NULL,
    quiz_type TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    time_seconds INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS quiz_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id INTEGER NOT NULL,
    question_id TEXT NOT NULL,
    selected_answer TEXT,
    correct_answer TEXT NOT NULL,
    is_correct INTEGER NOT NULL,
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id)
);

CREATE TABLE IF NOT EXISTS activity_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    module_id TEXT NOT NULL,
    activity_title TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    matched_terms INTEGER NOT NULL,
    total_terms INTEGER NOT NULL,
    is_successful INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
"""


def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.executescript(SCHEMA)
        columns = [row[1] for row in conn.execute("PRAGMA table_info(users)").fetchall()]
        if "email" not in columns:
            conn.execute("ALTER TABLE users ADD COLUMN email TEXT")
        conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email)")
        conn.commit()
