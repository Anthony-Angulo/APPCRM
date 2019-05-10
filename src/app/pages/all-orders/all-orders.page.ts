import { Component, OnInit } from '@angular/core';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.page.html',
  styleUrls: ['./all-orders.page.scss'],
})
export class AllOrdersPage implements OnInit {

  orderData: any=[];

  constructor(
    private router: Router,
    private storageservice: StorageService,
    private navExtras: NavExtrasServiceService) { }

  ngOnInit() {
    this.storageservice.getOrders().then(orderList => {
      this.orderData = orderList;
    });
  }

  goToDetail(order){
    this.navExtras.setExtras({order:order, isorder:true});
    this.router.navigate(['detail']);
  }

}
