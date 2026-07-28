from flask import Blueprint, render_template, abort
import json

subject = Blueprint("subject", __name__)

with open("data/batches.json", "r", encoding="utf-8") as f:
    batches = json.load(f)

with open("data/subjects.json", "r", encoding="utf-8") as f:
    subjects = json.load(f)

with open("data/tests.json", "r", encoding="utf-8") as f:
    tests = json.load(f)


@subject.route("/subject/<batch_id>/<subject_id>")
def subject_page(batch_id, subject_id):

    batch = next(
        (x for x in batches if x["id"] == batch_id),
        None
    )

    if not batch:
        abort(404)

    subject = next(
        (x for x in subjects if x["id"] == subject_id),
        None
    )

    if not subject:
        abort(404)

    subject_tests = [
        t for t in tests
        if t["batch_id"] == batch_id
        and t["subject"] == subject_id
    ]

    return render_template(
        "subject.html",
        batch=batch,
        subject=subject,
        tests=subject_tests
    )
