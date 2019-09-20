import { Component, OnInit } from '@angular/core';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notifications: any = [];
  orders: any = [];

  constructor(
    private router: Router,
    private storageservice: StorageService,
    private navExtras: NavExtrasServiceService) { }

  ngOnInit() {
    this.storageservice.getNotifications().then(notificationList => {
      this.notifications = notificationList;
    });

    this.storageservice.getOrders().then(orderList =>{
      this.orders = orderList;
    });
  }

  goToDetail(notification) {
    notification.vista = true;
    let order = this.orders.find(order => order.order.id == notification.id);
    this.navExtras.setExtras({ order: order, isorder: true });
    this.router.navigate(['detail']);
    this.storageservice.setNotifications(this.notifications);
  }

}
