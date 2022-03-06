// import { Subject, Observable } from 'rxjs';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { configurationFixture } from 'src/tests/fixtures/configuration.fixture';
// import { TestBed } from '@angular/core/testing';
// import { AppConfigService, ConfigUrl } from './app-config.service';

// import { WebSocketService } from './websocket.service';
// import { LoggerService } from './logger.service';

// fdescribe('WebsocketService', () => {
//   let webSocketService: WebSocketService;
//   let appConfSpy: jasmine.SpyObj<AppConfigService>;
//   let loggerSpy: jasmine.SpyObj<LoggerService>;

//   beforeEach(() => {
//     appConfSpy = jasmine.createSpyObj<AppConfigService>('AppConf', ['getUrl']);
//     appConfSpy.getUrl.and.returnValue(configurationFixture.urls.webSocketEndpointUrl);
//     loggerSpy = jasmine.createSpyObj<LoggerService>('LogSpy', ['error', 'info']);
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         { provide: AppConfigService, useValue: appConfSpy },
//         { provide: LoggerService, useValue: loggerSpy },
//       ],
//     });
//     webSocketService = TestBed.inject(WebSocketService);
//   });

//   it('should be created', () => {
//     const bambi = MockWebSocket;
//     expect(webSocketService).toBeTruthy();
//   });

//   fit('should properly instantiate a websocket subject on initialization', () => {
//     // Arrange
//     const fakeSocket = MockWebSocket;
//     spyOn(Observable, 'websocket' as never).and.returnValue(fakeSocket);

//     // Assert
//     expect(appConfSpy.getUrl).toHaveBeenCalledOnceWith(ConfigUrl.SOCKET_ENDPOINT);
//     expect(loggerSpy.info).toHaveBeenCalledTimes(2);
//     expect(loggerSpy.info.calls.first().args).toEqual([
//       'Init Web Socket : ',
//       configurationFixture.urls.webSocketEndpointUrl,
//     ]);
//   });
// });
