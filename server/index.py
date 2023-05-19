# This Python file uses the following encoding: utf-8
from modules import get_score, all_categories
from flask_cors import CORS, cross_origin
from flask import Flask, request, jsonify, json

# App
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Home
@app.route('/', methods=['GET', 'POST'])
@cross_origin()
def main():
    if request.method == 'POST':
        data = request.json
        if data['type'] == 'get_score':
            data = get_score[str(data['id'])]

        elif data['type'] == 'all_categories':
            data = all_categories

        return jsonify(data)
    return '2'


if __name__ == '__main__':
    app.run(host='0.0.0.0')
