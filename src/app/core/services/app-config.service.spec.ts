import { ConfigUrl, IAppConf } from './app-config.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { configurationFixture } from 'src/tests/fixtures/configuration.fixture';

import { AppConfigService } from './app-config.service';
import { LoggerService } from './logger.service';

const TEST_URI = 'assets/config/config.json';

describe('AppConfigService', () => {
  let configService: AppConfigService;
  let httpMock: HttpTestingController;

  let loggerSpy: jasmine.SpyObj<LoggerService>;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj<LoggerService>('LoggerService', ['error']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: LoggerService, useValue: loggerSpy }],
    });
    configService = TestBed.inject(AppConfigService);

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be able to fetch the configuration for the current environment', () => {
    // Arrange
    const expected = cold('(a|)', { a: configurationFixture });
    configService.load().subscribe({
      next: (config: IAppConf) => {
        expect(config).toBe(configurationFixture);
      },
      error: fail,
    });

    // Act
    const httpRequest = httpMock.expectOne(TEST_URI);
    httpRequest.flush(configurationFixture);

    // Assert
    expect(configService.load()).toBeObservable(expected);
  });

  it('should expose a map of all urls presents in the current configuration', () => {
    // Arrange
    configService.load().subscribe({ next: () => {}, error: fail });

    // Act
    const httpRequest = httpMock.expectOne(TEST_URI);
    httpRequest.flush(configurationFixture);

    // Assert
    Object.keys(configurationFixture.urls).forEach((key) => {
      expect(configService.urlMap.has(key as ConfigUrl)).toBeTruthy();
    });
  });

  it('should be able to retrieve an existing url from a correct url key', () => {
    // Arrange
    configService.load().subscribe({ next: () => {}, error: fail });

    // Act
    const httpRequest = httpMock.expectOne(TEST_URI);
    httpRequest.flush(configurationFixture);

    const socketUrl = configService.getUrl(ConfigUrl.SOCKET_ENDPOINT);

    // Assert
    expect(socketUrl).toBe(configurationFixture.urls.webSocketEndpointUrl);
  });

  it('should request to log an error and provide a fallback when an url cannot be retrieved from the configuration', () => {
    // Arrange
    configService.load().subscribe({ next: () => {}, error: fail });

    // Act
    const httpRequest = httpMock.expectOne(TEST_URI);
    httpRequest.flush(configurationFixture);
    const requestedUrl = 'unknownUrl' as ConfigUrl;
    const unknownUrl = configService.getUrl(requestedUrl);

    // Assert
    expect(unknownUrl).toEqual('');
    expect(loggerSpy.error).toHaveBeenCalledOnceWith(
      'There is no such url in the current configuration: ',
      requestedUrl
    );
  });
});
