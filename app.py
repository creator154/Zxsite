from flask import Flask, render_template
import json

app = Flask(__name__)

with open("data/batches.json", "r", encoding="utf-8") as f:
    batches = json.load(f)

@app.route("/")
def home():
    return render_template("home.html", batches=batches)

@app.route("/batch/<batch_id>")
def batch(batch_id):
    batch = next((b for b in batches if b["id"] == batch_id), None)
    if not batch:
        return "Batch Not Found", 404
    return render_template("batch.html", batch=batch)

if __name__ == "__main__":
    app.run(debug=True)
