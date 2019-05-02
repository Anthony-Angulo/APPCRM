import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';

const URL = 'http://192.168.101.23';
const PRODUCTS_KEY = 'products';
const CONTACTS_KEY = 'contacts';
const STATUS_KEY = 'status';
const SUCURSAL_KEY = 'sucursal';
const PAGO_KEY = 'pago';
const RUTAS_KEY = 'rutas';
const DOCUMENTS_KEY = 'documents';
const CURRENCY_KEY = 'currency';
const HORAS_KEY = 'horas';
const TES_KEY = 'tes';
const IMPUESTOS_KEY = 'impuestos';
const ORDERS_KEY = 'orders';
const CAMBIO_KEY = 'cambio';
const EVENTOS_KEY = 'events';

@Injectable({
  providedIn: 'root'
})
export class OfflineDataService {

  constructor(private http: HttpClient, private storage: Storage, public loadingController: LoadingController) { }

  public getDataOffline() {

    this.presentLoading();

    this.storage.get('USER_ID').then((val) => {
      this.http.get(URL + '/api/contact/' + val).subscribe((data: any) => {
        this.storage.set(CONTACTS_KEY, data);
      })
      this.http.get(URL + '/api/events/' + val).subscribe((data: any) => {
        let events = []
        data.events.forEach(element => {
          let event = {
            title: element.title,
            desc: element.description,
            startTime: new Date(Date.parse(element.startTime)),
            endTime: new Date(Date.parse(element.endTime)),
            allDay: (element.allDay==1) ? true : false,
            priority: element.event_priority_id,
            status: element.status
          };
          events.push(event);
        });
        this.storage.set(EVENTOS_KEY, {events:events,priority:data.priority});
      })
    });

    this.http.get(URL + '/api/products/' + 1).subscribe((data: any) => {
      this.storage.set(PRODUCTS_KEY, data);
    })

    this.http.get(URL + '/api/info').subscribe((data: any) => {
      this.storage.set(STATUS_KEY, data.status);
      this.storage.set(SUCURSAL_KEY, data.sucursal);
      this.storage.set(PAGO_KEY, data.pagos);
      this.storage.set(RUTAS_KEY, data.rutas);
      this.storage.set(DOCUMENTS_KEY, data.documents);
      this.storage.set(CURRENCY_KEY, data.currency);
      this.storage.set(HORAS_KEY, data.horas);
      this.storage.set(TES_KEY, data.tes);
      this.storage.set(IMPUESTOS_KEY, data.impuestos);
      this.storage.set(CAMBIO_KEY, data.cambio[0].moneda_venta);
    });
    
    this.storage.get('USER_ID').then((val) => {
      this.http.get(URL + '/api/orders_by_owner/' +val).subscribe((data: any)=>{
        let orders_list = [];
        data[0].forEach(order => {
          let rows = data[1].filter(row => row.order_id == order.id)
          orders_list.push({order:order, rows:rows})
        });
        this.storage.set(ORDERS_KEY, orders_list);
      });
    });

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Obteniendo Datos..',
      duration: 5000
    });
    
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');

  }

}
