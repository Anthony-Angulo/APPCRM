import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';
import { OfflineDataService } from 'src/app/services/offline-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  checkInStatusFalse: boolean = true;
  checkInStatusTrue: boolean = false;

  formData = { user_id: '', movimiento_id: 0, latitud: 0, longitud: 0, order_number: '' };
  storageFormData = 'formData';

  url = 'http://192.168.0.41';
  watch: any = 0;
  userid: any = 0;
  valor: any = 0;
  longitud
  latitud

  constructor(
    private authService: AuthenticationService,
    private offlineData: OfflineDataService,
    private geolocation: Geolocation,
    private http: HttpClient,
    private storage: Storage,
    private network: Network,
    private router: Router) { }

  ngOnInit() {

    this.network.onConnect().subscribe(() => {
      if (this.storage.get(this.storageFormData) === null) {
        Swal.fire({

          title: "Conexion Encontrada. Sin Pedidos Pendientes.",
          type: "success",
          confirmButtonText: "Enterado."

        });
      } else {
        this.storage.get(this.storageFormData).then(val => {

        })
      }
    });
    this.storage.get("USER_ID").then(val=>{
      this.userid=val;
    });
    this.offlineData.getDataOffline();

  }

  checkIn() {
    this.geolocation.getCurrentPosition({ timeout: 600000, enableHighAccuracy: true }).then((resp) => {
      this.formData = {
        user_id: this.userid.replace('"', ''),
        movimiento_id: 1,
        latitud: resp.coords.latitude,
        longitud: resp.coords.longitude,
        order_number: ''
      };
      this.latitud = resp.coords.latitude;
      this.longitud = resp.coords.longitude;
      this.checkInStatusFalse = false;
      this.checkInStatusTrue = true;
      this.checkInRuta();
      // this.http.post(this.url + '/api/usertrck', this.formData).subscribe((resp: any) => {
      //   console.log(JSON.parse(resp));
      // });
      
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  checkInRuta() {
    this.watch = this.geolocation.watchPosition().subscribe((resp: any) => {
      var R = 6378.137; // Radius of earth in KM
      var dLat = resp.coords.latitude * Math.PI / 180 - this.latitud * Math.PI / 180;
      var dLon = resp.coords.longitude * Math.PI / 180 - this.longitud * Math.PI / 180;
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.latitud * Math.PI / 180) * Math.cos(resp.coords.latitude * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var distanciaKilometros = R * c;
      if(distanciaKilometros > 1){
        this.longitud = resp.coords.longitude;
        this.latitud = resp.coords.latitude;
        console.log(distanciaKilometros + " " + this.longitud + " " + this.latitud)
      }



      // this.storage.get('USER_ID').then((val: any) => {
      //   this.formData.user_id = val.replace('"', '');
      //   this.formData.movimiento_id = 7;
      //   this.formData.latitud = resp.coords.latitude;
      //   this.formData.longitud = resp.coords.longitude;
      //   this.http.post(this.url + '/api/usertrck', this.formData).subscribe((resp: any) => {
      //     console.log(JSON.parse(resp));
      //   });
      // });


    });
  }

  checkOut() {
    this.watch.unsubscribe();
    this.checkInStatusFalse = true;
    this.checkInStatusTrue = false;
  }

  logout() {
    this.authService.logout();
  }
}
