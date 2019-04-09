import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePedidoPage } from './generate-pedido.page';

describe('GeneratePedidoPage', () => {
  let component: GeneratePedidoPage;
  let fixture: ComponentFixture<GeneratePedidoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratePedidoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratePedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
