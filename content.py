from curriculum.modules import MODULES
from curriculum.questions import QUESTION_BANK


REVIEW_QUIZ = [
    QUESTION_BANK["intro"][0],
    QUESTION_BANK["intro"][5],
    QUESTION_BANK["intro"][7],
    QUESTION_BANK["basics"][1],
    QUESTION_BANK["basics"][4],
    QUESTION_BANK["basics"][6],
    QUESTION_BANK["functions"][1],
    QUESTION_BANK["functions"][4],
    QUESTION_BANK["functions"][7],
    QUESTION_BANK["arrays"][2],
    QUESTION_BANK["arrays"][4],
    QUESTION_BANK["arrays"][7],
    QUESTION_BANK["objects"][2],
    QUESTION_BANK["objects"][5],
    QUESTION_BANK["objects"][6],
    QUESTION_BANK["dom_async"][0],
    QUESTION_BANK["dom_async"][5],
    QUESTION_BANK["dom_async"][7],
    QUESTION_BANK["debug_project"][1],
    QUESTION_BANK["debug_project"][4],
    QUESTION_BANK["debug_project"][7],
    QUESTION_BANK["storage"][1],
    QUESTION_BANK["storage"][4],
    QUESTION_BANK["storage"][7],
    QUESTION_BANK["quality_project"][0],
    QUESTION_BANK["quality_project"][3],
    QUESTION_BANK["quality_project"][6],
]

REVIEW_QUIZ.extend([
    QUESTION_BANK["intro"][8],
    QUESTION_BANK["basics"][9],
    QUESTION_BANK["functions"][10],
    QUESTION_BANK["arrays"][11],
    QUESTION_BANK["objects"][8],
    QUESTION_BANK["dom_async"][9],
    QUESTION_BANK["debug_project"][10],
    QUESTION_BANK["storage"][11],
    QUESTION_BANK["quality_project"][10],
])


def get_module(module_id):
    return next((module for module in MODULES if module["id"] == module_id), None)


def get_questions_for_module(module_id):
    return QUESTION_BANK.get(module_id, [])
