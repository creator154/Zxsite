from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/batch/<batch>")
def batch(batch):
    return render_template(
        "batch.html",
        batch=batch
    )

@app.route("/tests/<batch>")
def tests(batch):
    return render_template(
        "tests.html",
        batch=batch
    )

@app.route("/dpp/<batch>")
def dpp(batch):
    return render_template(
        "dpp.html",
        batch=batch
    )

if __name__ == "__main__":
    app.run()
