import glob, json, os

def test_sanity(app, client):
    res = client.get('/ping')
    assert res.status_code == 200

def test_uploader(app, client):
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
    if not file_paths:
        f = open(test_file, 'w+')
        f.close()
    file_paths = glob.glob(files)
    assert file_paths
    file_count = len(file_paths)
    res = client.get('/uploader')
    print(res.data)
    parsed = json.loads(res.data)
    assert len(parsed) == file_count
    if(glob.glob(f'./{app.config["UPLOAD_FOLDER"]}delete.csv')):
        os.remove(f'./{app.config["UPLOAD_FOLDER"]}delete.csv')
    