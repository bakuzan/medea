import minimist from "minimist";

export interface CliOption {
  option: string;
  shortcut?: string;
  description: string;
  validate?: (option: CliOption, value?: any, data?: any) => boolean;
  required?: boolean | ((args: minimist.ParsedArgs) => boolean);
}
