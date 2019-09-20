import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-pedidos-main',
  templateUrl: '../../../assets/html/main/main.page.html',
  styleUrls: ['../../../assets/html/main/main.page.scss'],
})
export class PedidosMainPage implements OnInit {

  button_size: string;
  screen_width: number;
  notificationCounts: number;
  title = 'Pedidos CCFN';
  allTitle = 'Todas los Pedidos';
  allLink = 'all-orders';
  imageLink = '../../../assets/icon/Bag.png';

  constructor(
    public plt: Platform,
    private navExtras: NavExtrasServiceService,
    private storageservice: StorageService,
    private router: Router) {
    plt.ready().then((readySource) => {
      this.screen_width = plt.width();
    });
  }

  ngOnInit() {
    if (this.screen_width < 550) {
      this.button_size = 'default';
    } else {
      this.button_size = 'large';
    }
  }

  ionViewWillEnter() {
    this.storageservice.getNotifications().then(notificationList => {
      const notifications = notificationList.filter(Notification => Notification.vista == false);
      this.notificationCounts = notifications.length;
    });
  }

  goTo() {
    const data = {
      contact: undefined,
      products: [],
      sucursal_id: '1',
      pedido: true,
    };
    this.navExtras.setExtras(data);
    this.router.navigate(['generate-pedido']);
  }

}
