import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  contactList: any = [];
  paginationList: any = [];
  list: any = [];

  incrementarRegistros: number = 5;
  inicioRegistro: number = 1;

  sinFiltrar: boolean = false;
  conFiltrar: boolean = false;

  user_id: string = 'USER_ID';
  url = 'http://192.168.0.41';
  storageContacts: string = 'contacts';

  constructor(private http: HttpClient, private storage: Storage) { }

  ngOnInit() {
    this.storage.get(this.storageContacts).then(val => {
      this.contactList = val;
    });
  }

  searchContacts(val: any) {
    let valor = val.target.value;
    if (valor && valor.trim() != '') {
      this.list = this.contactList.filter((item) => {
        return (item.nombre_reducido.toLowerCase().indexOf(valor.toLowerCase()) > -1);
      })
      this.sinFiltrar = false;
      this.conFiltrar = true;
    } else {
      this.list = '';
      this.sinFiltrar = true;
    }
  }
}
