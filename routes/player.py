from flask import Blueprint, render_template, abort
import json

player = Blueprint("player", __name__)

with open("data/tests.json", "r", encoding="utf-8") as f:
    tests = json.load(f)


@player.route("/player/<test_id>")
def player_page(test_id):

    item = next(
        (x for x in tests if x["id"] == test_id),
        None
    )

    if not item:
        abort(404)

    return render_template(
        "player.html",
        test=item
    )
