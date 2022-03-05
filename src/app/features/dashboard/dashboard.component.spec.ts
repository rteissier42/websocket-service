import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DashboardComponent } from './dashboard.component'
import { CurrencyDataService } from './services/currency-data.service'

describe('DashboardComponent', () => {
  let dashboardComponent: DashboardComponent
  let fixture: ComponentFixture<DashboardComponent>

  let currencyServiceSpy: jasmine.SpyObj<CurrencyDataService>

  beforeEach(() => {
    currencyServiceSpy = jasmine.createSpyObj<CurrencyDataService>(
      'CurrencyDataService',
      ['getDashboardInfos']
    )
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: CurrencyDataService, useValue: currencyServiceSpy },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent)
    dashboardComponent = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(dashboardComponent).toBeTruthy()
  })
})
