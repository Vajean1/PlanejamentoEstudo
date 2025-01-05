from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/simulado", methods=['GET', 'POST'])
def simulado():
    return render_template('simulado.html', questions=questions)

if __name__ == '__main__':
    app.run(debug=True)
