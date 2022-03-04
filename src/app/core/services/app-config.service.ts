import { LoggerService } from './logger.service'
import { Injectable } from '@angular/core'
import { HttpBackend, HttpClient } from '@angular/common/http'
import { Observable, shareReplay, tap } from 'rxjs'

export enum Environment {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

// Values should match corresponding urls keys in IAppConf interface
export enum ConfigUrl {
  SOCKET_ENDPOINT = 'webSocketEndpointUrl',
}

export interface IAppConf {
  env: Environment
  urls: {
    webSocketEndpointUrl: string
  }
}

export interface IAppConfigService {
  urlMap: ReadonlyMap<ConfigUrl, string>
  load(): Observable<IAppConf>
  getUrl(url: ConfigUrl): string
}

@Injectable({
  providedIn: 'root',
})
export class AppConfigService implements IAppConfigService {
  private readonly configUrl = 'assets/config/config.json'
  private readonly _urlMap = new Map<ConfigUrl, string>([])
  private configuration$?: Observable<IAppConf>

  // Flag(appConf): Alternatively if we absolutely have to expose appConf as a constant.
  // public appConf?:IAppConf

  constructor(
    private http: HttpBackend,
    private loggerService: LoggerService
  ) {}

  public get urlMap(): ReadonlyMap<ConfigUrl, string> {
    return this._urlMap as ReadonlyMap<ConfigUrl, string>
  }

  public load(): Observable<IAppConf> {
    if (!this.configuration$) {
      this.configuration$ = new HttpClient(this.http)
        .get<IAppConf>(this.configUrl)
        .pipe(
          /**
           * For convenience and to avoid any superfluous
           * subscriptions, we are stocking our urls
           * separately.
           */
          tap((config) => {
            this.createUrlMap(config.urls)
            // Flag(appConf): Alternatively if we absolutely have to expose appConf as a constant.
            // this.appConf = config
          }),
          shareReplay(1)
        )
    }
    return this.configuration$
  }

  /**
   * Should be exposed through an url builder service in a common ecosystem.
   * Implementation should then differ a bit.
   */
  public getUrl(configUrl: ConfigUrl): string {
    try {
      const url = this.urlMap.get(configUrl)
      if (!url) {
        throw new Error('There is no such url in the current configuration: ')
      }
      return url
    } catch (e) {
      if (e instanceof Error) {
        this.loggerService.error(e.message, configUrl)
      }
      /**
       * Avoid runtime errors from a String.prototype method
       * called on a potentially undefined url property.
       */
      return ''
    }
  }

  private createUrlMap(urls: Record<ConfigUrl, string>): void {
    Object.entries(urls).forEach(([key, value]) => {
      if (this.isValidConfigUrl(key)) {
        this._urlMap.set(key, value)
      }
    })
  }

  private isValidConfigUrl(url: unknown): url is ConfigUrl {
    return (
      typeof url === 'string' &&
      Object.values(ConfigUrl).includes(url as ConfigUrl)
    )
  }
}
