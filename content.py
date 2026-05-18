from curriculum.modules import MODULES
from curriculum.questions import QUESTION_BANK


REVIEW_QUIZ = [
    QUESTION_BANK["intro"][0],
    QUESTION_BANK["intro"][5],
    QUESTION_BANK["basics"][1],
    QUESTION_BANK["basics"][4],
    QUESTION_BANK["functions"][1],
    QUESTION_BANK["functions"][4],
    QUESTION_BANK["arrays"][2],
    QUESTION_BANK["arrays"][4],
    QUESTION_BANK["objects"][2],
    QUESTION_BANK["objects"][5],
    QUESTION_BANK["dom_async"][0],
    QUESTION_BANK["dom_async"][5],
    QUESTION_BANK["debug_project"][1],
    QUESTION_BANK["debug_project"][4],
]


def get_module(module_id):
    return next((module for module in MODULES if module["id"] == module_id), None)


def get_questions_for_module(module_id):
    return QUESTION_BANK.get(module_id, [])
