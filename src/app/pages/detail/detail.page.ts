import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
// import { ImagesService } from 'src/app/services/images.service';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { SaveDataService } from 'src/app/services/save-data.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  order: any;
  documento: any;
  hora_antes: any;
  hora_despues: any;
  pago: any;
  ruta: any;
  currency: any;
  status: any;

  total = 0;
  impuestos = 0;
  subtotal = 0;

  isorder: any;

  constructor(
    public platform: Platform,
    private router: Router,
    private navExtras: NavExtrasServiceService,
    private storageservice: StorageService,
    public toastController: ToastController,
    private savedataservice: SaveDataService,
    /*private imageservice: ImagesService*/) { }

  ngOnInit() {
    const extra = this.navExtras.getExtras();
    this.order = extra.order;
    console.log(this.order)
    this.isorder = extra.isorder;

    this.storageservice.getStatus().then(statusList => {
      this.status = statusList.find(status => status.id == this.order.order.order_status_id);
    });

    this.storageservice.getPagos().then(pagosList => {
      this.pago = pagosList.find(pago => pago.id == this.order.order.pago_id);
    });

    this.storageservice.getRutas().then(rutasList => {
      this.ruta = rutasList.find(ruta => ruta.id == this.order.order.ruta_id);
    });

    this.storageservice.getDocuments().then(documentsList => {
      this.documento = documentsList.find(documento => documento.id == this.order.order.documento_id);
    });

    this.storageservice.getCurrency().then(currencyList => {
      this.currency = currencyList.find(currency => currency.id == this.order.order.currency_id);
    });

    this.storageservice.getHoras().then(horasList => {
      this.hora_antes = horasList.find(hora_antes => hora_antes.id == this.order.order.id_hora_antes);
      this.hora_despues = horasList.find(hora_despues => hora_despues.id == this.order.order.id_hora_despues);
    });


    if (this.order.order.currency_id == 62) {
      for (let i = 0; i < this.order.rows.length; i++) {
        if (this.order.rows[i].moneda == 'MN') {
          this.subtotal += this.order.rows[i].price * this.order.rows[i].quantity;
        } else {
          this.subtotal += this.order.rows[i].price * this.order.rows[i].quantity * this.order.order.tipo_cambio;
        }
      }
    } else if (this.order.order.currency_id == 96) {
      for (let i = 0; i < this.order.rows.length; i++) {
        if (this.order.rows[i].moneda == 'DL') {
          this.subtotal += this.order.rows[i].price * this.order.rows[i].quantity;
        } else {
          this.subtotal += this.order.rows[i].price * this.order.rows[i].quantity / this.order.order.tipo_cambio;
        }
      }
    }
    this.impuestos = this.order.order.total_order - this.subtotal;

    this.total = this.order.order.total_order;
  }

  crearPedido() {
    this.savedataservice.saveOrder(this.order);
    this.borrarCotizacion();
  }

  borrarCotizacion() {
    this.storageservice.getCotizaciones().then(cotizacionesList => {
      let cotizaciones_list = cotizacionesList;
      cotizaciones_list.splice(cotizaciones_list.indexOf(this.order), 1);
      this.storageservice.setCotizaciones(cotizaciones_list);
    });
    this.presentToast('Cotizacion Eliminada.');
    this.router.navigate(['dashboard']);

  }

  async presentToast(data: any) {
    const toast = await this.toastController.create({
      message: data,
      duration: 5000
    });
    toast.present();
  }

  // public getPath(name) {
  //   return this.imageservice.getPath(name);
  // }

  // showImage(name) {
  //   this.imageservice.showImage(name);
  // }

}
