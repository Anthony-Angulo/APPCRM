import { Component, OnInit } from '@angular/core';
import { NavParams, Platform } from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  Marker,
  GoogleMapsEvent,
  Environment
} from '@ionic-native/google-maps/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-revision-pedido',
  templateUrl: './revision-pedido.page.html',
  styleUrls: ['./revision-pedido.page.scss'],
})
export class RevisionPedidoPage  {
  map: GoogleMap;
  constructor(private navParams: NavParams, public platform: Platform, private router: Router) { }

  ngAfterViewInit() {
    const data = this.navParams.get('data');
    this.platform.ready().then( () => {
			this.loadMap();
		});
  }

  async loadMap() {

    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE':'',
      'API_KEY_FOR_BROWSER_DEBUG':''
    });

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
