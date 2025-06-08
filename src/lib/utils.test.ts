import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("should merge basic classes", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("should merge with conditional classes", () => {
    expect(cn("class1", { class2: true, class3: false })).toBe("class1 class2");
  });

  it("should merge with conflicting classes", () => {
    expect(cn("class1", "class2", "class1")).toBe("class1 class2 class1");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("", null, undefined, false)).toBe("");
  });

  it("should handle mixed truthy and falsy conditional classes", () => {
    expect(
      cn("class1", {
        class2: true,
        class3: false,
        class4: "hello",
        class5: null,
      })
    ).toBe("class1 class2 class4");
  });

  it("should correctly merge multiple string arguments", () => {
    expect(cn("class1", "class2", "class3")).toBe("class1 class2 class3");
  });

  it("should correctly merge multiple object arguments", () => {
    expect(
      cn({ class1: true, class2: false }, { class3: true, class4: true })
    ).toBe("class1 class3 class4");
  });

  it("should correctly merge mixed string and object arguments", () => {
    expect(
      cn("class1", { class2: true, class3: false }, "class4", { class5: true })
    ).toBe("class1 class2 class4 class5");
  });
});
