import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { NavController, IonSearchbar } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-generate-pedido',
  templateUrl: './generate-pedido.page.html',
  styleUrls: ['./generate-pedido.page.scss'],
})

export class GeneratePedidoPage implements OnInit {
  @ViewChild('clientSearchBar') searchbar: IonSearchbar;
  user_id: string = 'USER_ID';
  storageProducts: string = 'products';
  storageContacts: string = 'contacts';
  storageStatus: string = 'status';
  storageSucursal: string = 'sucursal';
  contactList: any = [];
  contactOrder: any = [];
  productOrder: any = [];
  productList: any = [];
  statusList: any = [];
  sucursalList: any = [];
  listProducts: any = [];
  listAux: any;
  list: any = [];
  sucursal: any = [];
  status: any = [];
  fecha_creacion: String = new Date().toISOString();
  fecha_due: Date = new Date();
  status_id: number = 0;
  sucursal_id: number = 0;
  subtotal: number = 0;
  total: number = 0;
  totalSummary: number = 0;
  url = 'http://192.168.0.41';

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private nav: NavController,
    private router: Router,
    private navExtras: NavExtrasServiceService,
  ) { }

  ngOnInit() {

    this.storage.get(this.storageContacts).then(val => {
      this.contactList = val;
    });

    this.storage.get(this.storageProducts).then(val => {
      this.productList = val;
    });

    this.storage.get(this.storageStatus).then(val => {
      var index: any;
      this.statusList = val;

      for (index in this.statusList) {
        if (this.statusList[index].id == '1') {
          this.status_id = this.statusList[index].id;
        }
      }
    });

    this.storage.get(this.storageSucursal).then(val => {
      var index: any;
      this.sucursalList = val;

      for (index in this.sucursalList) {
        if (this.sucursalList[index].id == '1') {
          this.sucursal_id = this.sucursalList[index].id;
        }
      }
    });

  }

  public searchContacts(val: any) {
    let valor = val.target.value;
    if (valor && valor.trim() != '') {
      this.list = this.contactList.filter((item) => {
        return (item.nombre_reducido.toLowerCase().indexOf(valor.toLowerCase()) > -1);
      })
    } else {
      this.list = '';
    }
  }

  public searchProducts(val: any) {
    let valor2 = val.target.value;
    if (valor2.length > 3 && valor2.trim() != '') {
      this.listProducts = this.productList.filter((item) => {
        return (item.name.toLowerCase().indexOf(valor2.toLowerCase()) > -1);
      })
    } else {
      this.listProducts = '';
    }
  }

  public addContact(id: any) {
    var index: any;

    for (index in this.contactList) {
      if (this.contactList[index].id == id) {
        this.contactOrder[0] = this.contactList[index];
      }
    }
    this.list = '';
  }

  public addProduct(id: any) {
    var index: any;

    for (index in this.productList) {
      if (this.productList[index].id == id) {
        this.productOrder.push({
          product_codigo: this.productList[index].codigoProtevs,
          product_name: this.productList[index].name,
          product_price: this.productList[index].price,
          product_stock: this.productList[index].stock,
          product_UM: this.productList[index].UM_mayoreo,
          product_moneda: this.productList[index].moneda_mayoreo,
          quantity: 1,
          subtotal: 0,
        });
        break;
      }
      console.log(this.productOrder);
    }
    this.listProducts = '';
  }

  eliminarProducto(product) {
    this.productOrder.splice(this.productOrder.indexOf(product), 1);
  }

  private increment(product) {
    product.quantity++;
    product.subtotal = product.product_price * product.quantity;
  }

  private decrement(product) {
    if (product.quantity > 0) {
      product.quantity--;
      product.subtotal = product.product_price * product.quantity;
    }
  }

  entregaPedido() {
    const myData = {
      contact: this.contactOrder,
      products: this.productOrder,
      status: this.status_id,
      sucursal: this.sucursal_id,
      date_creacion: this.fecha_creacion,
      date_due: this.fecha_due,
    };

    this.navExtras.setExtras(myData);
    if(this.contactOrder.length > 0 && this.productOrder.length > 0){
      this.router.navigate(['entrega-pedido']);
    }else{
      Swal.fire({
        title: "Seleccione un Contacto y/o Productos",
        type: "warning",
        confirmButtonText: "Aceptar"
      });
    }
  }

}
