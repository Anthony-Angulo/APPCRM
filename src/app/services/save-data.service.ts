import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Network } from '@ionic-native/network/ngx';
import { ToastController } from '@ionic/angular';
import { environment as ENV } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class SaveDataService {

  networksub: any;

  constructor(private http: HttpClient,
    private storageservice: StorageService,
    private router: Router,
    private network: Network,
    private toastController: ToastController,
    private geolocation: Geolocation) { }

  async presentToast(data: any) {
    const toast = await this.toastController.create({
      message: data, // 'Dispositivo Conectado a Internet. Ordenes Registradas.',
      duration: 5000
    });
    toast.present();
  }

  public startNetwork() {
    if (this.network.type != 'none') {
      this.saveStorage();
    }
    this.networksub = this.network.onConnect().subscribe(() => {
      this.saveStorage();
    });
  }

  public stopNetwork() {
    this.networksub.unsubscribe();
  }

  public saveStorage() {
    this.storageservice.getPendingOrders().then(val => {
      if (val) {
        if (val.length > 0) {
          for (let i = val.length - 1; i >= 0; i--) {
            this.http.post(ENV.BASE_URL + '/generarPedido', val[i]).subscribe((data: any) => {
              val.splice(i, 1);
              this.storageservice.setPendingOrders(val);
            });
          }
        }
      }
    });

    this.storageservice.getPendingGeoUpdate().then(val => {
      if (val) {
        if (val.length > 0) {
          this.http.post(ENV.BASE_URL + '/updateGeolocationContacts', val).subscribe(data => {
            this.storageservice.setPendingGeoUpdate(null);
            this.presentToast('Geolocalizacion Guardada');
          }, (err: any) => {
            this.presentToast('a' + err.error);
          });
        }
      }
    });

    this.storageservice.getPendingEvents().then(val => {
      if (val) {
        if (val.length > 0) {
          this.http.post(ENV.BASE_URL + '/addEvent', val).subscribe((data: any) => {
            this.storageservice.setPendingEvents(null);
            this.presentToast('Eventos Guardados');
          }, (err: any) => {
            this.presentToast('a' + err.error);
          });
        }
      }
    });

  }

  public saveEvents(events, user_id) {

    let eventsData = [];

    events.forEach(element => {
      const formDataEvent = {
        name: element.title,
        owned_by_id: user_id,
        description: element.description,
        start_date: element.startTime.getMySQLFormat(),
        end_date: element.endTime.getMySQLFormat(),
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
          });
          this.storageservice.setPendingEvents(events);
        } else {
          this.storageservice.setPendingEvents(eventsData);
        }

      });

    });

  }

  public updateGeolocation(id: number) {
    return this.geolocation.getCurrentPosition({ timeout: 600000, enableHighAccuracy: true }).then((resp) => {

      const formData = {
        id: id,
        longitude: resp.coords.longitude,
        latitude: resp.coords.latitude
      };

      this.storageservice.getContacts().then(contactList => {
        const index = contactList.findIndex(contact => contact.id == id);
        contactList[index].latitud = formData.latitude;
        contactList[index].longitud = formData.longitude;
        this.storageservice.setContacts(contactList);
      });

      this.http.post(ENV.BASE_URL + '/updateGeolocationContacts', [formData]).toPromise().then(resp => {

        Swal.fire({
          title: 'Geolocalizacion Guardada',
          type: 'success',
          confirmButtonText: 'Enterado.'
        });

      }).catch(error => {

        console.error(error);
        this.storageservice.getPendingGeoUpdate().then(geo_update => {

          if (geo_update) {
            geo_update.push(formData);
            this.storageservice.setPendingGeoUpdate(geo_update);
          } else {
            this.storageservice.setPendingGeoUpdate([formData]);
          }

        });

        Swal.fire({

          title: 'Actualizacion Pendiente. Esperando Conexion.',
          type: 'success',
          confirmButtonText: 'Enterado.'

        });

      });

      return formData;

    }).catch((error) => {
      throw Error('Error al querer optener geolocalizacion:' + error);
    });

  }

  public saveUserTrack(data) {

    this.http.post(ENV.BASE_URL + '/usertrck', data).toPromise().then((resp: any) => {

      // this.localNotifications.schedule({
      //   text: 'There is a legendary Pokemon near you'
      // });

    }).catch(error => {

      console.error(error);

      this.storageservice.getPendingTrack().then(tracks => {

        if (tracks) {
          tracks.push(data);
          this.storageservice.setPendingTrack(tracks);
        } else {
          this.storageservice.setPendingTrack([data]);
        }

      });

    });

  }

  async generateOrder(order, products, pedido) {

    let coordenada = {
      coords: {
        latitude: 0,
        longitude: 0
      }
    };

    try {
      coordenada = await this.geolocation.getCurrentPosition({ timeout: 600000, enableHighAccuracy: true });
    } catch (error) {
      console.log('Error getting location', error);
    }

    const formDataTrack = {
      user_id: order.owned_by_id,
      movimiento_id: 3,
      latitud: coordenada.coords.latitude,
      longitud: coordenada.coords.longitude,
    };

    const form = {
      order: order,
      rows: this.generateOrderRows(products),
      usertrack: formDataTrack
    };

    if (pedido) {
      return this.saveOrder(form);
    } else {
      return this.guardarCotizacion(form);
    }

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

      title: 'Cotizacion Almacenada.',
      type: 'success',
      confirmButtonText: 'Enterado.'

    }).then((result) => {
      if (result.value) {
        this.router.navigate(['dashboard']);
      }
    });
  }

  async saveOrder(form) {

    const order = {
      order: form.order,
      rows: form.rows,
    };

    console.log(order)
    return this.http.post(ENV.BASE_URL + '/generarPedido', form).toPromise().then((data: any) => {

      order.order.order_number = data.token;
      order.order.order_status_id = data.status;

      this.storageservice.getOrders().then(ordenes => {

        if (ordenes) {
          ordenes.push(order);
          this.storageservice.setOrders(ordenes);
        } else {
          this.storageservice.setOrders([order]);
        }

      });

      return true;
    }).catch(error => {

      console.error(error);

      this.storageservice.getPendingOrders().then(ordenesPendientes => {

        if (ordenesPendientes) {
          ordenesPendientes.push(form);
          this.storageservice.setPendingOrders(ordenesPendientes);
        } else {
          this.storageservice.setPendingOrders([form]);
        }

      });

      return false;

    });

  }

  private generateOrderRows(products) {

    products.map(element => {
      delete element.total;
      delete element.subtotal;
      delete element.product_stock;
      delete element.impuesto_cal;
      delete element.impuestos_total;
      delete element.pago_tipo;
    });

    return products;
  }
}
