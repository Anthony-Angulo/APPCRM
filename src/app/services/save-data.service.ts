import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { StorageService } from '../services/storage.service'
import Swal from 'sweetalert2'

const URL = 'http://192.168.101.23';

@Injectable({
  providedIn: 'root'
})
export class SaveDataService {

  networksub: any;

  constructor(
    private http: HttpClient,
    private storageservice: StorageService,
    private router: Router,
    private network: Network,
    private localNotifications: LocalNotifications,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private geolocation: Geolocation) { }

  async presentToast(data:any) {
    const toast = await this.toastController.create({
      message: data,//'Dispositivo Conectado a Internet. Ordenes Registradas.',
      duration: 5000
    });
    toast.present();
  }

  public startNetwork(){
    this.networksub = this.network.onConnect().subscribe(() => {
      this.saveStorage()
    });
  }

  public stopNetwork(){
    this.networksub.unsubscribe()
  }

  public saveStorage(){
    
    this.storageservice.getPendingOrders().then(val => {
      if(val.length > 0){
        for(var i=val.length-1; i >= 0 ; i--){
          this.http.post(URL + '/api/generarPedido', val[i]).subscribe((data: any) => {
            val.splice(i, 1);
          });
          this.storageservice.setPendingOrders(val);
        }
      }
    });
    
    this.storageservice.getPendingGeoUpdate().then(val => {
      if(val.length > 0){
        this.http.post(URL + '/api/updateGeolocationContacts', val).subscribe( data  => {
          this.storageservice.setPendingGeoUpdate(null)
          this.presentToast('Geolocalizacion Guardada')
        }, (err: any) => {
          this.presentToast('a'+ err.error)
        });
      }
    });

    this.storageservice.getPendingEvents().then(val => {
      if(val.length > 0){
        this.http.post(URL + '/api/addEvent', val).subscribe((data: any) => {
          this.storageservice.setPendingEvents(null)
          this.presentToast('Eventos Guardados');
        }, (err: any) => {
          this.presentToast('a'+ err.error)
        });
      }
    });

  }

  public saveEvents(events, user_id){
      
    let eventsData = [];
    let getDate = function(time){
      return time.getFullYear() + "-" + 
          (1 + time.getMonth()) + "-" + 
          time.getDate() + " " + 
          time.toLocaleTimeString().slice(0, -2)
    }

    events.forEach(element => {
      let formDataEvent = { 
        name: element.title,
        owned_by_id: user_id,
        description: element.desc,
        start_date: getDate(element.startTime),
        end_date: getDate(element.endTime),
        fullday: (element.allDay) ? 1 : 0,
        priority_id: element.priority,  
      };
      eventsData.push(formDataEvent);
    });
    
    this.http.post(URL + '/api/addEvent', eventsData).subscribe((data: any) => {

      this.presentToast('Eventos Guardados');

    }, (err: any) => {

      this.storageservice.getPendingEvents().then(events => {
        let event_list
        if(events == null){
          event_list = eventsData;
        } else {
          event_list = events;
          eventsData.forEach(element=> {
            event_list.push(element);
          })
        }
        this.storageservice.setPendingEvents(event_list);
      });;
      
    });

  }

  public updateGeolocation(id: number){
    var geo_promise = this.geolocation.getCurrentPosition({ timeout: 600000, enableHighAccuracy: true }).then((resp) => {

      let formData = { 
        id: id,
        longitude: resp.coords.longitude,
        latitude: resp.coords.latitude 
      };

      this.storageservice.getContacts().then(contactList => {
        let index = contactList.findIndex(contact => contact.id == id)
        contactList[index].latitud = formData.latitude;
        contactList[index].longitud = formData.longitude;
        this.storageservice.setContacts(contactList); 
      })
      
      return this.saveGeolocation([formData])

    }).catch((error) => {
      throw Error("Error al querer optener geolocalizacion:" + error)
    });
    return geo_promise
  }

  private saveGeolocation(data){

    this.http.post(URL + '/api/updateGeolocationContacts', data).subscribe( resp => {

      Swal.fire({
        title: "Geolocalizacion Guardada",
        type: "success",
        confirmButtonText: "Enterado."
      });
      
    }, (err: any) => {
      
      this.storageservice.getPendingGeoUpdate().then(geo_update => {
        let geo_list = (geo_update == null) ? [] : geo_update;
        geo_list.push(data[0]);
        this.storageservice.setPendingGeoUpdate(geo_list);
      });

      Swal.fire({

        title: "Actualizacion Pendiente. Esperando Conexion.",
        type: "success",
        confirmButtonText: "Enterado."

      });
      
    });
    return data[0];
  }

