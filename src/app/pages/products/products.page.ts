import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  @ViewChild('productSearchBar') searchbar: IonSearchbar;

  productListAll: any = [];
  productListSucursal: any = [];
  productListsearchBar: any = [];

  sucursalList: any = [];
  sucursal_id = '1';

  constructor(private storageservice: StorageService) { }

  ngOnInit() {

    this.storageservice.getProducts().then(productList => {
      this.productListAll = productList;
      this.productListSucursal = this.productListAll.filter(product => product.sucursal_id == '1');
      this.productListsearchBar = this.productListSucursal;
    });

    this.storageservice.getSucursales().then(sucursalList => {
      this.sucursalList = sucursalList;
    });

  }

  searchProducts(val: any) {
    const valor = val.target.value;
    if (valor && valor.trim() != '') {
      this.productListsearchBar = this.productListSucursal.filter((item) => {
        return (item.name.toLowerCase().indexOf(valor.toLowerCase()) > -1) ||
          (item.codigoProtevs.toLowerCase().indexOf(valor.toLowerCase()) > -1);
      });
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
