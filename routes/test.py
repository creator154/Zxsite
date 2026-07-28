from flask import Blueprint, render_template, abort
import json

test = Blueprint("test", __name__)

with open("data/tests.json", "r", encoding="utf-8") as f:
    tests = json.load(f)


@test.route("/instructions/<test_id>")
def instructions(test_id):

    item = next(
        (x for x in tests if x["id"] == test_id),
        None
    )

    if not item:
        abort(404)

    return render_template(
        "instructions.html",
        test=item
    )
