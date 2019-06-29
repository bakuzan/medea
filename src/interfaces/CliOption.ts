export interface CliOption {
  option: string;
  shortcut?: string;
  description: string;
  validate?: (option: CliOption, data?: any) => boolean;
}
