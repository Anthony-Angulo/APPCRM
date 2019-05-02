import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { Router } from '@angular/router';

const ORDERS_KEY = 'orders';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.page.html',
  styleUrls: ['./all-orders.page.scss'],
})
export class AllOrdersPage implements OnInit {

  orderData: any=[];

  constructor(
    private storage: Storage,
    private router: Router,
    private navExtras: NavExtrasServiceService) { }

  ngOnInit() {
    this.storage.get(ORDERS_KEY).then((val) => {
      this.orderData = val;
    });
  }

  goToDetail(order){
    this.navExtras.setExtras({order:order, isorder:true});
    this.router.navigate(['detail']);
  }

}
