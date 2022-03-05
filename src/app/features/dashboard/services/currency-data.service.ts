import { WebSocketService } from 'src/app/core/services/websocket.service';
import { Injectable } from '@angular/core';
import { Observable, shareReplay, Subject, combineLatest, map } from 'rxjs';

export enum CurrencyChannel {
  TICKER = 'ticker',
  TRADE = 'trade',
}
export interface ICurrencyInfos {
  last24Hours: string;
  today: string;
}
export interface ITickerValue {
  lowest: ICurrencyInfos;
  highest: ICurrencyInfos;
}

export interface ITradingInfos {
  volume: string;
}

@Injectable()
export class CurrencyDataService {
  public _tickerMessages$: Subject<ITickerValue>;
  public _tradingMessages$: Subject<ITradingInfos>;

  constructor(private socket: WebSocketService) {
    // TODO: Refacto to keep a cleaner constructor
    this._tickerMessages$ = new Subject();
    this._tradingMessages$ = new Subject();
    this.initTickerSubscription();
    this.initTradingSubscription();
  }

  public get tickerMessages$(): Observable<ITickerValue> {
    return this._tickerMessages$.asObservable().pipe(shareReplay(1));
  }

  public get tradingMessages$(): Observable<ITradingInfos> {
    return this._tradingMessages$.asObservable().pipe(shareReplay(1));
  }

  public getDashboardInfos(): Observable<{ ticker: ITickerValue; trading: ITradingInfos }> {
    return combineLatest([this.tickerMessages$, this.tradingMessages$]).pipe(
      map(([ticker, trading]) => {
        return { ticker, trading };
      })
    );
  }

  private initTradingSubscription(): void {
    this.socket.subscribe<void>(CurrencyChannel.TRADE, (message) => {
      const tradingInfos = this.deserializeTradingMsg(message.body);
      this._tradingMessages$.next(tradingInfos);
    });
  }

  private initTickerSubscription(): void {
    this.socket.subscribe<void>(CurrencyChannel.TICKER, (message) => {
      const tickerInfos = this.deserializeCurrencyMsg(message.body);
      this._tickerMessages$.next(tickerInfos);
    });
  }

  /**
   * For sake of brevity, we won't implement the corresponding
   * message payload interfaces. You should avoid accessing random array elements
   * without explanation though.
   */

  // https://docs.kraken.com/websockets/#message-trade
  private deserializeTradingMsg(body: string): ITradingInfos {
    const data = JSON.parse(body)[1];
    const volume = data[0][1];
    return { volume };
  }

  // https://docs.kraken.com/websockets/#message-ticker
  private deserializeCurrencyMsg(body: string): ITickerValue {
    const { l, h } = JSON.parse(body)[1];
    return {
      lowest: { today: l[0], last24Hours: l[1] },
      highest: { today: h[0], last24Hours: h[1] },
    };
  }
}
