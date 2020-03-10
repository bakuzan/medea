import minimist from 'minimist';

import { ClientOptions } from './interfaces/ClientOptions';
import { CliOption } from './interfaces/CliOption';
import { typedKeys } from './utils';

export default class MedeaClientController {
  private name: string;
  private options: Map<string, CliOption>;
  private values: minimist.ParsedArgs;
  private clientOptions: ClientOptions;

  constructor(name: string, opts: ClientOptions) {
    this.name = name;
    this.options = new Map<string, CliOption>();
    this.values = {} as minimist.ParsedArgs;
    this.clientOptions = opts;
  }

  getClientName() {
    return this.name;
  }

  getArgs() {
    return { ...this.values };
  }

  getOptions() {
    return new Map(this.options);
  }

  addOption(option: CliOption) {
    this.options.set(option.option, option);
    return this;
  }

  parse(argv: string[], opts?: minimist.Opts) {
    this.values = minimist(argv.slice(2), opts);

    return this;
  }

  any() {
    return (
      Object.keys(this.values).some((x) => x !== '_') ||
      this.values._.length !== 0
    );
  }

  missingRequiredOptions() {
    const values = Array.from(this.options.values());
    const requiredOpts = values.filter(
      (x) =>
        x.required === true ||
        (typeof x.required === 'function' && x.required(this.values))
    );

    const missing = requiredOpts.filter(
      (x) => this.values[x.option] === undefined
    );

    return missing;
  }

  has(key: string) {
    const data = this.options.get(key);
    if (!data) {
      throw new Error(`Key does not exist. (Key: ${key})`);
    }

    const shortKey = data.shortcut || key;

    return (
      this.values.hasOwnProperty(key) || this.values.hasOwnProperty(shortKey)
    );
  }

  get(key?: string, defaultValue?: any) {
    if (!key) {
      return { ...this.values };
    }

    const data = this.options.get(key);
    if (!data) {
      return defaultValue;
    }

    const shortValue = data.shortcut ? this.values[data.shortcut] : undefined;

    return this.values[key] || shortValue || defaultValue;
  }

  welcome() {
    const windowColumns = this.clientOptions.windowColumns ?? 100;

    const lenH = Math.ceil(this.name.length / 2);
    const half = '*'.repeat(Math.floor(windowColumns / 2) - 1 - lenH);

    console.log(`${half} ${this.name} ${half}`);

    return this;
  }

  helpText() {
    this.logAsterisks();
    console.log(`* Options`);

    this.logAsterisks();
    console.log(`*\r`);

    Array.from(this.options.entries()).forEach(([k]) => {
      this.log(k);
      console.log(`*\r`);
    });

    this.logAsterisks();

    return this;
  }

  log(key: string, loggedProperties?: string[]) {
    const d = this.options.get(key);
    const props = loggedProperties ?? [
      'option',
      'shortcut',
      'description',
      'required'
    ];

    if (d) {
      const padNum = this.getPadLength(props);

      typedKeys(d).forEach((k) => {
        const kStr = k as string;
        if (props.includes(kStr)) {
          const v = d[k];
          console.log(`* ${kStr.padStart(padNum, ' ')}: `, v || 'None');
        }
      });
    }

    return this;
  }

  validate(key: string, other?: any): boolean {
    const option = this.options.get(key);
    if (!option) {
      throw new Error(`Key does not exist. (Key: ${key})`);
    }

    if (!option.validate) {
      return true;
    }

    return option.validate(option, this.get(key), other);
  }

  private logAsterisks() {
    const size = this.clientOptions.windowColumns ?? 100;
    console.log('*'.repeat(size));
  }

  private getPadLength(l: string[]) {
    return l.reduce((a, b) => (a.length > b.length ? a : b)).length;
  }
}
