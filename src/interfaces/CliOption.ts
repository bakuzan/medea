export interface CliOption {
  option: string;
  shortcut?: string;
  description: string;
  validate?: (option: CliOption, value?: any, data?: any) => boolean;
  required?: boolean | ((options: Map<string, CliOption>) => boolean);
}
