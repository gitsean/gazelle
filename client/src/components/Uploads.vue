<template>
  <table v-if="hasFiles && isLoaded">
    <tr v-for="(file, index) in files" :key="index">
      <td>{{ file }}</td>
      <td><button :click="fileLink[index]" download>Download</button></td>
    </tr>
  </table>

  <p v-else-if="!hasFiles && isLoading">Getting files...</p>
  <p v-else-if="!hasFiles && isLoaded">No files have been uploaded.</p>
  <p v-else-if="isFailed">Something went wrong.</p>
</template>

<script>
import { uploads } from "@/services/file-upload.service";

const STATUS_LOADING = 0,
  STATUS_LOADED = 1,
  STATUS_ERROR = 2;

export default {
  name: "Uploads",
  data() {
    return {
      files: [],
      currentStatus: STATUS_LOADING,
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
  },
  methods: {
    get() {
      // get files from server
      this.currentStatus = STATUS_LOADING;

      uploads()
        .then((f) => {
          this.uploadedFiles = f;
          this.currentStatus = STATUS_LOADED;
        })
        .catch((err) => {
          this.getError = err.response;
          this.currentStatus = STATUS_ERROR;
        });
    },
  },
};
</script>

<style scoped></style>
