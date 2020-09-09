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

async function records(fname, page) {
  page = page ? page : 1;
  const url = `${BASE_URL}/table/${fname}?page=${page}`;
  const recordsRequest = await axios.get(url);
  let { records, total, stats } = recordsRequest.data;
  stats = JSON.parse(stats);
  records = JSON.parse(records).map((x) => {
    const { guid, ...rest } = x;
    guid;
    return rest;
  });
  return { records, total, stats };
}

export { upload, uploads, records };
