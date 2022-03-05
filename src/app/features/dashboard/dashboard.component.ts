import { CurrencyDataService, ITickerValue, ITradingInfos } from './services/currency-data.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public currencyInfos$!: Observable<{ ticker: ITickerValue; trading: ITradingInfos }>;

  constructor(private currencyService: CurrencyDataService) {}

  public ngOnInit(): void {
    this.currencyInfos$ = this.currencyService.getDashboardInfos();
  }
}
