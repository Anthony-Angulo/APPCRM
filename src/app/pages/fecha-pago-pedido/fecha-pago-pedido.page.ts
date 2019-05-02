import { Component, OnInit } from '@angular/core';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { Storage } from '@ionic/storage';
import { SaveDataService } from 'src/app/services/save-data.service';

//Keys para obtener listas del storage
const PAGO_KEY = 'pago';
const RUTAS_KEY = 'rutas';
const DOCUMENTS_KEY = 'documents';
const CURRENCY_KEY = 'currency';
const HORAS_KEY = 'horas';
const USER_ID_KEY = 'USER_ID';
const USER_NAME_KEY = 'USER_NAME';
const CAMBIO_KEY = 'cambio';

@Component({
  selector: 'app-fecha-pago-pedido',
  templateUrl: './fecha-pago-pedido.page.html',
  styleUrls: ['./fecha-pago-pedido.page.scss'],
})
export class FechaPagoPedidoPage implements OnInit {

  //Formulario a Enviar para el registro del Pedido
  formData = {
    customer_no: '',      contact_id: 0,
    owned_by_id: 0,       order_date: new Date().toISOString(),
    bill_street: '',      bill_state: '', 
    bill_country: '',     bill_zip_code: '', 
    ship_street: '',      ship_state: '',
    ship_country: '',     ship_zip_code: '',
    currency_id: 0,       bill_city: '',
    ship_city: '',        bill_to: '',
    bill_tax_number: '',  ship_to: '',
    ship_tax_number: '',  fecha_de_recepcion: '',
    ruta_id: 0,           pago_id: 0,
    documento_id: 0,      id_hora_antes: '',
    id_hora_despues: '',   owned_by_name: '',
    sucursal_id: 0,       tienda_id: 0,
    tipo_cambio: 0,       total_order: 0
  };

  datos: any = [];
  pagoList: any = [];
  pago_id: number = 0;
  rutasList: any = [];
  ruta_id: number = 0;
  documentList: any = [];
  documento_id: number = 0;
  currencyList: any = [];
  currency_id: number = 0;
  horasList: any = [];
  antes_id: string = '1';
  despues_id: string = '11';
  fecha_recepcion: any;
  
  total: number = 0;
  impuestos: number = 0;
  subtotal: number = 0;
  tipo_de_cambio: number = 0;

  max_date: any;
  min_date: any;
  
  constructor(
    private naxExtras: NavExtrasServiceService,
    private storage: Storage,
    private savedataservice: SaveDataService) { }

  ngOnInit() {

    this.datos = this.naxExtras.getExtras();

    this.storage.get(PAGO_KEY).then(val => {
      this.pagoList = val;
    });

    this.storage.get(RUTAS_KEY).then(val => {
      this.rutasList = val;
    });

    this.storage.get(DOCUMENTS_KEY).then(val => {
      this.documentList = val;
    });

    this.storage.get(CURRENCY_KEY).then(val => {
      this.currencyList = val;
    });

    this.storage.get(HORAS_KEY).then(val => {
      this.horasList = val;
    });

    this.min_date = new Date()
    this.max_date = new Date(this.min_date.getFullYear() + 2, this.min_date.getMonth(), this.min_date.getDate())

    this.storage.get(USER_NAME_KEY).then(val => {
      this.formData.owned_by_name  = val;
    });

    this.storage.get(USER_ID_KEY).then(val => {
      this.formData.owned_by_id  = val;
    });

    this.storage.get(CAMBIO_KEY).then(val => {
      this.tipo_de_cambio = val;
    });

    this.formData.tienda_id = this.datos.contact.tienda;
    this.formData.customer_no = this.datos.contact.codigo_protevs;
    this.formData.contact_id = this.datos.contact.id;
    this.formData.bill_street = this.datos.contact.street;
    this.formData.bill_country = this.datos.contact.country;
    this.formData.bill_zip_code = this.datos.contact.zip_code;
    this.formData.ship_street = this.datos.contact.street;
    this.formData.ship_country = this.datos.contact.country;
    this.formData.ship_state = this.datos.contact.state;
    this.formData.bill_state = this.datos.contact.state;
    this.formData.ship_zip_code = this.datos.contact.zip_code;
    this.formData.bill_city = this.datos.contact.city;
    this.formData.ship_city = this.datos.contact.city;
    this.formData.bill_to = this.datos.contact.full_name;
    this.formData.bill_tax_number = this.datos.contact.colonia;
    this.formData.ship_to = this.datos.contact.full_name;
    this.formData.ship_tax_number = this.datos.contact.colonia;
    this.formData.sucursal_id = this.datos.sucursal;
  }

  calcularTotalSelect(event) {
    this.subtotal = 0;
    this.total = 0;
    this.impuestos = 0;
    if (this.currency_id == 62) {
      for (var i = 0; i < this.datos.products.length; i++) {
        if (this.datos.products[i].product_moneda == "MN") {
          this.subtotal += this.datos.products[i].subtotal;
          this.impuestos += this.datos.products[i].impuestos_total;
          this.total += this.datos.products[i].total;
        } else {
          this.subtotal += this.datos.products[i].subtotal * this.tipo_de_cambio;
          this.impuestos += this.datos.products[i].impuestos_total * this.tipo_de_cambio;
          this.total += this.datos.products[i].total * this.tipo_de_cambio;
        }
      }
    } else if(this.currency_id == 96) {
      for (var i = 0; i < this.datos.products.length; i++) {
        if (this.datos.products[i].product_moneda == "DL") {
          this.subtotal += this.datos.products[i].subtotal;
          this.impuestos += this.datos.products[i].impuestos_total;
          this.total += this.datos.products[i].total;
        } else {
          this.subtotal += this.datos.products[i].subtotal / this.tipo_de_cambio;
          this.impuestos += this.datos.products[i].impuestos_total / this.tipo_de_cambio;
          this.total += this.datos.products[i].total / this.tipo_de_cambio;
        }
      }
    }
  }

  public generarPedido() {
    this.formData.tipo_cambio = this.tipo_de_cambio
    this.formData.fecha_de_recepcion = this.fecha_recepcion;
    this.formData.currency_id = this.currency_id;
    this.formData.documento_id = this.documento_id;
    this.formData.pago_id = this.pago_id;
    this.formData.ruta_id = this.ruta_id;
    this.formData.id_hora_antes = this.antes_id;
    this.formData.id_hora_despues = this.despues_id;
    this.formData.total_order = this.total;
    this.savedataservice.generateOrder(this.formData, this.datos.products, this.datos.pedido);

  }

}





