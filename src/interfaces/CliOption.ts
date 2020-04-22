import minimist from 'minimist';
import MedeaClientController from 'MedeaClientController';

export interface CliOption {
  option: string;
  shortcut?: string;
  description: string;
  validate?: (option: CliOption, value?: any, data?: any) => boolean;
  required?: boolean | ((cli: MedeaClientController) => boolean);
}
