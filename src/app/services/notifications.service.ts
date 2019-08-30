import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { StorageService } from './storage.service';
import { environment as ENV } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const APP_ID = "1da8f75f-ed04-428b-ac55-bdd4fdeb0063";
const ANDROID_ID = "666882513764";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private oneSignal: OneSignal,
    private storageservice: StorageService,
    private http: HttpClient) { }

  notificationServiceOn() {

    this.oneSignal.startInit(APP_ID, ANDROID_ID);

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification)

    this.storageservice.getRegisterOneSignal().then(register => {

      // if (register==null) {
        this.oneSignal.getIds().then(val => {
          this.storageservice.getUserID().then(id => {
            let formData = {
              crm_userId: id,
              onesignal_deviceId: val.userId
            }
            this.http.post(ENV.BASE_URL + "/oneSignal", formData).subscribe(resp => {
              this.storageservice.setRegisterOneSignal(val.userId)
            }, (err) => {
              console.log(err)
            })
          })
        });
      // }

    })
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      let notification = {
        name: data.payload.body,
        id: data.payload.additionalData.id,
        vista: false
      }

      this.storageservice.getOrders().then(orderList => {

        let index = orderList.findIndex(order => {
          if (order.order.id != undefined) {
            return order.order.id == data.payload.additionalData.id
          }
          return order.order.order_number == data.payload.additionalData.order_number
        })

        if (index > -1) {
          orderList[index].order.order_status_id = data.payload.additionalData.status_id
          this.storageservice.setOrders(orderList)
          this.storageservice.getNotifications().then(notificationsList => {
            if (notificationsList) {
              notificationsList.push(notification);
              this.storageservice.setNotifications(notificationsList);
            } else {
              this.storageservice.setNotifications([notification]);
            }
          })
        }
        
      })
    });

    this.oneSignal.endInit();

  }
}
