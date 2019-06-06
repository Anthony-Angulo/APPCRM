import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { environment as ENV } from 'src/environments/environment';
import Swal from 'sweetalert2'

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
    public toastController: ToastController,
    public loadingController: LoadingController,
    private geolocation: Geolocation) { }

  async presentToast(data: any) {
    const toast = await this.toastController.create({
      message: data,//'Dispositivo Conectado a Internet. Ordenes Registradas.',
      duration: 5000
    });
    toast.present();
  }

  public startNetwork() {
    if (this.network.type != 'none') {
      this.saveStorage()
    }
    this.networksub = this.network.onConnect().subscribe(() => {
      this.saveStorage()
    });
  }

  public stopNetwork() {
    this.networksub.unsubscribe()
  }

  public saveStorage() {
    console.log('internet')
    this.storageservice.getPendingOrders().then(val => {
      if (val) {
        if (val.length > 0) {
          for (var i = val.length - 1; i >= 0; i--) {
            this.http.post(ENV.BASE_URL + '/generarPedido', val[i]).subscribe((data: any) => {
              val.splice(i, 1);
            });
            this.storageservice.setPendingOrders(val);
          }
        }
      }
    });

    this.storageservice.getPendingGeoUpdate().then(val => {
      if (val) {
        if (val.length > 0) {
          this.http.post(ENV.BASE_URL + '/updateGeolocationContacts', val).subscribe(data => {
            this.storageservice.setPendingGeoUpdate(null)
            this.presentToast('Geolocalizacion Guardada')
          }, (err: any) => {
            this.presentToast('a' + err.error)
          });
        }
      }
    });

    this.storageservice.getPendingEvents().then(val => {
      if (val) {
        if (val.length > 0) {
          this.http.post(ENV.BASE_URL + '/addEvent', val).subscribe((data: any) => {
            this.storageservice.setPendingEvents(null)
            this.presentToast('Eventos Guardados');
          }, (err: any) => {
            this.presentToast('a' + err.error)
          });
        }
      }
    });

  }

  public saveEvents(events, user_id) {

    let eventsData = [];
    let getDate = function (time) {
      return time.getFullYear() + "-" +
        (1 + time.getMonth()) + "-" +
        time.getDate() + " " +
        time.toLocaleTimeString().slice(0, -2)
    }

    events.forEach(element => {
      let formDataEvent = {
        name: element.title,
        owned_by_id: user_id,
        description: element.description,
        start_date: getDate(element.startTime),
        end_date: getDate(element.endTime),
        full_day: (element.allDay) ? 1 : 0,
        event_priority_id: element.event_priority_id,
      };
      eventsData.push(formDataEvent);
    });

    this.http.post(ENV.BASE_URL + '/addEvent', eventsData).subscribe((data: any) => {

      this.presentToast('Eventos Guardados');

    }, (err: any) => {

      this.storageservice.getPendingEvents().then(events => {

        if (events) {
          eventsData.forEach(element => {
            events.push(element);
          })
          this.storageservice.setPendingEvents(events);
        } else {
          this.storageservice.setPendingEvents(eventsData);
        }

      });;

    });

  }

  public updateGeolocation(id: number) {
    return this.geolocation.getCurrentPosition({ timeout: 600000, enableHighAccuracy: true }).then((resp) => {

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

      this.http.post(ENV.BASE_URL + '/updateGeolocationContacts', [formData]).subscribe(resp => {

        Swal.fire({
          title: "Geolocalizacion Guardada",
          type: "success",
          confirmButtonText: "Enterado."
        });

      }, (err: any) => {

        this.storageservice.getPendingGeoUpdate().then(geo_update => {

          if (geo_update) {
            geo_update.push(formData);
            this.storageservice.setPendingGeoUpdate(geo_update);
          } else {
            this.storageservice.setPendingGeoUpdate([formData]);
          }

        });

        Swal.fire({

          title: "Actualizacion Pendiente. Esperando Conexion.",
          type: "success",
          confirmButtonText: "Enterado."

        });

      });

      return formData

    }).catch((error) => {
      throw Error("Error al querer optener geolocalizacion:" + error)
    });

  }

  public saveUserTrack(data) {

    this.http.post(ENV.BASE_URL + '/usertrck', data).subscribe((resp: any) => {

      // this.localNotifications.schedule({
      //   text: 'There is a legendary Pokemon near you'
      // });

    }), (err: any) => {

      this.storageservice.getPendingTrack().then(tracks => {

        if (tracks) {
          tracks.push(data);
          this.storageservice.setPendingTrack(tracks);
        } else {
          this.storageservice.setPendingTrack([data]);
        }

      });

    };

  }

  public generateOrder(order, products, pedido) {

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
        usertrack: formDataTrack
      }

      if (pedido) {
        this.saveOrder(form);
      } else {
        this.guardarCotizacion(form);
      }

    }).catch((error) => {
      console.log('Error getting location', error);
    });

  }

  private guardarCotizacion(form) {

    this.storageservice.getCotizaciones().then(cotizaciones => {

      if (cotizaciones) {
        cotizaciones.push(form);
        this.storageservice.setCotizaciones(cotizaciones);
      } else {
        this.storageservice.setCotizaciones([form]);
      }

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

  async saveOrder(form) {

    const loading = await this.loadingController.create({
      message: 'Guardando Orden...',
    });
    await loading.present();

    let order = {
      order: form.order,
      rows: form.rows,
    }

    this.http.post(ENV.BASE_URL + '/generarPedido', form)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe((data: any) => {

        for (var i = 0; i < order.rows.length; i++) {
          delete order.rows[i].codigoProtevs
          delete order.rows[i].UM_mayoreo
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
        delete order.order.UM_mayoreo

        order.order.order_number = data.token;
        order.order.order_status_id = data.status

        this.storageservice.getOrders().then(ordenes => {

          if (ordenes) {
            ordenes.push(order);
            this.storageservice.setOrders(ordenes);
          } else {
            this.storageservice.setOrders([order]);
          }

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

        this.storageservice.getPendingOrders().then(ordenes_pendientes => {

          if (ordenes_pendientes) {
            ordenes_pendientes.push(form);
            this.storageservice.setPendingOrders(ordenes_pendientes);
          } else {
            this.storageservice.setPendingOrders([form]);
          }

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

  private generateOrderRows(products) {

    products.forEach(element => {
      delete element.total
      delete element.subtotal
      delete element.product_stock
      delete element.impuesto_cal
      delete element.impuestos_total
      delete element.pago_tipo
    });

    return products;
  }
}