  public saveUserTrack(data){

    this.http.post(URL + '/api/usertrck', data).subscribe((resp: any) => {
        
      this.localNotifications.schedule({
        text: 'There is a legendary Pokemon near you'
      });

    }), (err: any) => {
    
      this.storageservice.getPendingTrack().then(tracks => {
        let track_list = (tracks == null) ? [] : tracks;
        track_list.push(data);
        this.storageservice.setPendingTrack(track_list);
      });
      
    };

  }

  public generateOrder(order, products, pedido){
        
    this.geolocation.getCurrentPosition({ timeout: 600000, enableHighAccuracy: true }).then(resp => {

      //Formulario a enviar para el registro de la posicion del vendedor al momento de registrar la orden
      let formDataTrack = { 
        user_id: order.owned_by_id, 
        movimiento_id: 3,
        latitud: resp.coords.latitude,
        longitud: resp.coords.longitude,
      };

      let rows = this.generateOrderRows(products);

      let form = {
        order: order,
        rows: rows,
        usertrack:formDataTrack
      }

      if(pedido){
        this.saveOrder(form);
      } else {
        this.guardarCotizacion(form);
      }

    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  async saveOrder(form){

    const loading = await this.loadingController.create({
      message: 'Guardando Orden...',
    });
    await loading.present();

    let order = {
      order: form.order,
      rows: form.rows,
    }

    this.http.post(URL + '/api/generarPedido', form)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe((data: any) => {

      let idPedido = data.token;
      
      for(var i=0;i<order.rows.length;i++){
        delete order.rows[i].codigoProtevs;
      }
      delete order.order.sucursal_id;
      delete order.order.bill_city;
      delete order.order.bill_country;
      delete order.order.bill_state;
      delete order.order.bill_street;
      delete order.order.bill_tax_number;
      delete order.order.bill_to;
      delete order.order.bill_zip_code;
      delete order.order.customer_no;
      delete order.order.observacion_pago
      delete order.order.observacion_recepcion
      delete order.order.order_date
      delete order.order.owned_by_id
      delete order.order.owned_by_name
      delete order.order.ship_city
      delete order.order.ship_country
      delete order.order.ship_state
      delete order.order.ship_street
      delete order.order.ship_tax_number
      delete order.order.ship_zip_code
      delete order.order.tienda_id

      order.order.order_number = idPedido;

      this.storageservice.getOrders().then(ordenes => {
        let order_list = (ordenes == null) ? [] : ordenes;
        order_list.push(order);
        this.storageservice.setOrders(order_list);
      });

      Swal.fire({

        title: "Pedido Guardado Con Exito.",
        type: "success",
        confirmButtonText: "Enterado."

      }).then((result) => {
        if (result.value) {
          this.router.navigate(['dashboard']);
        }
      });

    }, (err: any) => {
      
      this.storageservice.getPendingOrders().then(ordener_pendientes => {
        let order_list = (ordener_pendientes == null) ? [] : ordener_pendientes;
        order_list.push(form);
        this.storageservice.setPendingOrders(order_list);
      });
      
      Swal.fire({

        title: "Pedido Guardado En Almacenamiento. Esperando Conexion.",
        type: "success",
        confirmButtonText: "Enterado."

      }).then((result) => {
        if (result.value) {
          this.router.navigate(['dashboard']);
        }
      });

    });
  }

  private guardarCotizacion(form){

    this.storageservice.getCotizaciones().then(cotizaciones => {
      let cotizaciones_list = (cotizaciones == null) ? [] : cotizaciones;
      cotizaciones_list.push(form);
      this.storageservice.setCotizaciones(cotizaciones_list);
    });

    Swal.fire({

      title: "Cotizacion Almacenada.",
      type: "success",
      confirmButtonText: "Enterado."

    }).then((result) => {
      if (result.value) {
        this.router.navigate(['dashboard']);
      }
    });
  }

  private generateOrderRows(products) {
    let  orderRows = []

    for ( let product  of  products) {
      //Formulario a enviar para el registro de los productos de la orden
      let formDataOrderRows = { 
        product_name: product.product_name, 
        price: product.product_price,
        quantity: product.quantity,
        codigoProtevs: product.product_codigo, 
        unidad_medida: product.product_UM,
        moneda: product.product_moneda
      };
      orderRows.push(formDataOrderRows);
    }

    return orderRows;
  }
}
