import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonSearchbar } from '@ionic/angular';

const PRODUCTS_KEY = 'products';
const SUCURSAL_KEY = 'sucursal';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  @ViewChild('productSearchBar') searchbar: IonSearchbar;

  productListAll:any = [];
  productListSucursal:any  = [];
  productListsearchBar:any  = [];

  sucursalList: any = [];
  sucursal_id: string = '1';

  constructor(private storage: Storage) { }

  ngOnInit() {

    this.storage.get(PRODUCTS_KEY).then(val => {
      this.productListAll = val;
      this.productListSucursal = this.productListAll.filter(product => product.sucursal_id == '1');
      this.productListsearchBar = this.productListSucursal;
    });

    this.storage.get(SUCURSAL_KEY).then(val => {
      this.sucursalList = val;
    });

  }

  searchProducts(val: any) {
    let valor = val.target.value;
    if (valor && valor.trim() != '') {
      this.productListsearchBar = this.productListSucursal.filter((item) => {
        return (item.name.toLowerCase().indexOf(valor.toLowerCase()) > -1);
      })
    } else {
      this.productListsearchBar = this.productListSucursal;
    }
  }

  cambioSucursal(event) {
    this.productListSucursal = this.productListAll.filter(product => product.sucursal_id == event.detail.value);
    this.productListsearchBar = this.productListSucursal;
    this.searchbar.value = '';
  }

}
