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

  it("input allows only CSV file type", () => {
    const input = wrapper.find("input");
    expect(input.attributes().accept).toBe("csv");
  });

  it("shows success message upon successful upload", async () => {
    await wrapper.setData({
      uploadedFiles: ["file.csv"],
      uploadError: false,
      currentStatus: 2,
    });
    const success = wrapper.find("h2");
    expect(success.text()).toMatch("Uploaded file successfully.");
  });

  it("shows failed message upon failed upload", async () => {
    await wrapper.setData({
      uploadedFiles: null,
      uploadError: true,
      currentStatus: 3,
    });
    const success = wrapper.find("h2");
    expect(success.text()).toMatch("Upload failed.");
  });
});
