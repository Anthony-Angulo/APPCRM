import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, IonSearchbar } from '@ionic/angular';
import { ImagesService } from 'src/app/services/images.service';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { StorageService } from 'src/app/services/storage.service';
import { ModalController } from '@ionic/angular';
// import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'modal-page',
  templateUrl : './modal.component.html'
})
export class ModalPage {

  @Input() product: any;
  @Input() tipo_de_cambio: number;

  constructor(public modalCtrl: ModalController) {

  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  public increment(product) {
    product.quantity++;
    this.productChange(product);
  }

  public decrement(product) {
    if (product.quantity > 1) {
      product.quantity--;
      this.productChange(product);
    }
  }

  productQuantity(product) {
    if (product.quantity <= 0) {
      product.quantity = 1;
    }
  }

  quantityChange(product) {
    product.quantity_dos = product.quantity * product.conv;
    // if (!Number.isInteger(product.quantity_dos)) {
    //   product.quantity_dos = Math.round(product.quantity_dos)
    // }
    this.productChange(product);
  }

  quantityChange2(product) {
    product.quantity = product.quantity_dos / product.conv;
    this.productChange(product);
  }

  productChange(product) {

    if (product.moneda == product.pago_tipo) {
      product.subtotal = product.price * product.quantity;
      product.impuestos_total = product.subtotal * product.impuesto_cal;
      product.total = product.impuestos_total + product.subtotal;
    } else if (product.moneda == 'DL' && product.pago_tipo == 'MN') {
      product.subtotal = product.price * product.quantity * this.tipo_de_cambio;
      product.impuestos_total = product.subtotal * product.impuesto_cal;
      product.total = product.impuestos_total + product.subtotal;
    }

    // this.updateTotal();
  }


}

@Component({
  selector: 'app-generate-pedido',
  templateUrl: './generate-pedido.page.html',
  styleUrls: ['./generate-pedido.page.scss'],
})
export class GeneratePedidoPage implements OnInit, OnDestroy {
  @ViewChild('clientSearchBar') clientSearchBar: IonSearchbar;
  @ViewChild('productSearchBar') productSearchBar: IonSearchbar;

  contactList: any = [];
  contactListsearchBar: any = [];

  productListAll: any = [];
  productListSucursal: any = [];
  productListsearchBar: any = [];

  sucursalList: any = [];

  impuestosList: any = [];
  tesList: any = [];

  impuestos = 0;
  subtotal = 0;
  total = 0;
  totalDolares = 0;
  subtotalDolares = 0;
  impuestosDolares = 0;

  tipo_de_cambio = 0;

  datos: any;

  dolaresCard = false;

  constructor (
    public alertController: AlertController,
    private storageservice: StorageService,
    private router: Router,
    private imageservice: ImagesService,
    private navExtras: NavExtrasServiceService,
    private barcodeScanner: BarcodeScanner,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.datos = this.navExtras.getExtras();

    Promise.all([
      this.storageservice.getContacts(),
      this.storageservice.getImpuestos(),
      this.storageservice.getTes(),
      this.storageservice.getProducts(),
      this.storageservice.getSucursales(),
      this.storageservice.getCambio()
    ]).then(([contactList, impuestosList, tesList, productList, sucursalList, tipo_de_cambio]) => {

      this.contactList = contactList;
      this.impuestosList = impuestosList;
      this.tesList = tesList;
      this.productListAll = productList;
      this.productListSucursal = this.productListAll.filter(product => product.sucursal_id == '1');
      this.sucursalList = sucursalList;
      this.tipo_de_cambio = tipo_de_cambio;

    }).catch(error => {
      console.error(error);
    });

  }

  ngOnDestroy() {
    this.navExtras.setExtras(null);
  }

  public searchContacts(val: any) {
    let valor = val.target.value;
    if (valor && valor.trim() != '') {
      this.contactListsearchBar = this.contactList.filter((item) => {
        return (item.nombre_reducido.toLowerCase().indexOf(valor.toLowerCase()) > -1) ||
          (item.codigo_protevs.toLowerCase().indexOf(valor.toLowerCase()) > -1);
      });
    } else {
      this.contactListsearchBar = [];
    }
  }

