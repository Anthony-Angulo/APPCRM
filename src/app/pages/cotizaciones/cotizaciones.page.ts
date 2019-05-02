import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavExtrasServiceService } from 'src/app/services/nav-extras-service.service';
import { Router } from '@angular/router';

const COTIZACIONES_KEY = 'cotizaciones';
const CONTACTS_KEY = 'contacts';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.page.html',
  styleUrls: ['./cotizaciones.page.scss'],
})
export class CotizacionesPage implements OnInit {

  cotizaciones: any=[];
  contacts: any =[];
  
  constructor(
    private storage: Storage,
    private router: Router,
    private navExtras: NavExtrasServiceService,) { }

  ngOnInit() {
    this.storage.get(COTIZACIONES_KEY).then((val) => {
      this.cotizaciones = val;
    });
    this.storage.get(CONTACTS_KEY).then((val) => {
      this.contacts = val;
    });
  }

  private contact(id){
    var contact = this.contacts.find(contact=> contact.id == id)
    if(contact){
      return contact.nombre_reducido
    }
  }

  goToDetail(cotizacion){
    this.navExtras.setExtras({order:cotizacion, isorder:false});
    this.router.navigate(['detail']);
  }

}
