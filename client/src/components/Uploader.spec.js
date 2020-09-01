import { shallowMount } from "@vue/test-utils";
import Uploader from "@/components/Uploader.vue";

describe("Uploader.vue", () => {
  it("renders upload button when loaded", () => {
    const wrapper = shallowMount(Uploader);
    expect(wrapper.contains("form")).toBe(true);
  });
});
