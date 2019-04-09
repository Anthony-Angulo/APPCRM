import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class OfflineDataService {

  url = 'http://192.168.0.41';

  contactList: any = [];
  productList: any = [];
  statusList: any = [];
  sucursalList: any = [];
  pagoList: any = [];
  rutasList: any = [];
  documentList: any = [];
  currencyList: any = [];
  horasAntesList: any = [];
  horasDespuesList: any = [];

  storageProducts: string = 'products';
  storageContacts: string = 'contacts';
  storageStatus: string = 'status';
  storageSucursal: string = 'sucursal';
  storagePago: string = 'pago';
  storageRutas: string = 'rutas';
  storageDocuments: string = 'documents';
  storageCurrency: string = 'currency';
  storageHorasAntes: string = 'horasAntes';
  storageHorasDespues: string = 'horasDespues';

  constructor(private http: HttpClient, private storage: Storage, public loadingController: LoadingController) { }

  public getDataOffline() {

    this.presentLoading();

    this.storage.get('USER_ID').then((val) => {
      this.http.get(this.url + '/api/contact/' + val)
        .subscribe((data: any) => {
          this.contactList = JSON.parse(data);
          this.storage.set(this.storageContacts, this.contactList);
        })
    });

    this.http.get(this.url + '/api/products/' + 1)
      .subscribe((data: any) => {
        this.productList = JSON.parse(data);
        this.storage.set(this.storageProducts, this.productList);
      })

    this.http.get(this.url + '/api/status')
      .subscribe((data: any) => {
        this.statusList = JSON.parse(data);
        this.storage.set(this.storageStatus, this.statusList);
      });


    this.http.get(this.url + '/api/sucursal')
      .subscribe((data: any) => {
        this.sucursalList = JSON.parse(data);
        this.storage.set(this.storageSucursal, this.sucursalList);
      });

    this.http.get(this.url + '/api/pago')
      .subscribe((data: any) => {
        this.pagoList = JSON.parse(data);
        this.storage.set(this.storagePago, this.pagoList);
      });

    this.http.get(this.url + '/api/rutas').
      subscribe((data: any) => {
        this.rutasList = JSON.parse(data);
        this.storage.set(this.storageRutas, this.rutasList);
      });

    this.http.get(this.url + '/api/documento')
      .subscribe((data: any) => {
        this.documentList = JSON.parse(data);
        this.storage.set(this.storageDocuments, this.documentList);
      });

    this.http.get(this.url + '/api/currency')
      .subscribe((data: any) => {
        this.currencyList = JSON.parse(data);
        this.storage.set(this.storageCurrency, this.currencyList);
      });

    this.http.get(this.url + '/api/horaAntes')
      .subscribe((data: any) => {
        this.horasAntesList = JSON.parse(data);
        this.storage.set(this.storageHorasAntes, this.horasAntesList);
      });

    this.http.get(this.url + '/api/horaDespues')
      .subscribe((data: any) => {
        this.horasDespuesList = JSON.parse(data);
        this.storage.set(this.storageHorasDespues, this.horasDespuesList);
      });

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Obteniendo Datos..',
      duration: 5000
    });
    
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');

  }

}
