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
import { Storage } from '@ionic/storage';
import { SaveDataService } from 'src/app/services/save-data.service';

const CONTACTS_KEY = 'contacts';

@Component({
  selector: 'app-entrega-pedido',
  templateUrl: './entrega-pedido.page.html',
  styleUrls: ['./entrega-pedido.page.scss'],
})
export class EntregaPedidoPage {
  map: GoogleMap;
  datos: any;
  contactList: any = [];

  constructor(
    public platform: Platform, 
    private router: Router,
    private storage: Storage,
    private savedataservice: SaveDataService,
    private navExtras: NavExtrasServiceService) { }

  ngOnInit(){
    this.datos = this.navExtras.getExtras();
    this.storage.get(CONTACTS_KEY).then(val => {
      this.contactList = val;
    });
  }
  ngAfterViewInit() {
    if(this.datos.contact.longitud!=null){
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

  public updateGeolocation(id: number){
    try{
      this.savedataservice.updateGeolocation(id).then(formData=>{
        var contact_index  = this.contactList.findIndex(contact => contact.id == id)
        this.contactList[contact_index].latitud = formData.latitude;
        this.contactList[contact_index].longitud = formData.longitude;
        this.datos.contact = this.contactList[contact_index]
        this.storage.set(CONTACTS_KEY, this.contactList);
        this.navExtras.setExtras(this.datos);
        this.loadMap();
      })
    }
    catch(e){

    }
  }

 navMetodoPedidos(){
  this.router.navigate(['fecha-pago-pedido']);
}
}
