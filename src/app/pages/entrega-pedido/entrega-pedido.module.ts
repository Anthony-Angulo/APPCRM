import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EntregaPedidoPage } from './entrega-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: EntregaPedidoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EntregaPedidoPage]
})
export class EntregaPedidoPageModule {}
