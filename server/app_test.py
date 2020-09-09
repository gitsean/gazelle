import glob
import json
import os


def test_setup(app, client):
    uploads = app.config["UPLOAD_FOLDER"]
    folder = f'./{uploads}'
    files = f'./{uploads}*.csv'
    test_file = f'./{uploads}delete.csv'
    folder_path = glob.glob(folder)
    if not folder_path:
        os.mkdir(uploads)
    folder_path = glob.glob(folder)
    assert folder_path
    file_paths = glob.glob(files)
    f = open(test_file, 'w+')
    f.write('first_name, last_name, email, phone\n')
    f.write('Kim, Grimm, kim_grimm@aol.com, 123-456-6789')
    f.close()
    assert file_paths


def test_sanity(app, client):
    res = client.get('/ping')
    assert res.status_code == 200


def test_uploader(app, client):
    uploads = app.config["UPLOAD_FOLDER"]
    files = f'./{uploads}*.csv'
    file_paths = glob.glob(files)
    assert file_paths
    file_count = len(file_paths)
    res = client.get('/uploader')
    print(res.data)
    parsed = json.loads(res.data)
    assert len(parsed) == file_count


def test_table(app, client):
    res = client.get('/table/delete.csv')
    assert len(json.loads(res.data)) == 1


def test_teardown(app, client):
    uploads = app.config["UPLOAD_FOLDER"]
    files = f'./{uploads}*.csv'
    file_paths = glob.glob(files)
    initial_file_count = len(file_paths)
    test_file = f'./{uploads}delete.csv'
    os.remove(test_file)
    file_paths = glob.glob(files)
    updated_file_count = len(file_paths)
    assert updated_file_count == initial_file_count - 1
