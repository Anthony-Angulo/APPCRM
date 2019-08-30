import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { StorageService } from 'src/app/services/storage.service';
import { Contact } from 'src/app/models/contact'

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.page.html',
  styleUrls: ['./cotizaciones.page.scss'],
})
export class CotizacionesPage implements OnInit {

  cotizaciones: any = [];
  contacts: Contact[] = [];

  constructor(
    private storageservice: StorageService,
    private router: Router,
    private navExtras: NavExtrasServiceService, ) { }

  ngOnInit() {
    this.storageservice.getCotizaciones().then(cotizacionesList => {
      this.cotizaciones = cotizacionesList;
    })
    this.storageservice.getContacts().then(contactList => {
      this.contacts = contactList;
    })
  }

  private contact(id) {
    var contact = this.contacts.find(contact => contact.id == id)
    if (contact) {
      return contact.nombre_reducido
    }
  }

  goToDetail(cotizacion) {
    this.navExtras.setExtras({ order: cotizacion, isorder: false });
    this.router.navigate(['detail']);
  }

}
