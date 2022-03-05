import { TestBed } from '@angular/core/testing'
import { WebSocketService } from 'src/app/core/services/websocket.service'

import { CurrencyDataService } from './currency-data.service'

describe('CurrencyDataService', () => {
  let currencyDataService: CurrencyDataService
  let socketSpy: jasmine.SpyObj<WebSocketService>

  beforeEach(() => {
    socketSpy = jasmine.createSpyObj<WebSocketService>('SocketService', [
      'subscribe',
    ])
    TestBed.configureTestingModule({
      providers: [
        CurrencyDataService,
        { provide: WebSocketService, useValue: socketSpy },
      ],
    })
    currencyDataService = TestBed.inject(CurrencyDataService)
  })

  it('should be created', () => {
    expect(currencyDataService).toBeTruthy()
  })
})
