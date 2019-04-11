import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-fecha-pago-pedido',
  templateUrl: './fecha-pago-pedido.page.html',
  styleUrls: ['./fecha-pago-pedido.page.scss'],
})
export class FechaPagoPedidoPage implements OnInit {

  //Formulario a Enviar para el registro del Pedido
  formData = {
    order_number: 0, customer_number: '', contact_id: 0, due_date: '', order_date: '', owned_by_id: 0, order_status_id: 0, bill_street: '', bill_country: '',
    bill_zip_code: '', ship_street: '', ship_state: '', bill_state: '', ship_country: '', ship_zip_code: '', currency_id: 0, bill_city: '',
    ship_city: '', bill_to: '', bill_tax_number: '', ship_to: '', ship_tax_number: '', fecha_de_recepcion: '',
    ruta_id: 0, pago_id: 0, documento_id: 0, id_hora_antes: 0, id_hora_despues: 0, sucursal_id: 0, tienda_id: 0, owned_by_name: ''
  };

  //Formulario a enviar para el registro de los productos de la orden
  formDataOrderRows = { order_id: '', product_name: '', price: '', quantity: '', codigoProtevs: '', unidad_medida: '', moneda: '' };

  //Formulario a enviar para el registro de la posicion del vendedor al momento de registrar la orden
  formDataTrack = { user_id: '', movimiento_id: 0, latitud: 0, longitud: 0, order_number: 0 };

  //Keys para obtener listas del storage
  storagePago: string = 'pago';
  storageRutas: string = 'rutas';
  storageDocuments: string = 'documents';
  storageCurrency: string = 'currency';
  storageHorasAntes: string = 'horasAntes';
  storageHorasDespues: string = 'horasDespues';

  //Keys para obtener formularios que no pudieron darse de alta
  storageFormData = 'formData';
  storageFormdataOrderRows = 'formDataOrderRows';
  storageDataTrack = 'formDataTrack';

  idPedido: any;
  orderRow: any;
  datos: any = [];
  products: any = [];
  pagoList: any = [];
  pago: any = [];
  rutasList: any = [];
  rutas: any = [];
  documentList: any = [];
  document: any = [];
  currencyList: any = [];
  currency: any = [];
  horasAntesList: any = [];
  hora_antes: any = [];
  horasDespuesList: any = [];
  hora_despues: any = [];
  fecha_recepcion: any;
  antes_id: number = 0;
  despues_id: number = 0;
  ruta_id: number = 0;
  pago_id: number = 0;
  documento_id: number = 0;
  currency_id: number = 0;
  total: number = 0;
  subtotal: number;
  order_n: number = 0;
  orderAux: any = [];

  url = 'http://192.168.0.41';

  constructor(private http: HttpClient,
    private naxExtras: NavExtrasServiceService,
    private geolocation: Geolocation,
    private storage: Storage,
    private router: Router) { }

  ngOnInit() {

    this.datos = this.naxExtras.getExtras();

    this.storage.get('USER_ID').then((val: any) => {
      this.formData.owned_by_name = val;
      this.formDataTrack.user_id = val.replace('"', '');
    });

    this.storage.get(this.storagePago).then(val => {
      this.pagoList = val;
    });

    this.storage.get(this.storageRutas).then(val => {
      this.rutasList = val;
    });

    this.storage.get(this.storageDocuments).then(val => {
      this.documentList = val;
    });

    this.storage.get(this.storageCurrency).then(val => {
      this.currencyList = val;
    });

    this.storage.get(this.storageHorasAntes).then(val => {
      this.horasAntesList = val;
      var id_filtered = this.horasAntesList.find(hora => hora.id == '11');
      this.antes_id = id_filtered.id
    });

    this.storage.get(this.storageHorasDespues).then(val => {
      this.horasDespuesList = val;
      var id_filtered = this.horasDespuesList.find(hora => hora.id == '1');
      this.despues_id = id_filtered.id
    });

    this.formData.owned_by_id = this.datos.contact.owned_by_id;
    this.formData.tienda_id = this.datos.contact.tienda;
    this.formData.customer_number = this.datos.contact.codigo_protevs;
    this.formData.contact_id = this.datos.contact.id;
    this.formData.bill_street = this.datos.contact.street;
    this.formData.bill_country = this.datos.contact.country;
    this.formData.bill_zip_code = this.datos.contact.zip_code;
    this.formData.ship_street = this.datos.contact.street;
    this.formData.ship_country = this.datos.contact.coutrtry;
    this.formData.ship_state = this.datos.contact.state;
    this.formData.bill_state = this.datos.contact.state;
    this.formData.ship_zip_code = this.datos.contact.zip_code;
    this.formData.bill_city = this.datos.contact.city;
    this.formData.ship_city = this.datos.contact.city;
    this.formData.bill_to = this.datos.contact.full_name;
    this.formData.bill_tax_number = this.datos.contact.colonia;
    this.formData.ship_to = this.datos.contact.full_name;
    this.formData.ship_tax_number = this.datos.contact.colonia;

    this.http.get(this.url + '/api/orderNumber')
      .subscribe((data: any) => {
        this.orderAux = JSON.parse(data);
        this.order_n = parseInt(this.orderAux[0].order_number, 10);
        this.formData.order_number = this.order_n + 1;
      });
  }

