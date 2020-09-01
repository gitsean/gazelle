import { shallowMount } from "@vue/test-utils";
import Upload from "@/components/Upload.vue";

describe("Upload.vue", () => {
  it("renders upoad button when loaded", () => {
    const wrapper = shallowMount(Upload, {
      propsData: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
