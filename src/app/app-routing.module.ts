import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard', canActivate: [AuthGuard],
    loadChildren: './dashboard/dashboard.module#DashboardPageModule'
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'contacts', loadChildren: './pages/contacts/contacts.module#ContactsPageModule' },
  { path: 'generate-pedido', loadChildren: './pages/generate-pedido/generate-pedido.module#GeneratePedidoPageModule' },
  { path: 'entrega-pedido', loadChildren: './pages/entrega-pedido/entrega-pedido.module#EntregaPedidoPageModule' },
  { path: 'fecha-pago-pedido', loadChildren: './pages/fecha-pago-pedido/fecha-pago-pedido.module#FechaPagoPedidoPageModule' },
  { path: 'pedidos-main', loadChildren: './pages/pedidos-main/pedidos-main.module#PedidosMainPageModule' },
  { path: 'all-orders', loadChildren: './pages/all-orders/all-orders.module#AllOrdersPageModule' },
  { path: 'cotizaciones-main', loadChildren: './pages/cotizaciones-main/cotizaciones-main.module#CotizacionesMainPageModule' },
  { path: 'agenda', loadChildren: './pages/agenda/agenda.module#AgendaPageModule' },
  { path: 'cotizaciones', loadChildren: './pages/cotizaciones/cotizaciones.module#CotizacionesPageModule' },
  { path: 'detail', loadChildren: './pages/detail/detail.module#DetailPageModule' },
  { path: 'products', loadChildren: './pages/products/products.module#ProductsPageModule' },
  { path: 'notifications', loadChildren: './pages/notifications/notifications.module#NotificationsPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
