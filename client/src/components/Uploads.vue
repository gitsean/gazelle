<template>
  <div class="container">
    <h2>Uploaded Files</h2>
    <table class="table" v-if="hasFiles && isLoaded">
      <tr v-for="(file, index) in files" :key="index">
        <td>{{ file.name }}</td>
        <td>
          <a :href="file.url" download>Download</a>
        </td>
        <td>
          <button v-on:click="getItems(file.name)">Display</button>
        </td>
      </tr>
    </table>

    <p v-else-if="!hasFiles && isLoading">Getting files...</p>
    <p v-else-if="!hasFiles && isLoaded">No files have been uploaded.</p>
    <p v-else-if="isFailed">Something went wrong.</p>

    <h2>File Contents</h2>
    <div>
      <div v-if="needsPages">
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item">
              <a v-on:click="getPage('down')" class="page-link" href="#">Previous</a>
            </li>
            <li class="page-item">
              <a v-on:click="getPage('up')" class="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>
      </div>
      <b-table v-if="isRecords" striped hover :items="items"></b-table>
    </div>
  </div>
</template>

<script>
import { uploads, records } from "@/services/file-upload.service";
import { BTable } from "bootstrap-vue";

const STATUS_LOADING = 0,
  STATUS_LOADED = 1,
  STATUS_ERROR = 2,
  STATUS_TABLE_RECORDS = 0,
  STATUS_NO_TABLE_RECORDS = 1,
  MAX_ITEMS = 100;

export default {
  name: "Uploads",
  components: { BTable },
  data() {
    return {
      files: [],
      currentStatus: STATUS_LOADING,
      tableStatus: STATUS_NO_TABLE_RECORDS,
      items: [],
      file: null,
      totalItems: 0,
      page: 1
    };
  },
  computed: {
    hasFiles() {
      return this.files && this.files.length > 0;
    },
    isLoading() {
      return this.currentStatus === STATUS_LOADING;
    },
    isLoaded() {
      return this.currentStatus === STATUS_LOADED;
    },
    isFailed() {
      return this.currentStatus === STATUS_ERROR;
    },
    fileLink(file) {
      // Call server to download file
      return file;
    },
    isRecords() {
      return this.tableStatus === STATUS_TABLE_RECORDS;
    },
    needsPages() {
      return this.totalItems > MAX_ITEMS;
    }
  },
  methods: {
    getPage(dir) {
      this.tableStatus = STATUS_NO_TABLE_RECORDS;
      this.page = dir == "down" ? this.page - 1 : this.page + 1;
      if (this.page < 0) {
        this.page = 0;
      }
      if (this.page > this.totalItems / MAX_ITEMS) {
        this.page = this.totalItems / MAX_ITEMS;
      }
      records(this.file, this.page)
        .then(f => {
          this.items = f.records;
          this.totalItems = f.total;
          this.tableStatus = STATUS_TABLE_RECORDS;
        })
        .catch(err => {
          console.error(`Something unexpected when getting records\n ${err}`);
        });
    },
    getItems(fname) {
      this.tableStatus = STATUS_NO_TABLE_RECORDS;
      this.file = fname;
      records(fname)
        .then(f => {
          console.log(f);
          this.items = f.records;
          this.totalItems = f.total;
          this.tableStatus = STATUS_TABLE_RECORDS;
        })
        .catch(err => {
          console.error(`Something unexpected when getting records\n ${err}`);
        });
    },
    getUploads() {
      // get files from server
      this.currentStatus = STATUS_LOADING;

      uploads()
        .then(f => {
          this.files = f;
          this.currentStatus = STATUS_LOADED;
        })
        .catch(err => {
          this.getError = err.response;
          this.currentStatus = STATUS_ERROR;
        });
    }
  },
  mounted() {
    this.getUploads();
  }
};
</script>

<style scoped>
h2 {
  margin-top: 40px;
}
</style>
