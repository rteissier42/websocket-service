/* eslint-disable max-classes-per-file */
import { LoggerService } from './logger.service';
import { AppConfigService, ConfigUrl } from './app-config.service';
import { Injectable, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { Observable, shareReplay, Subject, Subscription, catchError, EMPTY } from 'rxjs';

export interface IWebSocketService {
  subscribe<T>(
    url: string,
    handler: (message: { body: string }) => T,
    keepActive?: boolean
  ): boolean;
  clearSubscriptions(): void;
}

export class WebSocketSuscriber<T> {
  constructor(
    public url: string,
    public handler: (message: { body: string }) => T,
    public keepActive: boolean
  ) {}
}

export enum SocketEvent {
  OPEN = 'openSocketConnexion',
  CLOSED = 'lostSocketConnexion',
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketService implements IWebSocketService, OnDestroy {
  private subscribers: WebSocketSuscriber<unknown>[] = [];
  private subscriptions: Subscription[] = [];
  private wsSubject$: WebSocketSubject<{ body: string }> | null = null;
  private _socketConnectionEvents$: Subject<SocketEvent>;

  constructor(private appConf: AppConfigService, private logger: LoggerService) {
    this._socketConnectionEvents$ = new Subject<SocketEvent>();
    this.initWebsocketClient();
  }

  // Listen to this to catch the events which were broadcasted through $rootScope.
  public get socketConnectionEvents$(): Observable<SocketEvent> {
    return this._socketConnectionEvents$.asObservable().pipe(shareReplay(1));
  }

  public subscribe<T>(
    url: string,
    handler: (message: { body: string }) => T,
    keepActive?: boolean
  ): boolean {
    if (!this.wsSubject$) {
      this.subscribers.push(new WebSocketSuscriber<T>(url, handler, keepActive || false));
    } else if (this.wsSubject$ && !this.wsSubject$.closed) {
      this.runSubscriber<T>({ url, handler, keepActive: keepActive || false });
    } else {
      return false;
    }
    return true;
  }

  public clearSubscriptions(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public ngOnDestroy(): void {
    this.clearSubscriptions();
    this.wsSubject$?.complete();
  }

  private initWebsocketClient(): void {
    if (!this.wsSubject$ || this.wsSubject$.closed) {
      // Flag(appConf): Alternatively if we absolutely have to expose appConf as a constant.
      // const socketEndpoint = this.appConf.webSocketEndpointUrl

      const socketEndpoint = this.appConf.getUrl(ConfigUrl.SOCKET_ENDPOINT);
      this.logger.info('Init Web Socket : ', socketEndpoint);

      const wsConfig: WebSocketSubjectConfig<{ body: string }> = {
        url: socketEndpoint,
        protocol: 'v12.stomp',
        /**
         * To respect the original implementation and not
         * violate the message parameter type of the handler function
         * in our subscribe method, we prevent Rxjs to JSON.Parse
         * our return payloads.
         */
        deserializer: ({ data }) => ({
          body: data,
        }),
        openObserver: {
          next: () => {
            this.logger.info('Socket connected : run subscribers');
            this._socketConnectionEvents$.next(SocketEvent.OPEN);
            this.subscribers.forEach((subscriber) => this.runSubscriber(subscriber));
          },
        },
        closeObserver: {
          next: (closeEvent) => {
            this.logger.info('Socket closed');
            this._socketConnectionEvents$.next(SocketEvent.CLOSED);
            // Retry handling on error
            if (!closeEvent.wasClean) {
              this.wsSubject$ = null;
              setTimeout(() => this.initWebsocketClient(), 10000);
            }
          },
        },
      };

      this.wsSubject$ = webSocket(wsConfig);
      this.wsSubject$
        .pipe(
          catchError((e) => {
            this.logger.error('Socket error : ', e);
            return EMPTY;
          })
        )
        .subscribe();
    }
  }

  private runSubscriber<T>(subscriber: WebSocketSuscriber<T>): void {
    this.logger.info('New SUBSCRIPTION : ', subscriber.url);
    const subscription = this.wsSubject$
      ?.multiplex(
        () => ({
          event: 'subscribe',
          pair: ['XBT/EUR'],
          subscription: { name: subscriber.url },
        }),
        () => ({
          event: 'unsubscribe',
          pair: ['XBT/EUR'],
          subscription: { name: subscriber.url },
        }),
        (message: { body: string }) => {
          const body = JSON.parse(message.body);
          // body[2] always contain the selected topic in the response payload.
          return Array.isArray(body) && body[2] === subscriber.url;
        }
      )
      .pipe(
        catchError((e) => {
          this.logger.error('Socket error : ', e);
          return EMPTY;
        })
      )
      .subscribe(subscriber.handler);

    if (subscription && !subscriber.keepActive) {
      this.subscriptions.push(subscription);
    }
  }
}
