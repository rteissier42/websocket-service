import { configurationFixture } from 'src/tests/fixtures/configuration.fixture';
import { TestBed } from '@angular/core/testing';
import { AppConfigService } from './app-config.service';

import { WebSocketService } from './websocket.service';

describe('WebsocketService', () => {
  let webSocketService: WebSocketService;
  let appConfSpy: jasmine.SpyObj<AppConfigService>;

  beforeEach(() => {
    appConfSpy = jasmine.createSpyObj<AppConfigService>('AppConf', ['getUrl']);
    appConfSpy.getUrl.and.returnValue(configurationFixture.urls.webSocketEndpointUrl);
    TestBed.configureTestingModule({
      providers: [{ provide: AppConfigService, useValue: appConfSpy }],
    });
    webSocketService = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(webSocketService).toBeTruthy();
  });
});
