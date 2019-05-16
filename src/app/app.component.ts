import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/authentication.service';
import { Router } from '@angular/router';
import { SaveDataService } from './services/save-data.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private saveData: SaveDataService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      this.saveData.startNetwork();
      this.authService.authenticationState.subscribe(state => {
        if(state){
          this.router.navigate(['dashboard'], {replaceUrl: true});
        }else{
          this.router.navigate(['login']);
        }
      });
    });
  }
}
