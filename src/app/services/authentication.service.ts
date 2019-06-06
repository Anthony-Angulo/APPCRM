import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticationState = new BehaviorSubject(false);

  constructor(private storageservice: StorageService, private platform: Platform) {
    this.platform.ready().then(_ => {
      this.checkToken();
    })
  }

  public login(user_id: any, token: any, name: string): Promise<void> {
    this.storageservice.setUserID(user_id)
    this.storageservice.setUsername(name)

    return this.storageservice.setToken(token).then(res => {
      this.authenticationState.next(true);
    })
  }

  public logout(): Promise<void> {
    return this.storageservice.removeToken().then(_ => {
      this.authenticationState.next(false);
    })
  }

  isAuthenticated(): boolean {
    return this.authenticationState.value;
  }

  checkToken() {
    return this.storageservice.getToken().then(res => {
      if (res) {
        this.authenticationState.next(true);
      } else {
        this.authenticationState.next(false);
      }
    });
  }
}