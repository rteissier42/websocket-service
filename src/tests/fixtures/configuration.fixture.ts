import { Environment, IAppConf } from './../../app/core/services/app-config.service';

export const configurationFixture: IAppConf = {
  env: Environment.LOCAL,
  urls: {
    webSocketEndpointUrl: 'ws://anything.info',
  },
};
