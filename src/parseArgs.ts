import minimist from "minimist";

export default function parseArgs(argv: string[], opts?: minimist.Opts) {
  const __values = minimist(argv.slice(2), opts);

  return {
    __values,
    any() {
      return (
        Object.keys(this.__values).some(x => x !== "_") ||
        this.__values._.length !== 0
      );
    },
    has(key: string) {
      return this.__values.hasOwnProperty(key);
    },
    get(key?: string) {
      return key ? this.__values[key] : this.__values;
    }
  };
}
