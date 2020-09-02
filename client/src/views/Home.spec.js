import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";

describe("Home.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Home);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("contains uploader component", () => {
    expect(wrapper.name()).toBe("Home");
    expect(wrapper.findComponent({ name: "Uploader" }).exists()).toBe(true);
  });
});
