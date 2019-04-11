import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  Marker,
  GoogleMapsEvent,
  Environment
} from '@ionic-native/google-maps/ngx';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-entrega-pedido',
  templateUrl: './entrega-pedido.page.html',
  styleUrls: ['./entrega-pedido.page.scss'],
})
export class EntregaPedidoPage {
  map: GoogleMap;
  datos: any;
  constructor(public platform: Platform, private router: Router, private navExtras: NavExtrasServiceService) { }

  ngOnInit(){
    this.datos = this.navExtras.getExtras();
  }
  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }

  async loadMap() {

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    };
    this.map = GoogleMaps.create('map_canvas', mapOptions);

    let marker: Marker = this.map.addMarkerSync({
      title: 'Ionic',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: 43.0741904,
        lng: -89.3809802
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('clicked');
    });
  }

 navMetodoPedidos(){
  this.router.navigate(['fecha-pago-pedido']);
}
}
