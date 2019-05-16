import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { StorageService } from 'src/app/services/storage.service';
import { environment as ENV } from 'src/environments/environment';
import 'rxjs/add/operator/timeout';

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
      
      this.http.get(ENV.BASE_URL + '/contact/' + val).timeout(3000).subscribe((data: any) => {
        this.storageservice.setContacts(data);
      })

      this.http.get(ENV.BASE_URL + '/events/' + val).subscribe((data: any) => {
        let events = []
        data.events.forEach(element => {
          element.endTime = new Date(Date.parse(element.endTime))
          element.startTime = new Date(Date.parse(element.startTime))
          element.allDay = (element.allDay) ? true : false
          events.push(element);
        });
        this.storageservice.setEvents(events);
        this.storageservice.setEventsPriority(data.priority)
      })

      this.http.get(ENV.BASE_URL + '/orders_by_owner/' + val).subscribe((data: any)=>{
        let orders_list = [];
        data[0].forEach(order => {
          let rows = data[1].filter(row => row.order_id == order.id)
          orders_list.push({order:order, rows:rows})
        });
        this.storageservice.setOrders(orders_list);
      });

    });

    this.http.get(ENV.BASE_URL + '/info').subscribe((data: any) => {
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
    
    this.http.get(ENV.BASE_URL + '/products/' + 1)
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
