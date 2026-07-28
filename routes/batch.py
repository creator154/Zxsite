from flask import Blueprint, render_template, abort
import json

batch = Blueprint("batch", __name__)

with open("data/batches.json", "r", encoding="utf-8") as f:
    batches = json.load(f)

with open("data/subjects.json", "r", encoding="utf-8") as f:
    subjects = json.load(f)


@batch.route("/batch/<batch_id>")
def batch_page(batch_id):

    item = next(
        (x for x in batches if x["id"] == batch_id),
        None
    )

    if not item:
        abort(404)

    return render_template(
        "batch.html",
        batch=item,
        subjects=subjects
    )
