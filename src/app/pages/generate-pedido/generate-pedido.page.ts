import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { NavController, IonSearchbar } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import Swal from 'sweetalert2'

const PRODUCTS_KEY = 'products';
const CONTACTS_KEY = 'contacts';
const IMPUESTOS_KEY = 'impuestos';
const TES_KEY = 'tes';
const SUCURSAL_KEY = 'sucursal';
const CAMBIO_KEY = 'cambio';

@Component({
  selector: 'app-generate-pedido',
  templateUrl: './generate-pedido.page.html',
  styleUrls: ['./generate-pedido.page.scss'],
})

export class GeneratePedidoPage implements OnInit {
  @ViewChild('clientSearchBar') searchbar: IonSearchbar;

  contactList: any = [];
  contactListsearchBar: any = [];
  contactOrder: any;

  productOrder: any = [];
  productListAll: any = [];
  productListSucursal: any = []
  productListsearchBar: any = [];

  sucursalList: any = [];
  sucursal_id: string = '1';

  impuestosList: any = [];
  tesList: any = [];
  
  impuestos: number =0;
  subtotal: number = 0;
  total: number = 0;
  totalDolares = 0;
  subtotalDolares:number = 0;
  impuestosDolares:number = 0;
  tipo_de_cambio: number = 0;

  datos: any;

