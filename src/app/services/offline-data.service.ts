import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { environment as ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfflineDataService {

  constructor(
    private storageservice: StorageService,
    private network: Network,
    private alertCtrl: AlertController,
    private http: HttpClient,
    public loadingController: LoadingController) { }

  async getDataOffline() {

    if (this.network.type == 'none') {
      const alert = await this.alertCtrl.create({
        header: 'No Internet',
        message: 'No se puede optener la informacion por falta de conexion a internet',
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Obteniendo Datos...',
    });
    await loading.present();

    this.storageservice.getUserID().then((val) => {

      this.http.get(ENV.BASE_URL + '/contact/' + val).toPromise().then((data: any) => {
        this.storageservice.setContacts(data);
      }).catch(error => {
        console.error(error);
      });

      this.http.get(ENV.BASE_URL + '/events/' + val).toPromise().then((data: any) => {
        data.events.forEach(element => {
          element.endTime = new Date(Date.parse(element.endTime));
          element.startTime = new Date(Date.parse(element.startTime));
          element.allDay = (element.allDay) ? true : false;
        });
        this.storageservice.setEvents(data.events);
        this.storageservice.setEventsPriority(data.priority);
      }).catch(error => {
        console.error(error);
      });

      this.http.get(ENV.BASE_URL + '/orders_by_owner/' + val).toPromise().then((data: any) => {

        let orders_list = [];
        data[0].forEach(order => {
          let rows = data[1].filter(row => row.order_id == order.id);
          orders_list.push({ order: order, rows: rows });
        });
        this.storageservice.setOrders(orders_list);
      }).catch(error => {
        console.error(error);
      });

      this.storageservice.setNotifications([]);

    });

    this.http.get(ENV.BASE_URL + '/info').toPromise().then((data: any) => {
      this.storageservice.setStatus(data.status);
      this.storageservice.setSucursales(data.sucursal);
      this.storageservice.setPagos(data.pagos);
      this.storageservice.setRutas(data.rutas);
      this.storageservice.setDocuments(data.documents);
      this.storageservice.setCurrency(data.currency);
      this.storageservice.setHoras(data.horas);
      this.storageservice.setTes(data.tes);
      this.storageservice.setImpuestos(data.impuestos);
      this.storageservice.setCambio(data.cambio[0].moneda_venta);
    }).catch(error => {
      console.error(error);
    });

    this.http.get(ENV.BASE_URL + '/products/' + 1).toPromise().then((data: any) => {
      this.storageservice.setProducts(data);
    }).catch(error => {
      console.error(error);
    }).finally(() => {
      loading.dismiss();
    });

  }

}
