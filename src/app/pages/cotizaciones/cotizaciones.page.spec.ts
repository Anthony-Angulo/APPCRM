import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionesPage } from './cotizaciones.page';

describe('CotizacionesPage', () => {
  let component: CotizacionesPage;
  let fixture: ComponentFixture<CotizacionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CotizacionesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
