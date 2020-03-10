import minimist from 'minimist';

import { CliOption } from './CliOption';

export interface ClientController {
  __name: string;
  __opts: Map<string, CliOption>;
  __values: minimist.ParsedArgs;
  addOption(option: CliOption): ClientController;
  parse(argv: string[], opts?: minimist.Opts): ClientController;
  any(): boolean;
  has(key: string): boolean;
  get(key?: string, defaultValue?: any): any;
  name(): string;
  welcome(): ClientController;
  helpText(): ClientController;
  log(key: string, loggedProperties?: string[]): ClientController;
  validate(key: string, other?: any): boolean;
}
