import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AuthService } from 'src/app/services/authentication.service';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { OfflineDataService } from 'src/app/services/offline-data.service';
import { SaveDataService } from 'src/app/services/save-data.service';
import { LocationTrackerService  } from '../../services/location-tracker.service';

const R = 6378.137; // Radius of earth in KM

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  checkInStatus: boolean = false;

  formData = { 
    user_id: '', 
    movimiento_id: 0,
    latitud: 0,
    longitud: 0,
    order_number: ''
  };

  watch: any = 0;
  userid: any = 0;
  valor: any = 0;
  longitud
  latitud

  constructor(
    private authService: AuthService,
    private offlineData: OfflineDataService,
    private saveData: SaveDataService,
    private geolocation: Geolocation,
    public locationTracker: LocationTrackerService,
    private storage: Storage,
    private network: Network) { }

  ngOnInit() {

    this.network.onConnect().subscribe(() => {
        this.saveData.saveStorage()
    });

    this.storage.get("USER_ID").then(val=>{
      this.userid = val;
    });

    this.storage.get("check-in").then(val=>{
      this.checkInStatus = val;
    });

    this.offlineData.getDataOffline();

  }



  checkIn() {
    this.locationTracker.startTracking();
    
    // this.geolocation.getCurrentPosition({ timeout: 600000, enableHighAccuracy: true }).then((resp) => {
    //   this.formData = {
    //     user_id: this.userid.replace('"', ''),
    //     movimiento_id: 1,
    //     latitud: resp.coords.latitude,
    //     longitud: resp.coords.longitude,
    //     order_number: ''
    //   };
    //   this.latitud = resp.coords.latitude;
    //   this.longitud = resp.coords.longitude;
    //   this.checkInStatus = true;
    //   this.checkInRuta();
    //   // this.http.post(this.url + '/api/usertrck', this.formData).subscribe((resp: any) => {
    //   //   console.log(JSON.parse(resp));
    //   // });
      
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });
    this.checkInStatus = true;
    this.storage.set('check-in', this.checkInStatus);
  }

  checkInRuta() {
    this.watch = this.geolocation.watchPosition().subscribe((resp: any) => {
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
    this.locationTracker.stopTracking();
    // this.watch.unsubscribe();
    this.checkInStatus = false;
    this.storage.set('check-in', this.checkInStatus);
  }

  logout() {
    this.authService.logout();
  }
}
