import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InfoWidgetComponent, IWidgetInfos } from './info-widget.component';

describe('InfoWidgetComponent', () => {
  //   let testHostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let infoWidgetComponent: InfoWidgetComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, InfoWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    infoWidgetComponent = fixture.debugElement.query(By.css('app-info-widget')).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(infoWidgetComponent).toBeTruthy();
  });
});

// InfoWidget Test Helpers
@Component({
  template: `<app-info-widget label="testLabel" [infos]="infos"></app-info-widget>`,
})
class TestHostComponent {
  infos: IWidgetInfos = {
    prices: {
      lowest: {
        today: '0',
        last24Hours: '0',
      },
      highest: {
        today: '0',
        last24Hours: '0',
      },
    },
    trading: {
      volume: '0',
    },
  };
}
