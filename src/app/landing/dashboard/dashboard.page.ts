import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authentication.service';
import { Storage } from '@ionic/storage';
import { OfflineDataService } from 'src/app/services/offline-data.service';
import { LocationTrackerService  } from '../../services/location-tracker.service';
import { StorageService  } from '../../services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  checkInStatus: boolean = false;

  constructor(
    private authService: AuthService,
    private offlineData: OfflineDataService,
    public locationTracker: LocationTrackerService,
    private storage: Storage,
    private storageservice: StorageService) { }
    
  ngOnInit() {    

    this.storage.get("check-in").then(val => {
      if(val){
        this.checkInStatus = true;
      } else {
        this.checkInStatus = false;
        this.offlineData.getDataOffline();
      }
    });

  }

  checkIn() {
    // this.locationTracker.startTracking();
    this.checkInStatus = true;
    this.storage.set('check-in', this.checkInStatus);
  }

  checkOut() {
    // this.locationTracker.stopTracking();
    this.checkInStatus = false;
    this.storage.set('check-in', this.checkInStatus);
  }

  logout() {
    this.checkOut();
    this.authService.logout();
  }
}