  dolaresCard: boolean = false;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router,
    private navExtras: NavExtrasServiceService,
    private barcodeScanner: BarcodeScanner
  ) { }
  
  ngOnInit() {
    this.datos = this.navExtras.getExtras();
    
    this.storage.get(CONTACTS_KEY).then(val => {
      this.contactList = val;
    });

    this.storage.get(IMPUESTOS_KEY).then(val => {
      this.impuestosList = val;
    });

    this.storage.get(TES_KEY).then(val => {
      this.tesList = val;
    });

    this.storage.get(PRODUCTS_KEY).then(val => {
      this.productListAll = val;
      this.productListSucursal = this.productListAll.filter(product => product.sucursal_id == '1');
    });

    this.storage.get(SUCURSAL_KEY).then(val => {
      this.sucursalList = val;
    });

    this.storage.get(CAMBIO_KEY).then(val => {
      this.tipo_de_cambio = val;
    });
  }

  ionViewDidEnter(){
    this.datos = this.navExtras.getExtras()
    if(this.datos !== {'pedido':true}|| this.datos !== {'pedido':false}){
      if(this.datos.contact != this.contactOrder){
        this.contactOrder=this.datos.contact;
      }
    }
  }

  ngOnDestroy(){
    this.navExtras.setExtras(null)
  }

  public searchContacts(val: any) {
    let valor = val.target.value;
    if (valor && valor.trim() != '') {
      this.contactListsearchBar = this.contactList.filter((item) => {
        return (item.nombre_reducido.toLowerCase().indexOf(valor.toLowerCase()) > -1);
      })
    } else {
      this.contactListsearchBar = [];
    }
  }

  public scanQr(){
    this.barcodeScanner.scan().then(barcodeData => {
      var id = parseInt(barcodeData.text)
      if(id == null){
        Swal.fire({
          title: "Codigo QRIncorrecto",
          type: "warning",
          confirmButtonText: "Aceptar"
        });
      }
      this.contactOrder = this.contactList.find(contact => contact.id == id);
    }).catch(err => {
      Swal.fire({
        title: err,
        type: "warning",
        confirmButtonText: "Aceptar"
      });
    });
  }

  public searchProducts(val: any) {
    let valor2 = val.target.value;
    if (valor2.length > 1 && valor2.trim() != '') {
      this.productListsearchBar = this.productListSucursal.filter((item) => {
        var in_list = this.productOrder.some(product => product.product_name == item.name)
        return (item.name.toLowerCase().indexOf(valor2.toLowerCase()) > -1) && !in_list;
      })
    } else {
      this.productListsearchBar = [];
    }
  }

  public addContact(id: any) {
    this.contactOrder = this.contactList.find(contact => contact.id == id);
    this.contactListsearchBar = [];
  }

  public addProduct(id: any) {
    var imp = 1.00;
    var product = this.productListSucursal.find(product => product.id == id);
    var test_lit = this.tesList.filter(tes=>tes.tes==product.tes)
    for(var i=0; i < test_lit.length; i++){
      imp *= 1 + this.impuestosList.find(imp=> imp.codigo == test_lit[i].cod_impuesto).importe/100
    };
    imp-=1
    var product_order = {
      product_codigo: product.codigoProtevs,
      product_name: product.name,
      product_price: product.price,
      product_stock: product.stock,
      product_UM: product.UM_mayoreo,
      product_moneda: product.moneda_mayoreo,
      quantity: 1,
      subtotal: Number(product.price),
      // impuestos_aplicados: '',
      impuesto_cal: imp,
      impuestos_total: 0,
      total: 0
    }
    this.calcularImpuestos(product_order)
    this.productOrder.push(product_order)
    this.productListsearchBar = [];
    this.updateTotal();
    this.searchbar.value = '';
  }

  eliminarProducto(product) {
    this.productOrder.splice(this.productOrder.indexOf(product), 1);
    this.updateTotal();
  }

  updateTotal(){
    this.total=0;
    this.subtotal=0;
    this.impuestos=0;

    this.totalDolares = 0;
    this.subtotalDolares = 0;
    this.impuestosDolares = 0;


    for(var i=0;i<this.productOrder.length;i++){
      if (this.productOrder[i].product_moneda == "MN") {
        this.subtotal += this.productOrder[i].subtotal;
        this.impuestos += this.productOrder[i].impuestos_total;
        this.total += this.productOrder[i].total;
        this.subtotalDolares += this.productOrder[i].subtotal / this.tipo_de_cambio;
        this.impuestosDolares += this.productOrder[i].impuestos_total / this.tipo_de_cambio;
        this.totalDolares += this.productOrder[i].total / this.tipo_de_cambio;

      } else {
        this.subtotalDolares += this.productOrder[i].subtotal;
        this.impuestosDolares += this.productOrder[i].impuestos_total;
        this.totalDolares += this.productOrder[i].total;
        this.subtotal += this.productOrder[i].subtotal * this.tipo_de_cambio;
        this.impuestos += this.productOrder[i].impuestos_total * this.tipo_de_cambio;
        this.total += this.productOrder[i].total * this.tipo_de_cambio;
      }
    }

  }

  calcularImpuestos(product){
    product.impuestos_total = product.subtotal * product.impuesto_cal;
    product.total = product.impuestos_total + product.subtotal
  }
  
  private increment(product) {
    if(product.quantity < product.product_stock){
      product.quantity++;
      product.subtotal = product.product_price * product.quantity;
      this.calcularImpuestos(product)
      this.updateTotal()
    }
  }

  private decrement(product) {
    if (product.quantity > 1) {
      product.quantity--;
      product.subtotal = product.product_price * product.quantity;
      this.calcularImpuestos(product)
      this.updateTotal()
    }
  }

  cambioSucursal(event) {
    this.subtotal = 0;
    this.total = 0;
    this.productOrder = []
    this.productListSucursal = this.productListAll.filter(product => product.sucursal_id == event.detail.value);
    this.searchbar.value = '';
  }

  entregaPedido() {
    let pedido = this.navExtras.getExtras().pedido
    const myData = {
      contact: this.contactOrder,
      products: this.productOrder,
      // status: this.status_id,
      sucursal: this.sucursal_id,
      // date_creacion: this.fecha_creacion,
      // date_due: this.fecha_due,
      pedido: pedido,
    };
    this.navExtras.setExtras(myData);
    this.router.navigate(['entrega-pedido']);
  }

}