  public scanQr() {
    this.barcodeScanner.scan().then(barcodeData => {
      const id = parseInt(barcodeData.text);
      if (id == null) {
        this.presentAlert('Formato QR invalido');
      } else {
        this.datos.contact = this.contactList.find(contact => contact.id == id);
        if (this.datos.contact == undefined) {
          this.presentAlert('Identificador no encontrado');
        }
      }
    }).catch(err => {
      this.presentAlert(err);
    });
  }

  public searchProducts(val: any) {
    let valor2 = val.target.value;
    if (valor2.length > 1 && valor2.trim() != '') {
      this.productListsearchBar = this.productListSucursal.filter((item) => {
        const in_list = this.datos.products.some(product => product.product_name == item.name);
        return ((item.name.toLowerCase().indexOf(valor2.toLowerCase()) > -1) ||
          (item.codigoProtevs.toLowerCase().indexOf(valor2.toLowerCase()) > -1)) && !in_list;
      });
    } else {
      this.productListsearchBar = [];
    }
  }

  public addContact(contact: any) {
    this.datos.contact = contact;
    this.contactListsearchBar = [];
    this.clientSearchBar.value = '';
  }

  async presentModal(product) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        'product': product,
        'tipo_de_cambio' : this.tipo_de_cambio
      }
    });
    modal.onDidDismiss().then(() => {
      this.updateTotal();
    });
    return await modal.present();
  }

  public addProduct(product: any) {
    let imp = 1.00;
    const test_lit = this.tesList.filter(tes => tes.tes == product.tes);
    for (let i = 0; i < test_lit.length; i++) {
      imp *= 1 + this.impuestosList.find(imp => imp.codigo == test_lit[i].cod_impuesto).importe / 100;
    }
    imp -= 1;

    let product_order = {
      codigoProtevs: product.codigoProtevs,
      product_name: product.name,
      price: product.price,
      product_stock: Number(product.stock),
      moneda: product.moneda_mayoreo,
      quantity: 1,
      unidad_medida: product.UM_mayoreo,
      quantity_dos: Number(product.b1_conv),
      unidad_medida_dos: product.unimed,
      subtotal: Number(product.price),
      impuesto_cal: imp,
      impuestos_total: 0,
      total: 0,
      pago_tipo: product.moneda_mayoreo,
      conv: Number(product.b1_conv),
    };

    console.log(product_order);

    product_order.impuestos_total = product_order.subtotal * product_order.impuesto_cal;
    product_order.total = product_order.impuestos_total + product_order.subtotal;

    this.datos.products.unshift(product_order);

    this.productListsearchBar = [];
    this.productSearchBar.value = '';
    this.updateTotal();

  }

  eliminarProducto(index) {
    this.datos.products.splice(index, 1);
    this.updateTotal();
  }

  updateTotal() {
    this.total = this.impuestos = this.subtotal = 0;
    this.totalDolares = this.impuestosDolares = this.subtotalDolares = 0;

    for (let i = 0; i < this.datos.products.length; i++) {
      if (this.datos.products[i].pago_tipo == 'MN') {

        this.subtotal += this.datos.products[i].subtotal;
        this.impuestos += this.datos.products[i].impuestos_total;
        this.total += this.datos.products[i].total;

      } else {

        this.subtotalDolares += this.datos.products[i].subtotal;
        this.impuestosDolares += this.datos.products[i].impuestos_total;
        this.totalDolares += this.datos.products[i].total;

      }
    }

  }

  // quantityChange(product) {
  //   product.quantity = Math.round(product.quantity);
  //   product.quantity_dos = product.quantity * product.conv;
  //   this.productChange(product);
  // }

  cambioSucursal(event) {
    this.datos.products = this.productListsearchBar = [];
    this.productSearchBar.value = '';
    this.productListSucursal = this.productListAll.filter(product => product.sucursal_id == event.detail.value);
    this.updateTotal();
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

  public getPath(name) {
    return this.imageservice.getPath(name);
  }

  showImage(name) {
    this.imageservice.showImage(name);
  }

}
