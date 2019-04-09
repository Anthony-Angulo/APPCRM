import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavExtrasServiceService {
  extras: any;

  constructor() { }

  public setExtras(data: any) {
    this.extras = data;
  }

  public getExtras() {
    return this.extras;
  }
}
