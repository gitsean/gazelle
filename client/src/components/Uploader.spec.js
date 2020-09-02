import { shallowMount } from "@vue/test-utils";
import Uploader from "@/components/Uploader.vue";

describe("Uploader.vue", () => {
  it("initial status renders form when loaded", () => {
    const wrapper = shallowMount(Uploader, {
      data() {
        return {
          uploadedFiles: [],
          uploadError: null,
          currentStatus: 0,
          uploadFieldName: "csv",
        };
      },
    });
    const div = wrapper.find("div");
    const form = div.find("form");
    expect(form.exists()).toBe(true);
  });
});
