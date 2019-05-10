import { Component, OnInit } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ImagesService } from 'src/app/services/images.service';

@Component({
  selector: 'app-generate-pedido',
  templateUrl: './generate-pedido.page.html',
  styleUrls: ['./generate-pedido.page.scss'],
})

export class GeneratePedidoPage implements OnInit {
  @ViewChild('clientSearchBar') clientSearchBar: IonSearchbar;
  @ViewChild('productSearchBar') productSearchBar: IonSearchbar;

  contactList: any = [];
  contactListsearchBar: any = [];

  productListAll: any = [];
  productListSucursal: any = []
  productListsearchBar: any = [];

  sucursalList: any = [];

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
    public alertController: AlertController,
    private storageservice: StorageService,
    private router: Router,
    private imageservice: ImagesService,
    private navExtras: NavExtrasServiceService,
    private barcodeScanner: BarcodeScanner
  ) { }
  
  ngOnInit() {
    this.datos = this.navExtras.getExtras();
    
    this.storageservice.getContacts().then(contactList => {
      this.contactList = contactList;
    });

    this.storageservice.getImpuestos().then(impuestosList => {
      this.impuestosList = impuestosList;
    });

    this.storageservice.getTes().then(tesList => {
      this.tesList = tesList;
    });

    this.storageservice.getProducts().then(productList => {
      this.productListAll = productList;
      this.productListSucursal = this.productListAll.filter(product => product.sucursal_id == '1');
    });

    this.storageservice.getSucursales().then(sucursalList => {
      this.sucursalList = sucursalList;
    });

    this.storageservice.getCambio().then(tipo_de_cambio => {
      this.tipo_de_cambio = tipo_de_cambio;
    });
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
        this.presentAlert('Formato QR invalido')
      } else {
        this.datos.contact = this.contactList.find(contact => contact.id == id);
        if(this.datos.contact == undefined){
          this.presentAlert('Identificador no encontrado')
        }
      }
    }).catch(err => {
      this.presentAlert(err)
    });
  }

  public searchProducts(val: any) {
    let valor2 = val.target.value;
    if (valor2.length > 1 && valor2.trim() != '') {
      this.productListsearchBar = this.productListSucursal.filter((item) => {
        let in_list = this.datos.products.some(product => product.product_name == item.name)
        return (item.name.toLowerCase().indexOf(valor2.toLowerCase()) > -1) && !in_list;
      })
    } else {
      this.productListsearchBar = [];
    }
  }

  public addContact(contact: any) {
    this.datos.contact = contact;
    this.contactListsearchBar = [];
    this.clientSearchBar.value = '';
  }

  public addProduct(product: any) {
    let imp = 1.00;
    var test_lit = this.tesList.filter(tes=> tes.tes == product.tes);
    for(var i=0; i < test_lit.length; i++){
      imp *= 1 + this.impuestosList.find(imp=> imp.codigo == test_lit[i].cod_impuesto).importe / 100
    };
    imp -= 1

    var product_order = {
      product_codigo: product.codigoProtevs,
      product_name: product.name,
      product_price: product.price,
      product_stock: product.stock,
      product_UM: product.UM_mayoreo,
      product_moneda: product.moneda_mayoreo,
      quantity: 1,
      subtotal: Number(product.price),
      impuesto_cal: imp,
      impuestos_total: 0,
      total: 0
    }

    this.calcularImpuestos(product_order)
    this.datos.products.push(product_order)
    this.productListsearchBar = [];
    this.productSearchBar.value = '';
    this.updateTotal();
    
  }

  eliminarProducto(product) {
    this.datos.products.splice(this.datos.products.indexOf(product), 1);
    this.updateTotal();
  }

  updateTotal(){
    this.total = this.impuestos = this.subtotal = 0;
    this.totalDolares = this.impuestosDolares = this.subtotalDolares = 0;

    for(var i=0; i < this.datos.products.length; i++){
      if (this.datos.products[i].product_moneda == "MN") {
        this.subtotal += this.datos.products[i].subtotal;
        this.impuestos += this.datos.products[i].impuestos_total;
        this.total += this.datos.products[i].total;
        this.subtotalDolares += this.datos.products[i].subtotal / this.tipo_de_cambio;
        this.impuestosDolares += this.datos.products[i].impuestos_total / this.tipo_de_cambio;
        this.totalDolares += this.datos.products[i].total / this.tipo_de_cambio;

      } else {
        this.subtotalDolares += this.datos.products[i].subtotal;
        this.impuestosDolares += this.datos.products[i].impuestos_total;
        this.totalDolares += this.datos.products[i].total;
        this.subtotal += this.datos.products[i].subtotal * this.tipo_de_cambio;
        this.impuestos += this.datos.products[i].impuestos_total * this.tipo_de_cambio;
        this.total += this.datos.products[i].total * this.tipo_de_cambio;
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
    this.datos.products = this.productListsearchBar = [];
    this.productSearchBar.value = '';
    this.productListSucursal = this.productListAll.filter(product => product.sucursal_id == event.detail.value);
    this.updateTotal()
  }

  entregaPedido() {
    this.navExtras.setExtras(this.datos);
    this.router.navigate(['entrega-pedido']);
  }

  async presentAlert(info) {
    const alert = await this.alertController.create({
      header: 'QR',
      message: info,
      buttons: ['OK']
    });

    await alert.present();
  }

  public getPath(name){
    return this.imageservice.getPath(name)
  }

  showImage(name){
    this.imageservice.showImage(name)
  }

}
