import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsEvent, Marker } from '@ionic-native/google-maps/ngx';
import { Platform } from '@ionic/angular';
import { ImagesService } from 'src/app/services/images.service';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { SaveDataService } from 'src/app/services/save-data.service';

@Component({
  selector: 'app-entrega-pedido',
  templateUrl: './entrega-pedido.page.html',
  styleUrls: ['./entrega-pedido.page.scss'],
})
export class EntregaPedidoPage implements OnInit, AfterViewInit {
  map: GoogleMap;
  datos: any;

  constructor(
    public platform: Platform,
    private router: Router,
    private savedataservice: SaveDataService,
    private imageservice: ImagesService,
    private navExtras: NavExtrasServiceService) { }

  ngOnInit() {
    this.datos = this.navExtras.getExtras();
  }
  ngAfterViewInit() {
    if (this.datos.contact.longitud != null) {
      this.platform.ready().then(() => {
        this.loadMap();
      });
    }
  }

  async loadMap() {

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.datos.contact.latitud,
          lng: this.datos.contact.longitud
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
        lat: this.datos.contact.latitud,
        lng: this.datos.contact.longitud
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('clicked');
    });
  }

  public updateGeolocation(contact: any) {

    this.savedataservice.updateGeolocation(contact.id).then(formData => {
      contact.latitud = formData.latitude;
      contact.longitud = formData.longitude;
      this.datos.contact = contact;
      this.navExtras.setExtras(this.datos);
      this.loadMap();
    })

  }

  navMetodoPedidos() {
    this.router.navigate(['fecha-pago-pedido']);
  }

  public getPath(name) {
    return this.imageservice.getPath(name)
  }

  showImage(name) {
    this.imageservice.showImage(name)
  }

}
