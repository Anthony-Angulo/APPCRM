import { Injectable } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { SaveDataService } from 'src/app/services/save-data.service';
import 'rxjs/add/operator/filter';

@Injectable({
  providedIn: 'root'
})
export class LocationTrackerService {

  public watch: any;    
  public lat: number = 0;
  public lng: number = 0;

  constructor(
    private saveData: SaveDataService, 
    private geolocation: Geolocation,
    private backgroundGeolocation: BackgroundGeolocation,) {

  }

  startTracking() {

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 1000,
      distanceFilter: 500, 
      debug: false,
      interval: 2000,
      stopOnTerminate: false, 
    };

    this.backgroundGeolocation.configure(config).then((location) => {

      this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe(location => {

        let formData = {
          user_id: 853,
          movimiento_id: 1,
          latitud: location.latitude,
          longitud: location.longitude,
          order_number: ''
        };

        this.saveData.saveUserTrack(formData);

      }, (err) => { 

        console.log(err);

      });
    })
    
    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();


    // Foreground Tracking

    // let options = {
    //   frequency: 3000, 
    //   enableHighAccuracy: true
    // };

    // this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

    // console.log(position);

    // });

  }

  stopTracking() {

    console.log('stopTracking');

    this.backgroundGeolocation.stop()
    this.backgroundGeolocation.finish();
    // this.watch.unsubscribe();

  }

}
