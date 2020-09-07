import { shallowMount } from "@vue/test-utils";
import Uploads from "@/components/Uploads.vue";

let wrapper;

beforeEach(() => {
  wrapper = shallowMount(Uploads, {
    data() {
      return {
        files: [],
        currentStatus: null,
      };
    },
  });
});

afterEach(() => {
  wrapper.destroy();
});

describe("Uploads.vue", () => {
  it("table of files shows when files are loaded", async () => {
    await wrapper.setData({
      files: ["justfile.csv"],
      currentStatus: 1,
    });

    const list = wrapper.find("table");
    expect(list.exists()).toBe(true);
  });
  it("message shows when loading", async () => {
    await wrapper.setData({
      files: [],
      currentStatus: 0,
    });
    const loading = wrapper.find("p");
    expect(loading.text()).toMatch("Getting files...");
  });
  it("message shows when no results", async () => {
    await wrapper.setData({
      files: [],
      currentStatus: 1,
    });
    const loading = wrapper.find("p");
    expect(loading.text()).toMatch("No files have been uploaded.");
  });
});
