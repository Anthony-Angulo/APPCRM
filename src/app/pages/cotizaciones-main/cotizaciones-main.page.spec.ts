import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionesMainPage } from './cotizaciones-main.page';

describe('CotizacionesMainPage', () => {
  let component: CotizacionesMainPage;
  let fixture: ComponentFixture<CotizacionesMainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CotizacionesMainPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionesMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
