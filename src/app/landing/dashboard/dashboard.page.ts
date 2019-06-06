import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authentication.service';
import { OfflineDataService } from 'src/app/services/offline-data.service';

import { NotificationsService } from '../../services/notifications.service';
import { StorageService } from '../../services/storage.service';

// import { LocationTrackerService } from '../../services/location-tracker.service';
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
    // public locationTracker: LocationTrackerService,
    private notificationService: NotificationsService,
    private storageservice: StorageService) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.storageservice.getCheckIn().then(val => {
      if (val) {
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
    this.storageservice.setCheckIn(this.checkInStatus)
    this.notificationService.notificationServiceOn()
  }

  checkOut() {
    // this.locationTracker.stopTracking();
    this.checkInStatus = false;
    this.storageservice.setCheckIn(this.checkInStatus)
  }

  logout() {
    this.checkOut();
    this.authService.logout();
  }
}
