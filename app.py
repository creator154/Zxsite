
from flask import Flask, render_template

app = Flask(__name__)

batches = [
    {"id": 1, "name": "Yakeen NEET Hindi 2027"},
    {"id": 2, "name": "Yakeen NEET English 2027"},
    {"id": 3, "name": "Lakshya NEET 2027"}
]

@app.route("/")
def home():
    return render_template("index.html", batches=batches)

if __name__ == "__main__":
    app.run(debug=True)
