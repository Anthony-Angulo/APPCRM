import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.page.html',
  styleUrls: ['./all-orders.page.scss'],
})
export class AllOrdersPage implements OnInit {
  url: string = 'http://192.168.0.41';
  orderData: any=[];

  constructor(private http: HttpClient, private storage: Storage) { }

  ngOnInit() {
    this.storage.get('USER_ID').then((val) => {
      this.http.get(this.url + '/api/order/' +val)
      .subscribe((data: any)=>{
        this.orderData = JSON.parse(data);
      });
    });
  }

}
