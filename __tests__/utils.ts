import path from "path";

import { typedKeys, pathFix } from "../src/utils";

describe("pathFix", () => {
  it("should return correct path", () => {
    const resolveSpy = jest.spyOn(path, "resolve");
    const joinSpy = jest.spyOn(path, "join");

    pathFix("JEST");

    expect(resolveSpy).toHaveBeenCalledTimes(1);
    expect(joinSpy).toHaveBeenCalledTimes(1);

    resolveSpy.mockRestore();
    joinSpy.mockRestore();
  });
});

describe("typedKeys", () => {
  it("should return typed keys of an object", () => {
    const obj = { test: "hello", id: 1 };

    const result = typedKeys(obj);

    expect(result).toEqual(["test", "id"]);
  });
});
