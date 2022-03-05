import { LoggerService } from './logger.service'
import { AppConfigService, ConfigUrl } from './app-config.service'
import { Injectable, OnDestroy } from '@angular/core'
import {
  webSocket,
  WebSocketSubject,
  WebSocketSubjectConfig,
} from 'rxjs/webSocket'
import { Observable, shareReplay, Subject, Subscription } from 'rxjs'

export interface IWebSocketService {
  subscribe<T>(
    url: string,
    handler: (message: { body: string }) => T,
    keepActive?: boolean
  ): boolean
  clearSubscriptions(): void
}

export interface IWebSocketMessage<T extends object> {
  messageObject: T
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
  private subscribers: WebSocketSuscriber<any>[] = []
  private subscriptions: Subscription[] = []
  private wsSubject$: WebSocketSubject<any> | null = null
  private _socketConnectionEvents$: Subject<SocketEvent>

  constructor(
    private appConf: AppConfigService,
    private logger: LoggerService
  ) {
    this._socketConnectionEvents$ = new Subject<SocketEvent>()
    this.initWebsocketClient()

    console.log(this.subscriptions)
  }

  public get socketConnectionEvents$(): Observable<SocketEvent> {
    return this._socketConnectionEvents$.asObservable().pipe(shareReplay(1))
  }

  public subscribe<T>(
    url: string,
    handler: (message: any) => T,
    keepActive?: boolean
  ): boolean {
    if (!this.wsSubject$ || this.wsSubject$.closed) {
      this.subscribers.push(
        new WebSocketSuscriber(url, handler, keepActive || false)
      )
      return false
    }
    this.runSubscriber({ url, handler, keepActive: keepActive || false })
    return true
  }

  public clearSubscriptions(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  public ngOnDestroy(): void {
    this.clearSubscriptions()
    this.wsSubject$?.complete()
  }

  private initWebsocketClient(): void {
    if (!this.wsSubject$ || this.wsSubject$.closed) {
      const socketEndpoint = this.appConf.getUrl(ConfigUrl.SOCKET_ENDPOINT)
      this.logger.info('Init Web Socket : ', socketEndpoint)

      const wsConfig: WebSocketSubjectConfig<any> = {
        url: socketEndpoint,
        protocol: 'stomp',
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
            this.logger.info('Socket connected : run subscribers')
            this._socketConnectionEvents$.next(SocketEvent.OPEN)
            this.subscribers.forEach((subscriber) => {
              this.runSubscriber(subscriber)
            })
          },
        },
        closeObserver: {
          next: (closeEvent) => {
            this.logger.info('Socket closed')
            this._socketConnectionEvents$.next(SocketEvent.CLOSED)
            // Error handling
            if (!closeEvent.wasClean) {
              this.wsSubject$ = null
              setTimeout(() => this.initWebsocketClient(), 10000)
            }
          },
        },
      }

      this.wsSubject$ = webSocket(wsConfig)
      this.wsSubject$.subscribe()
    }
  }

  private runSubscriber(subscriber: WebSocketSuscriber<any>): void {
    this.logger.info('New SUBSCRIPTION : ', subscriber.url)
    let subscription = this.wsSubject$
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
        (message) => {
          const body = JSON.parse(message.body)
          return Array.isArray(body) && body[2] === subscriber.url
        }
      )
      .subscribe(subscriber.handler)

    if (subscription && !subscriber.keepActive) {
      this.subscriptions.push(subscription)
    }
  }
}
