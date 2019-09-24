import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { SaveDataService } from 'src/app/services/save-data.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fecha-pago-pedido',
  templateUrl: './fecha-pago-pedido.page.html',
  styleUrls: ['./fecha-pago-pedido.page.scss'],
})
export class FechaPagoPedidoPage implements OnInit {

  // Formulario a Enviar para el registro del Pedido
  orderData = {
    customer_no: '', contact_id: 0,
    owned_by_id: 0,
    order_date: new Date().toISOString(),
    bill_street: '', bill_state: '',
    bill_country: '', bill_zip_code: '',
    ship_street: '', ship_state: '',
    ship_country: '', ship_zip_code: '',
    currency_id: 0, bill_city: '',
    ship_city: '', bill_to: '',
    bill_tax_number: '', ship_to: '',
    ship_tax_number: '',
    fecha_de_recepcion: new Date((new Date()).setDate(new Date().getDate() + 1)).toISOString(),
    ruta_id: 0, pago_id: 0,
    documento_id: 0, id_hora_antes: '5',
    id_hora_despues: '1', owned_by_name: '',
    sucursal_id: 0, tienda_id: 0,
    tipo_cambio: 0, total_order: 0,
    observacion_recepcion: '', observacion_pago: ''
  };

  datos: any = [];
  pagoList: any = [];
  rutasList: any = [];
  documentList: any = [];
  horasList: any = [];

  impuestos = 0;
  subtotal = 0;
  total = 0;
  totalDolares = 0;
  subtotalDolares = 0;
  impuestosDolares = 0;


  disableButton = false;
  min_date = new Date();
  max_date = new Date(this.min_date.getFullYear() + 2, this.min_date.getMonth(), this.min_date.getDate());

  constructor (
    private naxExtras: NavExtrasServiceService,
    private storageservice: StorageService,
    private savedataservice: SaveDataService,
    private router: Router,
    private loadingController: LoadingController) { }

  ngOnInit() {

    this.datos = this.naxExtras.getExtras();

    Promise.all([
      this.storageservice.getPagos(),
      this.storageservice.getRutas(),
      this.storageservice.getDocuments(),
      this.storageservice.getHoras(),
      this.storageservice.getUsername(),
      this.storageservice.getUserID(),
      this.storageservice.getCambio()
    ]).then(([pagosList, rutasList, documentsList, horasList, username, id, tipo_cambio]) => {
      this.pagoList = pagosList;
      this.rutasList = rutasList;
      this.documentList = documentsList;
      this.horasList = horasList;
      this.orderData.owned_by_name = username;
      this.orderData.owned_by_id = id;
      this.orderData.tipo_cambio = tipo_cambio;
    }).catch(error => {
      console.error(error);
    });

    this.orderData.tienda_id = this.datos.contact.tienda;
    this.orderData.customer_no = this.datos.contact.codigo_protevs;
    this.orderData.contact_id = this.datos.contact.id;
    this.orderData.bill_street = this.datos.contact.street;
    this.orderData.bill_country = this.datos.contact.country;
    this.orderData.bill_zip_code = this.datos.contact.zip_code;
    this.orderData.ship_street = this.datos.contact.street;
    this.orderData.ship_country = this.datos.contact.country;
    this.orderData.ship_state = this.datos.contact.state;
    this.orderData.bill_state = this.datos.contact.state;
    this.orderData.ship_zip_code = this.datos.contact.zip_code;
    this.orderData.bill_city = this.datos.contact.city;
    this.orderData.ship_city = this.datos.contact.city;
    this.orderData.bill_to = this.datos.contact.full_name;
    this.orderData.bill_tax_number = this.datos.contact.colonia;
    this.orderData.ship_to = this.datos.contact.full_name;
    this.orderData.ship_tax_number = this.datos.contact.colonia;
    this.orderData.sucursal_id = this.datos.sucursal_id;
    this.calcularTotalSelect();
  }

  calcularTotalSelect() {

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

  async generarPedido() {

    const loading = await this.loadingController.create({
      message: 'Guardando Orden...',
    });
    await loading.present();


    let result;

    if (this.total != 0 && this.totalDolares == 0) {
      this.orderData.currency_id = 62;
      this.orderData.total_order = this.total;
      result = this.savedataservice.generateOrder(this.orderData, this.datos.products, this.datos.pedido);
    } else if (this.total == 0 && this.totalDolares != 0) {
      this.orderData.currency_id = 96;
      this.orderData.total_order = this.totalDolares;
      result = this.savedataservice.generateOrder(this.orderData, this.datos.products, this.datos.pedido);
    } else {

      let orderPesos = Object.assign({}, this.orderData);
      orderPesos.currency_id = 62;
      orderPesos.total_order = this.total;
      const productospesos = this.datos.products.filter(product => product.pago_tipo == 'MN');

      let orderDolares = Object.assign({}, this.orderData);
      orderDolares.currency_id = 96;
      orderDolares.total_order = this.totalDolares;
      const productosDolares = this.datos.products.filter(product => product.pago_tipo == 'DL');

      result = [];
      result[0] = await this.savedataservice.generateOrder(orderPesos, productospesos, this.datos.pedido);
      result[1] = await this.savedataservice.generateOrder(orderDolares, productosDolares, this.datos.pedido);
    }

    let message = '';
    if (Array.isArray(result)) {
      if (result.find(value => value == false)) {
        message = 'Pedido Guardado En Almacenamiento. Esperando Conexion.';
      } else {
        message = 'Pedido Guardado Con Exito.';
      }
    } else {
      message = await result.then(val => {
        if (val) {
          return 'Pedido Guardado Con Exito.';
        } else {
          return 'Pedido Guardado En Almacenamiento. Esperando Conexion.';
        }
      });
    }

    loading.dismiss();
    Swal.fire({

      title: message,
      type: 'success',
      confirmButtonText: 'Enterado.'

    }).then((result) => {
      if (result.value) {
        this.router.navigate(['dashboard']);
      }
    });

  }

}