import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  Marker,
  GoogleMapsEvent,
  Environment
} from '@ionic-native/google-maps/ngx';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { SaveDataService } from 'src/app/services/save-data.service';
import { Router } from '@angular/router';

const COTIZACIONES_KEY = 'cotizaciones';
const CONTACTS_KEY = 'contacts';
const PAGO_KEY = 'pago';
const RUTAS_KEY = 'rutas';
const DOCUMENTS_KEY = 'documents';
const CURRENCY_KEY = 'currency';
const HORAS_KEY = 'horas';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  map: GoogleMap;
  order: any;
  documento : any;
  hora_antes: any;
  hora_despues: any;
  pago: any;
  ruta: any;
  contact: any = {full_name:''};
  currency: any;

  total: number = 0;
  impuestos: number = 0;
  subtotal: number = 0;

  isorder:any ;

  constructor(
    public platform: Platform,
    private router: Router,
    private navExtras: NavExtrasServiceService,
    private storage: Storage,
    public toastController: ToastController,
    private savedataservice: SaveDataService) { }

  ngOnInit() {
    var extra = this.navExtras.getExtras();
    this.order = extra.order;
    this.isorder = extra.isorder;
    
    this.storage.get(CONTACTS_KEY).then(val => {
      this.contact = val.find(contact => contact.id == this.order.order.contact_id)
    });

    this.storage.get(PAGO_KEY).then(val => {
      this.pago = val.find(pago => pago.id == this.order.order.pago_id)
    });

    this.storage.get(RUTAS_KEY).then(val => {
      this.ruta = val.find(ruta => ruta.id == this.order.order.ruta_id)
    });

    this.storage.get(DOCUMENTS_KEY).then(val => {
      this.documento = val.find(documento => documento.id == this.order.order.documento_id)
    });

    this.storage.get(CURRENCY_KEY).then(val => {
      this.currency = val.find(currency => currency.id == this.order.order.currency_id)
    });

    this.storage.get(HORAS_KEY).then(val => {
      this.hora_antes = val.find(hora_antes => hora_antes.id == this.order.order.id_hora_antes)
      this.hora_despues = val.find(hora_despues => hora_despues.id == this.order.order.id_hora_despues)
    });

    if (this.order.order.currency_id == 62) {
      for (var i = 0; i < this.order.rows.length; i++) {
        if (this.order.rows[i].moneda == "MN") {
          this.subtotal += this.order.rows[i].price * this.order.rows[i].quantity;
        } else {
          this.subtotal += this.order.rows[i].price * this.order.rows[i].quantity * this.order.order.tipo_cambio;
        }
      }
    } else if(this.order.order.currency_id == 96) {
      for (var i = 0; i < this.order.rows.length; i++) {
        if (this.order.rows[i].moneda == "DL") {
          this.subtotal += this.order.rows[i].price * this.order.rows[i].quantity;
        } else {
          this.subtotal += this.order.rows[i].price * this.order.rows[i].quantity / this.order.order.tipo_cambio;
        }
      }
    }
    this.impuestos = this.order.order.total_order - this.subtotal; 
  
    this.total = this.order.order.total_order
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
          lat: this.contact.latitud,
          lng: this.contact.longitud
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
        lat: this.contact.latitud,
        lng: this.contact.longitud
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('clicked');
    });
  }

  crearPedido(){
    this.savedataservice.saveOrder(this.order);
    this.borrarCotizacion();
  }

  borrarCotizacion(){
    this.storage.get(COTIZACIONES_KEY).then(val=>{
      var cotizaciones_list = val;
      cotizaciones_list.splice(cotizaciones_list.indexOf(this.order), 1);
      this.storage.set(COTIZACIONES_KEY, cotizaciones_list);
    })
    this.presentToast('Cotizacion Eliminada.')
    this.router.navigate(['dashboard']);

  }

  async presentToast(data:any) {
    const toast = await this.toastController.create({
      message: data,//'Dispositivo Conectado a Internet. Ordenes Registradas.',
      duration: 5000
    });
    toast.present();
  }

}
