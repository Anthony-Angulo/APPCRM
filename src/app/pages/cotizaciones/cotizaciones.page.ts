import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { StorageService } from 'src/app/services/storage.service';
import { Contact } from 'src/app/models/contact';

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
    Promise.all([
      this.storageservice.getCotizaciones(),
      this.storageservice.getContacts()
    ]).then(([cotizacionesList, contactList]) => {
      this.cotizaciones = cotizacionesList;
      this.contacts = contactList;

      this.cotizaciones.map(cotizacion => {
        cotizacion.nombre_reducido = this.contacts.find(contact => contact.id == cotizacion.order.contact_id).nombre_reducido;
      });
    });
  }

  goToDetail(cotizacion) {
    this.navExtras.setExtras({ order: cotizacion, isorder: false });
    this.router.navigate(['detail']);
  }

}
