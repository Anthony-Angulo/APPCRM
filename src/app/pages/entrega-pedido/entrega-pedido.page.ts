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
  contact: any=[];
  constructor(public platform: Platform, private router: Router, private navExtras: NavExtrasServiceService) { }

  ngAfterViewInit() {
    this.datos = this.navExtras.getExtras();
    console.log(this.datos);
    this.platform.ready().then(() => {
      this.loadMap();
    });
    this.datosContact(this.datos);
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

 datosContact(data: any){
  this.contact.push({
    contact_id: data.contact[0].id,
        contact_zipcode: data.contact[0].zip_code,
        contact_name: data.contact[0].full_name,
        contact_street: data.contact[0].street,
        contact_colonia: data.contact[0].colonia,
        contact_city: data.contact[0].city,
        contact_state: data.contact[0].state,
        contact_country: data.contact[0].country,
        contact_owned_by_id: data.contact[0].owned_by_id,
  });
 }

 navMetodoPedidos(){
  this.router.navigate(['fecha-pago-pedido']);
}
}
