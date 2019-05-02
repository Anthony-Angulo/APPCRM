import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const TOKEN_KEY = 'TOKEN_KEY';
const USER_ID_KEY = 'USER_ID';
const USER_NAME_KEY = 'USER_NAME';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticationState = new BehaviorSubject(false);

  constructor(
    private storage: Storage,
    private platform: Platform
  ) {
    this.platform.ready().then(_ => {
      this.checkToken();
    })
  }

  public login(user_id:any, token:any, name: string): Promise<void> {
    this.storage.set(USER_ID_KEY, user_id);
    this.storage.set(USER_NAME_KEY, name);
    return this.storage.set(TOKEN_KEY, token).then(res => {
      this.authenticationState.next(true);
    })
  }

  public logout(): Promise<void>  {
    return this.storage.remove(TOKEN_KEY).then(_ => {
      this.authenticationState.next(false);
    })
  }

  isAuthenticated(): boolean{
    return this.authenticationState.value;
  }

  checkToken(){
    return this.storage.get(TOKEN_KEY).then(res => {
      if(res){
        this.authenticationState.next(true);
      }else{
        this.authenticationState.next(false);
      }
    });
  }
}