import os
from flask import Flask, jsonify, request, send_file, abort
from werkzeug.utils import secure_filename
from flask_cors import CORS
import glob
import pandas as pd


# configuration
DEBUG = True
UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'csv'}

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})


class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify('pong!')


@app.route('/uploader', methods=['POST', 'GET'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            raise InvalidUsage('No file found in request', status_code=406)
        f = request.files['file']
        if not allowed_file(f.filename):
            raise InvalidUsage('Invalid file extension', status_code=415)
        f.save(os.path.join(app.config['UPLOAD_FOLDER'], f.filename))
        return f.filename
    else:
        file_paths = glob.glob(f'./{app.config["UPLOAD_FOLDER"]}*.csv')
        files = [x.split('/')[-1:][0] for x in file_paths]
        return jsonify(files)


@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):

    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename), as_attachment=True)


@app.route('/table/<filename>', methods=['GET'])
def get_table(filename, page = 1):
    page = request.args.get('page', default = 1, type = int)
    size = request.args.get('size', default = 100, type = int)
    begin = (page - 1) * size
    end = begin + size
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    df = pd.read_csv(file_path)
    df['state'] = df['state'].fillna('BLANK')
    df['date'] = pd.to_datetime(df['date'])
    if end > len(df):
        end = len(df)
        begin = end - size
    if begin < 0:
        begin = 0
    records = df[begin:end].to_json(orient="records")
    grouped = df.groupby([df['date'].dt.year]).agg({'count'})
    trimmed = grouped.loc[0:, ('date', 'count')]
    full = pd.DataFrame(grouped.index)
    full['count'] = trimmed.reset_index()['date', 'count']
    full.sort_values(by='count', inplace=True, ascending=False)
    stats = full[0:5].to_json(orient="records")
    return jsonify({'records': records, 'total': len(df.index), 'stats': stats})


if __name__ == '__main__':
    app.run()
