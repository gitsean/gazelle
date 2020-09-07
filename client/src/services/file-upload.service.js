import * as axios from "axios";

const BASE_URL = "http://localhost:5000";

const mapFileNames = (fname) => {
  return {
    name: fname,
    url: `${BASE_URL}/download/${fname}`,
  };
};

async function upload(formData) {
  const url = `${BASE_URL}/uploader`;
  const uploaded = await axios.post(url, formData);
  return { url: `${BASE_URL}/download/${uploaded.data}` };
}

async function uploads() {
  const url = `${BASE_URL}/uploader`;
  const filesRequest = await axios.get(url);
  const fileNamesAndUrls = filesRequest.data.map(mapFileNames);
  return fileNamesAndUrls;
}

export { upload, uploads };
