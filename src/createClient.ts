import minimist from "minimist";

import { ClientController } from "./interfaces/ClientController";
import { CliOption } from "./interfaces/CliOption";
import { typedKeys } from "./utils";

const logAsterisks = () =>
  console.log("*".repeat(process.stdout.columns || 10));

const defaultLoggedProperties = ["option", "shortcut", "description"];

const getPadLength = (l: string[]) =>
  l.reduce((a, b) => (a.length > b.length ? a : b)).length;

export default function createClient(appName: string): ClientController {
  return {
    __name: appName,
    __opts: new Map<string, CliOption>(),
    __values: {} as minimist.ParsedArgs,
    addOption(option: CliOption) {
      this.__opts.set(option.option, option);
      return this;
    },
    parse(argv: string[], opts?: minimist.Opts) {
      this.__values = minimist(argv.slice(2), opts);
      return this;
    },
    any() {
      return (
        Object.keys(this.__values).some(x => x !== "_") ||
        this.__values._.length !== 0
      );
    },
    has(key: string) {
      const data = this.__opts.get(key);
      if (!data) {
        throw new Error(`Key does not exist. (Key: ${key})`);
      }

      const shortKey = data.shortcut || key;

      return (
        this.__values.hasOwnProperty(key) ||
        this.__values.hasOwnProperty(shortKey)
      );
    },
    get(key?: string, defaultValue?: any) {
      if (!key) {
        return this.__values;
      }

      const data = this.__opts.get(key);
      if (!data) {
        return defaultValue;
      }

      const shortValue = data.shortcut
        ? this.__values[data.shortcut]
        : undefined;

      return this.__values[key] || shortValue || defaultValue;
    },
    name() {
      return this.__name;
    },
    welcome() {
      const lenH = Math.ceil(appName.length / 2);
      const half = "*".repeat(
        Math.floor((process.stdout.columns || 10) / 2) - 1 - lenH
      );

      console.log(`${half} ${appName} ${half}`);

      return this;
    },
    helpText() {
      logAsterisks();
      console.log(`* Options`);
      logAsterisks();
      console.log(`*\r`);
      Array.from(this.__opts.entries()).forEach(([k]) => {
        this.log(k);
        console.log(`*\r`);
      });
      logAsterisks();

      return this;
    },
    log(key: string, loggedProperties = defaultLoggedProperties) {
      const d = this.__opts.get(key);

      if (d) {
        const padNum = getPadLength(loggedProperties);

        typedKeys(d).forEach(k => {
          const kStr = k as string;
          if (loggedProperties.includes(kStr)) {
            const v = d[k];
            console.log(`* ${kStr.padStart(padNum, " ")}: `, v || "None");
          }
        });
      }

      return this;
    },
    validate(key: string, other?: any): boolean {
      const data = this.__opts.get(key);
      if (!data) {
        throw new Error(`Key does not exist. (Key: ${key})`);
      }

      if (!data.validate) {
        return true;
      }

      return data.validate(data, other);
    }
  };
}
