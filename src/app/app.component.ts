import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';

import { AuthService } from './services/authentication.service';
import { SaveDataService } from './services/save-data.service';

declare global {
  interface Date {
    getMySQLFormat (): string;
  }
}

Date.prototype.getMySQLFormat = function() {
  return this.getFullYear() + '-' +
  (1 + this.getMonth()) + '-' +
  this.getDate() + ' ' +
  this.toLocaleTimeString().slice(0, -2);
};

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
    private saveData: SaveDataService,
    private backgroundMode: BackgroundMode
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backgroundMode.enable();
      // this.backgroundMode.excludeFromTaskList();
      this.saveData.startNetwork();

      this.authService.authenticationState.subscribe(state => {
        if (state) {
          this.router.navigate(['dashboard'], { replaceUrl: true });
        } else {
          this.router.navigate(['login']);
        }
      });

    });

  }
}
