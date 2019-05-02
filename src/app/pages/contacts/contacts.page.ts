import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SaveDataService } from 'src/app/services/save-data.service';

const CONTACTS_KEY = 'contacts';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  contactList: any = [];
  list: any = [];

  constructor(
    private storage: Storage,
    private savedataservice: SaveDataService) { }

  ngOnInit() {
    var a = this.storage.get(CONTACTS_KEY).then(val => {
      this.contactList = val;
      this.list = val;
    });
  }

  ngOnDestroy() {
    this.storage.set(CONTACTS_KEY, this.contactList);
  }

  searchContacts(val: any) {
    let valor = val.target.value;
    if (valor && valor.trim() != '') {
      this.list = this.contactList.filter((item) => {
        return (item.nombre_reducido.toLowerCase().indexOf(valor.toLowerCase()) > -1);
      })
    } else {
      this.list = this.contactList;
    }
  }

  public updateGeolocation(id: number){
    try{
      this.savedataservice.updateGeolocation(id).then(formData => {
        var contact_index  = this.contactList.findIndex(contact => contact.id == id)
        this.contactList[contact_index].latitud = formData.latitude;
        this.contactList[contact_index].longitud = formData.longitude;
      })
    }
    catch(e){

    }
  }
}
