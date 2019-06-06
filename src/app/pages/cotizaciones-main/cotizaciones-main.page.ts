import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-cotizaciones-main',
  templateUrl: '../../../assets/html/main/main.page.html',  
  styleUrls: ['../../../assets/html/main/main.page.scss'],
})
export class CotizacionesMainPage implements OnInit {

  button_size: string;
  screen_width: number;
  notificationCounts: number;
  title: string = 'Cotizaciones CCFN'
  allTitle: string = 'Todas las Cotizaciones'
  allLink: string = 'cotizaciones'
  imageLink: string = '../../../assets/img/pedidos-phone.png'

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
      this.button_size = 'default'
    }
    else {
      this.button_size = 'large'
    }
  }

  ionViewWillEnter() {
    this.storageservice.getNotifications().then(notificationList => {
      let notifications = notificationList.filter(Notification => Notification.vista == false)
      this.notificationCounts = notifications.length
    })
  }

  goTo() {
    const data = {
      contact: undefined,
      products: [],
      sucursal_id: '1',
      pedido: false,
    };
    this.navExtras.setExtras(data);
    this.router.navigate(['generate-pedido']);
  }

}
