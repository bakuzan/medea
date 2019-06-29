import { spyCall } from "./__utils";

import { createClient } from "../src";

const output = {
  _: [],
  help: true,
  two: true,
  m: "hello"
};

jest.mock("minimist", () => {
  return jest.fn(v => (v.length ? output : { _: [] }));
});

describe("createClient", () => {
  const validateSpy = jest.fn(() => true);
  const consoleSpy = jest.spyOn(console, "log");

  const NAME = "Medea";
  const values = ["", "", "help", "two", "m"];
  let cli = createClient(NAME);

  beforeEach(() => {
    cli = createClient(NAME)
      .addOption({
        option: "help",
        shortcut: "h",
        description: "Display the help text"
      })
      .addOption({
        option: "two",
        shortcut: "t",
        description: "The second option",
        validate: validateSpy
      })
      .addOption({
        option: "final",
        shortcut: "",
        description: "The final option"
      })
      .addOption({
        option: "medea",
        shortcut: "m",
        description: "test option"
      });

    consoleSpy.mockReset();
    validateSpy.mockReset();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it("should return name", () => {
    expect(cli.name()).toEqual(NAME);
  });

  it("should have stored options map", () => {
    expect(cli.__opts instanceof Map).toBeTruthy();
  });

  it("should have stored option", () => {
    cli.addOption({ option: "test", description: "yo" });

    expect(cli.__opts.get("test")).toEqual({
      option: "test",
      description: "yo"
    });
  });

  it("should call console.log with formatted welcome string", () => {
    cli.welcome();

    expect(consoleSpy).toHaveBeenCalled();
    expect(spyCall(consoleSpy).includes(NAME)).toBeTruthy();
  });

  it("should call console.log for each option in logged options", () => {
    cli.log("two");
    expect(consoleSpy).toHaveBeenCalledTimes(3);

    consoleSpy.mockReset();

    cli.log("two", ["shortcut", "option"]);
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(spyCall(consoleSpy, 0, 1)).toEqual("two");
  });

  it("should not call console.log when key does not exist", () => {
    cli.log("JEST");
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should call console.log for each option plus format lines", () => {
    cli.helpText();

    const len = cli.__opts.size;

    const helpTextLogs = 5;
    const logLogs = (3 + 1) * len;

    expect(consoleSpy).toHaveBeenCalledTimes(helpTextLogs + logLogs);
  });

  it("should throw error if key does not exist", () => {
    expect(() => cli.validate("jest")).toThrow();
  });

  it("should return true if no validate to call", () => {
    const result = cli.validate("help");

    expect(result).toBeTruthy();
  });

  xit("should call validate with data", () => {
    const data = "somedata";
    const option = {
      option: "zim",
      shortcut: "z",
      description: "zim option",
      validate: validateSpy
    };

    cli.addOption(option);

    const result = cli.validate("zim", data);

    expect(validateSpy).toHaveBeenCalledWith(option, data);
    expect(result).toBe(true);
  });

  it("should store parsed args", () => {
    const result = cli.parse(values);

    expect(result.__values).toEqual(output);
  });

  it("should check if any args are stored", () => {
    expect(cli.parse([]).any()).toEqual(false);
    expect(cli.parse(values).any()).toEqual(true);
  });

  it("should check if key exists", () => {
    const args = cli.parse(values);

    expect(args.has("two")).toEqual(true);
    expect(args.has("medea")).toEqual(true);
    expect(() => args.has("jester")).toThrow();
  });

  it("should return values", () => {
    const args = cli.parse(values);

    expect(args.get()).toEqual(output);
  });

  it("should return value of key", () => {
    const args = cli.parse(values);

    expect(args.get("two")).toEqual(true);
    expect(args.get("medea")).toEqual("hello");
    expect(args.get("jester")).toEqual(undefined);
  });
});
