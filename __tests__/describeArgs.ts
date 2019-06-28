import { spyCall, spyResult } from "./__utils";

import { describeArgs } from "../src";

describe("describeArgs", () => {
  const validateSpy = jest.fn(() => true);
  const consoleSpy = jest.spyOn(console, "log");

  const options = [
    { option: "help", shortcut: "h", description: "Display the help text" },
    {
      option: "two",
      shortcut: "t",
      description: "The second option",
      validate: validateSpy
    },
    {
      option: "final",
      shortcut: "",
      description: "The final option"
    }
  ];

  const NAME = "Medea";
  const opts = describeArgs(NAME, options);

  beforeEach(() => {
    consoleSpy.mockReset();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it("should have stored options map", () => {
    expect(opts.__opts instanceof Map).toBeTruthy();
  });

  it("should call console.log with formatted welcome string", () => {
    opts.welcome();

    expect(consoleSpy).toHaveBeenCalled();
    expect(spyCall(consoleSpy).includes(NAME)).toBeTruthy();
  });

  it("should call console.log for each option in logged options", () => {
    opts.log("two");
    expect(consoleSpy).toHaveBeenCalledTimes(3);

    consoleSpy.mockReset();

    opts.log("two", ["shortcut", "option"]);
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(spyCall(consoleSpy, 0, 1)).toEqual("two");
  });

  it("should not call console.log when key does not exist", () => {
    opts.log("JEST");
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should call console.log for each option plus format lines", () => {
    opts.helpText();

    const len = options.length;

    const helpTextLogs = 5;
    const logLogs = (3 + 1) * len;

    expect(consoleSpy).toHaveBeenCalledTimes(helpTextLogs + logLogs);
  });

  it("should throw error if key does not exist", () => {
    expect(() => opts.validate("jest")).toThrow();
  });

  it("should return true if no validate to call", () => {
    const result = opts.validate("help");

    expect(result).toBeTruthy();
  });

  it("should call validate with data", () => {
    const data = "somedata";

    const result = opts.validate("two", data);

    expect(validateSpy).toHaveBeenCalledWith(data);
    expect(result).toBe(true);

    validateSpy.mockReset();
  });
});
