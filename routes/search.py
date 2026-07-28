from flask import Blueprint, render_template, request
import json

search = Blueprint("search", __name__)

with open("data/batches.json", "r", encoding="utf-8") as f:
    batches = json.load(f)


@search.route("/search")
def search_page():

    query = request.args.get("q", "").lower()

    if query:

        result = [
            b for b in batches
            if query in b["name"].lower()
        ]

    else:
        result = batches

    return render_template(
        "search.html",
        batches=result,
        query=query
    )
