<template>
  <div class="home">
    <Uploader />
    <Uploads />
  </div>
</template>

<script>
import Uploader from "@/components/Uploader.vue";
import Uploads from "@/components/Uploads.vue";

export default {
  name: "Home",
  components: {
    Uploader,
    Uploads,
  },
};
</script>
