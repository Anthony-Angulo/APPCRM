import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  tokenkey:string = 'TOKEN_KEY';
  user_id: string = 'USER_ID';
  authenticationState = new BehaviorSubject(false);

  constructor(private storage: Storage, private plt: Platform) { 
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  login(user_id: any, token: any){
    this.storage.set(this.user_id,user_id.toString());
    this.storage.set(this.tokenkey,token.toString()).then(res => {
      this.authenticationState.next(true);
    });
  }

  logout(){
    return this.storage.remove(this.tokenkey).then(() => {
      this.authenticationState.next(false);
    });
  }
  
  isAuthenticated(): boolean{
    return this.authenticationState.value;
  }

  checkToken(){
    return this.storage.get(this.tokenkey).then(res => {
      if(res){
        this.authenticationState.next(true);
      }else{
        this.authenticationState.next(false);
      }
    });
  }
}