  calcularTotalSelect(event) {
    
    this.calcularTotal(this.datos);
  }

  calcularTotal(data: any) {

    this.subtotal = 0;
    this.total = 0;

    if (this.currency_id == 62) {
      for (var i = 0; i < data.products.length; i++) {
        if (data.products[i].product_moneda == "MN") {
          this.total += data.products[i].subtotal;
        } else {
          this.total += (data.products[i].subtotal * 18.50);
        }
      }
    } else if(this.currency_id == 96) {
      for (var i = 0; i < data.products.length; i++) {
        if (data.products[i].product_moneda == "DL") {
          this.total += data.products[i].subtotal;
        } else {
          this.total += (data.products[i].subtotal / 18.50);
        }
      }
    }
    this.subtotal = this.total;
  }

  public generarPedido() {

    this.formData.fecha_de_recepcion = this.fecha_recepcion;
    this.formData.currency_id = this.currency_id;
    this.formData.documento_id = this.documento_id;
    this.formData.pago_id = this.pago_id;
    this.formData.ruta_id = this.ruta_id;
    this.formData.sucursal_id = this.datos.sucursal;
    this.formData.order_status_id = this.datos.status;
    this.formData.id_hora_antes = this.antes_id;
    this.formData.id_hora_despues = this.despues_id;

    this.http.post(this.url + '/api/generarPedido', this.formData)
      .subscribe((data: any) => {

        this.idPedido = JSON.parse(data);
    
        this.guardarPosicionPedido();

        this.guardarOrderRows(this.idPedido.token);

      }, (err: any) => {

        this.storage.set(this.storageFormData, this.formData);

        this.storage.set(this.storageFormdataOrderRows, this.formDataOrderRows);

        this.storage.set(this.storageDataTrack, this.formDataTrack);

        Swal.fire({

          title: "Pedido Guardado En Almacenamiento. Esperando Conexion.",
          type: "success",
          confirmButtonText: "Enterado."

        }).then((result) => {
          if (result.value) {
            this.router.navigate(['dashboard']);
          }
        });

      });
  }

  public guardarOrderRows(order_id) {
    this.formDataOrderRows.order_id = order_id;
    for (var i = 0; i < this.datos.products.length; i++) {

      this.formDataOrderRows.product_name = this.datos.products[i].product_name;
      this.formDataOrderRows.price = this.datos.products[i].product_price;
      this.formDataOrderRows.quantity = this.datos.products[i].quantity;
      this.formDataOrderRows.codigoProtevs = this.datos.products[i].product_codigo;
      this.formDataOrderRows.unidad_medida = this.datos.products[i].product_UM;
      this.formDataOrderRows.moneda = this.datos.products[i].product_moneda;

      this.http.post(this.url + '/api/guardarOrderRows', this.formDataOrderRows);
    }
  }

  public guardarPosicionPedido() {

    this.geolocation.getCurrentPosition({ timeout: 600000, enableHighAccuracy: true }).then(resp => {

      this.formDataTrack.movimiento_id = 3;

      this.formDataTrack.latitud = resp.coords.latitude;

      this.formDataTrack.longitud = resp.coords.longitude;

      this.formDataTrack.order_number = this.formData.order_number;

      this.http.post(this.url + '/api/usertrck', this.formDataTrack).subscribe((resp: any) => {
        Swal.fire({

          title: "Pedido Guardado Con Exito.",
          type: "success",
          confirmButtonText: "Enterado."

        }).then((result) => {
          if (result.value) {
            this.router.navigate(['dashboard']);
          }
        });
      }, err => {

      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
}





