import 'rxjs/add/operator/filter';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { BackgroundGeolocation, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SaveDataService } from 'src/app/services/save-data.service';
import { environment as ENV } from 'src/environments/environment';

import { StorageService } from './storage.service';

// const R = 6378.137; // Radius of earth in KM

@Injectable({
  providedIn: 'root'
})
export class LocationTrackerService {


  // formData = {
  //   user_id: '',
  //   movimiento_id: 0,
  //   latitud: 0,
  //   longitud: 0,
  //   order_number: ''
  // };

  public watch: any;
  public lat = 0;
  public lng = 0;

  constructor(
    private storageservice: StorageService,
    private saveData: SaveDataService,
    private geolocation: Geolocation,
    private http: HttpClient,
    // private backgroundGeolocation: BackgroundGeolocation,
  ) {

  }

  startTracking() {

    this.geolocation.getCurrentPosition().then(resp => {
      this.storageservice.getUserID().then((id: any) => {

        const formData = {
          user_id: id,
          movimiento_id: 1,
          latitud: resp.coords.latitude,
          longitud: resp.coords.longitude
        };

        this.http.post(ENV.BASE_URL + '/usertrck', formData).subscribe((resp: any) => {
          console.log(resp);
        });

      });
    }).catch(error => {
      console.log(error);
    });


    // let config = {
    //   desiredAccuracy: 0,
    //   stationaryRadius: 1000,
    //   distanceFilter: 500,
    //   debug: false,
    //   interval: 2000,
    //   stopOnTerminate: false,
    // };

    // this.backgroundGeolocation.configure(config).then((location) => {

    //   this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe(location => {

    //     let formData = {
    //       user_id: 853,
    //       movimiento_id: 1,
    //       latitud: location.latitude,
    //       longitud: location.longitude,
    //       order_number: ''
    //     };

    //     this.saveData.saveUserTrack(formData);

    //   }, (err) => {

    //     console.log(err);

    //   });
    // })

    // // Turn ON the background-geolocation system.
    // this.backgroundGeolocation.start();


    // Foreground Tracking

    // let options = {
    //   frequency: 3000,
    //   enableHighAccuracy: true
    // };

    // this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

    //   var dLat = resp.coords.latitude * Math.PI / 180 - this.latitud * Math.PI / 180;
    //   var dLon = resp.coords.longitude * Math.PI / 180 - this.longitud * Math.PI / 180;
    //   var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    //   Math.cos(this.latitud * Math.PI / 180) * Math.cos(resp.coords.latitude * Math.PI / 180) *
    //   Math.sin(dLon/2) * Math.sin(dLon/2);
    //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    //   var distanciaKilometros = R * c;
    //   if(distanciaKilometros > 1){
    //     this.longitud = resp.coords.longitude;
    //     this.latitud = resp.coords.latitude;
    //     console.log(distanciaKilometros + " " + this.longitud + " " + this.latitud)
    //   }






    // });




  }

  stopTracking() {

    console.log('stopTracking');

    // this.backgroundGeolocation.stop()
    // this.backgroundGeolocation.finish();
    // this.watch.unsubscribe();

    this.geolocation.getCurrentPosition().then(resp => {
      this.storageservice.getUserID().then((id: any) => {

        const formData = {
          user_id: id,
          movimiento_id: 2,
          latitud: resp.coords.latitude,
          longitud: resp.coords.longitude
        };

        this.http.post(ENV.BASE_URL + '/usertrck', formData).subscribe((resp: any) => {
          console.log(resp);
        });

      });
    }).catch(error => {
      console.log(error);
    });

  }

}
