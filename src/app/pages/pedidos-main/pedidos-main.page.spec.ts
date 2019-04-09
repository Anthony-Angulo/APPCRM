import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosMainPage } from './pedidos-main.page';

describe('PedidosMainPage', () => {
  let component: PedidosMainPage;
  let fixture: ComponentFixture<PedidosMainPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosMainPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
