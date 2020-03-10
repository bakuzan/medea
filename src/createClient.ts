import { ClientOptions } from './interfaces/ClientOptions';
import MedeaClientController from './MedeaClientController';

export default function createClient(
  appName: string,
  options: ClientOptions = {}
): MedeaClientController {
  return new MedeaClientController(appName, options);
}
