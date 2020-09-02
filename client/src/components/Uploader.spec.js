import { shallowMount } from "@vue/test-utils";
import Uploader from "@/components/Uploader.vue";

let wrapper;

beforeEach(() => {
  wrapper = shallowMount(Uploader, {
    data() {
      return {
        uploadedFiles: [],
        uploadError: null,
        currentStatus: 0,
        uploadFieldName: "csv",
      };
    },
  });
});

afterEach(() => {
  wrapper.destroy();
});

describe("Uploader.vue", () => {
  it("initial status renders form when loaded", () => {
    const form = wrapper.find("form");
    expect(form.exists()).toBe(true);
  });
  it("form allows only one upload", () => {
    const input = wrapper.find("input");
    expect(input.attributes().multiple).toBe(undefined);
  });
});
