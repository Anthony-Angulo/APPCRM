import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment as ENV } from 'src/environments/environment';

import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticationState = new BehaviorSubject(false);

  constructor(
    private storageservice: StorageService,
    private platform: Platform,
    private http: HttpClient,
    private storage: Storage,
    public alertController: AlertController,
    public loadingController: LoadingController) {
    this.platform.ready().then(_ => {
      this.checkToken();
    })
  }

  async login(formData: any) {

    const loading = await this.loadingController.create({
      message: 'Entrando...',
    });
    await loading.present();

    this.http.post(ENV.BASE_URL + '/login', formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      ).subscribe((data: any) => {
        if (data.status) {

          this.storageservice.setUserID(data.id)
          this.storageservice.setUsername(data.name)
          this.storage.set('last_user', formData.email)

          this.storageservice.setToken(data.token).then(res => {
            this.authenticationState.next(true);
          })

        } else {
          this.presentAlert('Credenciales Invalidas.')

        }
      }, (err: any) => {
        this.presentAlert('No Conecion a Internet.')
      });

  }

  async presentAlert(info) {
    const alert = await this.alertController.create({
      header: 'Login',
      message: info,
      buttons: ['OK']
    });

    await alert.present();
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