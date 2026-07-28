from flask import Blueprint, render_template
import json

home = Blueprint("home", __name__)

with open("data/batches.json", "r", encoding="utf-8") as f:
    batches = json.load(f)

@home.route("/")
def index():
    return render_template(
        "home.html",
        batches=batches
    )
