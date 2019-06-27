import { typedKeys } from "./utils";

interface CliOption {
  option: string;
  shortcut?: string;
  description: string;
  validate?: (data?: any) => boolean;
}

const logAsterisks = () =>
  console.log("*".repeat(process.stdout.columns || 10));

const defaultLoggedProperties = ["option", "shortcut", "description"];

const getPadLength = (l: string[]) =>
  l.reduce((a, b) => (a.length > b.length ? a : b)).length;

export default function describeArgs(welcome: string, opts: Array<CliOption>) {
  const __opts = new Map(opts.map(x => [x.option, x]));
  return {
    __opts,
    welcome() {
      const lenH = Math.ceil(welcome.length / 2);
      const half = "*".repeat(
        Math.floor((process.stdout.columns || 10) / 2) - 1 - lenH
      );

      console.log(`${half} ${welcome} ${half}`);
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
    },
    log(key: string, loggedProperties = defaultLoggedProperties) {
      const d = this.__opts.get(key);

      if (d) {
        const padNum = getPadLength(loggedProperties);

        typedKeys(d).forEach(k => {
          if (loggedProperties.includes(k)) {
            const v = d[k];
            console.log(`* ${k.padStart(padNum, " ")}: `, v || "None");
          }
        });
      }
    },
    validate(key: string, other?: any) {
      const data = this.__opts.get(key);
      if (!data) {
        throw new Error(`Key does not exist. (Key: ${key})`);
      }

      return data.validate ? data.validate(other) : true;
    }
  };
}
