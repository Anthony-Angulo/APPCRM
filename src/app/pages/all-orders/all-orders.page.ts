import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment as ENV } from 'src/environments/environment';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.page.html',
  styleUrls: ['./all-orders.page.scss'],
})
export class AllOrdersPage implements OnInit {

  orderData = [];
  pendingData = [];

  constructor(
    private router: Router,
    private storageservice: StorageService,
    private http: HttpClient,
    public toastController: ToastController,
    private navExtras: NavExtrasServiceService) { }

  ngOnInit() {
    this.getOrders();
  }

  async getOrders() {
    await Promise.all([
      this.storageservice.getOrders(),
      this.storageservice.getContacts(),
      this.storageservice.getPendingOrders(),
    ]).then(([orderList, contactList, pendingList]: any[]) => {
      this.orderData = orderList;
      this.orderData.map(order => order.order.contact = contactList.find(contact => contact.id == order.order.contact_id));
      this.pendingData = pendingList;
      this.pendingData.map(order => order.order.contact = contactList.find(contact => contact.id == order.order.contact_id));
    });
  }

  goToDetail(order) {
    this.navExtras.setExtras({ order: order, isorder: true });
    this.router.navigate(['detail']);
  }

  doRefresh(event) {

    this.storageservice.getUserID().then((val) => {
      return this.http.get(ENV.BASE_URL + '/orders_by_owner/' + val).toPromise();
    }).then(async (data: any) => {

      let orders_list = [];
      data[0].forEach(order => {
        let rows = data[1].filter(row => row.order_id == order.id);
        orders_list.push({ order: order, rows: rows });
      });
      this.storageservice.setOrders(orders_list);
      await this.getOrders();

    }).catch((error) => {

      this.presentToast('Error al Actualizar.');

    }).finally(() => {
      event.target.complete();
    });

  }

  async presentToast(data: any) {
    const toast = await this.toastController.create({
      message: data,
      duration: 5000
    });
    toast.present();
  }

}
