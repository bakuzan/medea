import { parseArgs } from "../src";

const output = {
  _: [],
  jest: true,
  medea: "hello"
};

jest.mock("minimist", () => {
  return jest.fn(v => (v.length ? output : { _: [] }));
});

describe("parseArgs", () => {
  const values = ["", "", "jest", "medea"];

  it("should store parsed args", () => {
    const result = parseArgs(values);

    expect(result.__values).toEqual(output);
  });

  it("should check if any args are stored", () => {
    expect(parseArgs([]).any()).toEqual(false);
    expect(parseArgs(values).any()).toEqual(true);
  });

  it("should check if key exists", () => {
    const args = parseArgs(values);

    expect(args.has("jest")).toEqual(true);
    expect(args.has("jester")).toEqual(false);
  });

  it("should return values", () => {
    const args = parseArgs(values);

    expect(args.get()).toEqual(output);
  });

  it("should return value of key", () => {
    const args = parseArgs(values);

    expect(args.get("jest")).toEqual(true);
    expect(args.get("medea")).toEqual("hello");
    expect(args.get("jester")).toEqual(undefined);
  });
});
