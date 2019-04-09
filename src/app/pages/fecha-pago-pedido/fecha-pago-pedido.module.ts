import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FechaPagoPedidoPage } from './fecha-pago-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: FechaPagoPedidoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FechaPagoPedidoPage]
})
export class FechaPagoPedidoPageModule {}
