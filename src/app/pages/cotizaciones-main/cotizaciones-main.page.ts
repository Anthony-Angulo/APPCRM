import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import {  Router } from '@angular/router';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';

@Component({
  selector: 'app-cotizaciones-main',
  templateUrl: './cotizaciones-main.page.html',
  styleUrls: ['./cotizaciones-main.page.scss'],
})
export class CotizacionesMainPage implements OnInit {

  button_size: string;
  screen_width: number;

  constructor(public plt: Platform, private navExtras: NavExtrasServiceService,private router: Router) { 
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
    this.navExtras.setExtras({'pedido':false});
    this.router.navigate(['generate-pedido']);
  }

}
