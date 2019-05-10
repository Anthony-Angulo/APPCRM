import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-pedidos-main',
  templateUrl: './pedidos-main.page.html',
  styleUrls: ['./pedidos-main.page.scss'],
})
export class PedidosMainPage implements OnInit {

  button_size: string;
  screen_width: number;

  constructor(
    public plt: Platform,
    private navExtras: NavExtrasServiceService,
    private router: Router,) { 
    plt.ready().then((readySource) => {
      this.screen_width = plt.width();
    });
  }

  ngOnInit() {
    if(this.screen_width < 550){
      this.button_size='default'
    }
    else {
      this.button_size='large'
    }
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
