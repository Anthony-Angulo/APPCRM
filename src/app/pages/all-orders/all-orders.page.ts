import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment as ENV } from 'src/environments/environment';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.page.html',
  styleUrls: ['./all-orders.page.scss'],
})
export class AllOrdersPage implements OnInit {

  orderData: any = [];

  constructor(
    private router: Router,
    private storageservice: StorageService,
    private http: HttpClient,
    public toastController: ToastController,
    private navExtras: NavExtrasServiceService) { }

  ngOnInit() {
    this.getOrders();
  }


  getOrders() {
    this.storageservice.getOrders().then(orderList => {
      this.orderData = orderList;
    });
  }

  goToDetail(order) {
    this.navExtras.setExtras({ order: order, isorder: true });
    this.router.navigate(['detail']);
  }

  doRefresh(event) {

    console.log('Begin async operation');

    this.storageservice.getUserID().then((val) => {

      this.http.get(ENV.BASE_URL + '/orders_by_owner/' + val)
        .pipe(
          finalize(() => {
            console.log('Async operation has ended');
            event.target.complete();
          })
        )
        .subscribe((data: any) => {

          let orders_list = [];
          data[0].forEach(order => {
            let rows = data[1].filter(row => row.order_id == order.id);
            orders_list.push({ order: order, rows: rows });
          });
          this.storageservice.setOrders(orders_list);
          this.getOrders();

        }, (err: any) => {

          this.presentToast('Error Al actualizar.');

        });

    });


  }

  async presentToast(data: any) {
    const toast = await this.toastController.create({
      message: data, // 'Dispositivo Conectado a Internet. Ordenes Registradas.',
      duration: 5000
    });
    toast.present();
  }

}
