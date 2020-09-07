import * as axios from "axios";

const BASE_URL = "http://localhost:5000";

async function upload(formData) {
  const url = `${BASE_URL}/uploader`;
  const uploaded = await axios.post(url, formData);
  return { url: `${BASE_URL}/download/${uploaded.data}` };
}

async function uploads() {
  const url = `${BASE_URL}/uploader`;
  const filesRequest = await axios.get(url);
  console.log(filesRequest.data);
  return filesRequest.data;
}

export { upload, uploads };
