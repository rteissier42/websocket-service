import { WebSocketService } from 'src/app/core/services/websocket.service'
import { Injectable } from '@angular/core'
import { Observable, shareReplay, Subject, combineLatest, map } from 'rxjs'

export enum CurrencyChannel {
  TICKER = 'ticker',
  TRADE = 'trade',
}
export interface ICurrencyInfos {
  last24Hours: string
  today: string
}
export interface ITickerValue {
  lowest: ICurrencyInfos
  highest: ICurrencyInfos
}

// TODO: Should not be provided in root but in dashboard module scope
@Injectable({ providedIn: 'root' })
export class CurrencyDataService {
  public _tickerMessages$: Subject<ITickerValue>
  public _tradingMessages$: Subject<any>

  constructor(private socket: WebSocketService) {
    // TODO: Refacto to keep a cleaner constructor
    this._tickerMessages$ = new Subject()
    this._tradingMessages$ = new Subject()
    this.initTickerSubscription()
    // this.initTradingSubscription()
  }

  public get tickerMessages$(): Observable<any> {
    return this._tickerMessages$.asObservable().pipe(shareReplay(1))
  }

  public get tradingMessages$(): Observable<any> {
    return this._tradingMessages$.asObservable().pipe(shareReplay(1))
  }

  public getDashboardInfos(): Observable<any> {
    return combineLatest([this.tickerMessages$, this.tradingMessages$]).pipe(
      map(([ticker, trading]) => {
        return { ticker, trading }
      })
    )
  }

  private initTradingSubscription(): void {
    this.socket.subscribe(CurrencyChannel.TRADE, (message) => {
      console.log('IAM RECEIVING THE TRADING MESSAGE', JSON.parse(message.body))
      this._tradingMessages$.next(message.body)
    })
  }

  private initTickerSubscription(): void {
    this.socket.subscribe(
      CurrencyChannel.TICKER,
      (message) => {
        const { l, h } = JSON.parse(message.body)[1]
        const infos: ITickerValue = {
          lowest: { today: l[0], last24Hours: l[1] },
          highest: { today: h[0], last24Hours: h[1] },
        }

        this._tickerMessages$.next(infos)
      },
      false
    )
  }
}
