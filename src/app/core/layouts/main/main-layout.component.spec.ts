import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MainLayoutComponent } from './main-layout.component'

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent
  let fixture: ComponentFixture<MainLayoutComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainLayoutComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MainLayoutComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
