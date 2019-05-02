import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ToastController } from '@ionic/angular';
import Swal from 'sweetalert2'

const STORAGE_ORDER_KEY = 'order_pendings';
const ORDER_KEY = 'orders';
const STORAGE_COTIZACION_KEY = 'cotizaciones';
const STORAGE_GEO_FORM_KEY = 'geo';
const STORAGE_EVENTS_KEY = 'events_pendings';
const STORAGE_TRACK_KEY = 'track_pendings';
const URL = 'http://192.168.101.23';

@Injectable({
  providedIn: 'root'
})
export class SaveDataService {

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router,
    private localNotifications: LocalNotifications,
    public toastController: ToastController,
    private geolocation: Geolocation) { }

  async presentToast(data:any) {
    const toast = await this.toastController.create({
      message: data,//'Dispositivo Conectado a Internet. Ordenes Registradas.',
      duration: 5000
    });
    toast.present();
  }

  public saveStorage(){
    
    // this.storage.get(STORAGE_ORDER_KEY).then(val => {
    //   if(val.length > 0){
    //     for(var i =0; i<val.length;i++){
    //       this.http.post(URL + '/api/generarPedido', val[i]).subscribe((data: any) => {

    //       });
    //     }
    //   }
    // });
    this.storage.get(STORAGE_GEO_FORM_KEY).then(val => {
      if(val.length > 0){
        this.http.post(URL + '/api/updateGeolocationContacts', val).subscribe( data  => {
          this.storage.set(STORAGE_GEO_FORM_KEY, null)
          this.presentToast('Geolocalizacion Guardada')
        }, (err: any) => {
          this.presentToast('a'+ err.error)
        });
      }
    });

    this.storage.get(STORAGE_EVENTS_KEY).then(val => {
      if(val.length > 0){
        this.http.post(URL + '/api/addEvent', val).subscribe((data: any) => {
          this.storage.set(STORAGE_EVENTS_KEY, null)
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
        fullday:  ( element.allDay) ? 1 : 0,
        priority_id: element.priority,  
      };
      eventsData.push(formDataEvent);
    });
    
    this.http.post(URL + '/api/addEvent', eventsData).subscribe((data: any) => {

      this.presentToast('Eventos Guardados');

    }, (err: any) => {

      this.storage.get(STORAGE_EVENTS_KEY).then(events => {
        let event_list
        if(events == null){
          event_list = eventsData;
        } else {
          event_list = events;
          eventsData.forEach(element=> {
            event_list.push(element);
          })
        }
        this.storage.set(STORAGE_EVENTS_KEY, event_list);
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

      return this.saveGeolocation([formData])

    }).catch((error) => {
      throw Error("Error al querer optener geolocalizacion:" + error)
    });
    return geo_promise
  }

  private saveGeolocation(data){

    console.log('19')
    this.http.post(URL + '/api/updateGeolocationContacts', data).subscribe( resp => {

      Swal.fire({
        title: "Geolocalizacion Guardada",
        type: "success",
        confirmButtonText: "Enterado."
      });
      
    }, (err: any) => {
      
      this.storage.get(STORAGE_GEO_FORM_KEY).then(geo_update => {
        let geo_list = (geo_update == null) ? [] : geo_update;
        geo_list.push(data[0]);
        this.storage.set(STORAGE_GEO_FORM_KEY, geo_list);
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
      
      this.localNotifications.schedule({
        text: 'There is no conection'
      });

      this.storage.get(STORAGE_TRACK_KEY).then(tracks => {
        let track_list = (tracks == null) ? [] : tracks;
        track_list.push(data);
        this.storage.set(STORAGE_TRACK_KEY, track_list);
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

  public saveOrder(form){

    let order = {
      order: form.order,
      rows: form.rows,
    }

    this.storage.get(ORDER_KEY).then(ordenes => {
      let order_list = (ordenes == null) ? [] : ordenes;
      order_list.push(order);
      this.storage.set(ORDER_KEY, order_list);
    });

    this.http.post(URL + '/api/generarPedido', form).subscribe((data: any) => {

      let idPedido = JSON.parse(data);

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
      
      this.storage.get(STORAGE_ORDER_KEY).then(ordener_pendientes => {
        let order_list = (ordener_pendientes == null) ? [] : ordener_pendientes;
        order_list.push(form);
        this.storage.set(STORAGE_ORDER_KEY, order_list);
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

    this.storage.get(STORAGE_COTIZACION_KEY).then(cotizaciones => {
      let cotizaciones_list = (cotizaciones == null) ? [] : cotizaciones;
      cotizaciones_list.push(form);
      this.storage.set(STORAGE_COTIZACION_KEY, cotizaciones_list);
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
