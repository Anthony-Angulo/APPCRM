import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { StorageService } from 'src/app/services/storage.service';
import 'rxjs/add/operator/timeout';

const URL = 'http://192.168.101.23';

@Injectable({
  providedIn: 'root'
})
export class OfflineDataService {

  constructor(private storageservice: StorageService, private http: HttpClient, public loadingController: LoadingController) { }

  async getDataOffline() {

    const loading = await this.loadingController.create({
      message: 'Obteniendo Datos...',
    });
    await loading.present();
  
    this.storageservice.getUserID().then((val) => {
      
      this.http.get(URL + '/api/contact/' + val).timeout(3000).subscribe((data: any) => {
        this.storageservice.setContacts(data);
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
        this.storageservice.setEvents(events);
        this.storageservice.setEventsPriority(data.priority)
      })

      this.http.get(URL + '/api/orders_by_owner/' + val).subscribe((data: any)=>{
        let orders_list = [];
        data[0].forEach(order => {
          let rows = data[1].filter(row => row.order_id == order.id)
          orders_list.push({order:order, rows:rows})
        });
        this.storageservice.setOrders(orders_list);
      });

    });

    this.http.get(URL + '/api/info').subscribe((data: any) => {
      // this.storage.set(STATUS_KEY, data.status);
      this.storageservice.setSucursales(data.sucursal);
      this.storageservice.setPagos(data.pagos);
      this.storageservice.setRutas(data.rutas);
      this.storageservice.setDocuments(data.documents);
      this.storageservice.setCurrency(data.currency);
      this.storageservice.setHoras(data.horas);
      this.storageservice.setTes(data.tes);
      this.storageservice.setImpuestos(data.impuestos);
      this.storageservice.setCambio(data.cambio[0].moneda_venta);
    });
    
    this.http.get(URL + '/api/products/' + 1)
      .pipe(
        finalize(() => {
            loading.dismiss();
        })
      )
      .subscribe((data: any) => {
        this.storageservice.setProducts(data);
      })

  }

}
