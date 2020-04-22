import minimist from 'minimist';

import { CliOption } from './CliOption';

export interface MedeaClient {
  getClientName(): string;
  getArgs(): {
    [x: string]: any;
    '--'?: string[] | undefined;
    _: string[];
  };
  getOptions(): Map<string, CliOption>;
  addOption(option: CliOption): this;
  parse(argv: string[], opts?: minimist.Opts): this;
  any(): boolean;
  missingRequiredOptions(): CliOption[];
  has(key: string): boolean;
  get(key?: string, defaultValue?: any): any;
  welcome(): this;
  helpText(): this;
  log(key: string, loggedProperties?: string[]): this;
  validate(key: string, other?: any): boolean;
}
