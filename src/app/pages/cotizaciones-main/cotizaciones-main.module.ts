import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CotizacionesMainPage } from './cotizaciones-main.page';

const routes: Routes = [
  {
    path: '',
    component: CotizacionesMainPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CotizacionesMainPage]
})
export class CotizacionesMainPageModule {}
