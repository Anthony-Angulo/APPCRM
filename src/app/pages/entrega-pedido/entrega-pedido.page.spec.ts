import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaPedidoPage } from './entrega-pedido.page';

describe('EntregaPedidoPage', () => {
  let component: EntregaPedidoPage;
  let fixture: ComponentFixture<EntregaPedidoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntregaPedidoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntregaPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
