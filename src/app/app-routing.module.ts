import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './public/login/login.module#LoginPageModule' },
  { path: 'dashboard', canActivate: [AuthGuardService],
    loadChildren: './landing/dashboard/dashboard.module#DashboardPageModule' },
  { path: 'contacts', loadChildren: './pages/contacts/contacts.module#ContactsPageModule' },
  { path: 'generate-pedido', loadChildren: './pages/generate-pedido/generate-pedido.module#GeneratePedidoPageModule' },
  { path: 'revision-pedido', loadChildren: './pages/revision-pedido/revision-pedido.module#RevisionPedidoPageModule' },
  { path: 'entrega-pedido', loadChildren: './pages/entrega-pedido/entrega-pedido.module#EntregaPedidoPageModule' },
  { path: 'fecha-pago-pedido', loadChildren: './pages/fecha-pago-pedido/fecha-pago-pedido.module#FechaPagoPedidoPageModule' },
  { path: 'pedidos-main', loadChildren: './pages/pedidos-main/pedidos-main.module#PedidosMainPageModule' },
  { path: 'all-orders', loadChildren: './pages/all-orders/all-orders.module#AllOrdersPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
