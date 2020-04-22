import { MedeaClient } from './MedeaClient';

export interface CliOption {
  option: string;
  shortcut?: string;
  description: string;
  validate?: (option: CliOption, value?: any, data?: any) => boolean;
  required?: boolean | ((client: MedeaClient) => boolean);
}
