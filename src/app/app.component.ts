import { Component } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/authentication.service';
import { Router } from '@angular/router';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  notificationAlreadyReceived = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private backgroundMode: BackgroundMode,
    private network: Network,
    private localNotifications: LocalNotifications,
  ) {
    this.initializeApp();
  }
 
  // showNotification(data){
  //   // Schedule a single notification
  //   this.localNotifications.schedule({
  //     id: 1,
  //     text: JSON.stringify(data),
  //     sound: 'file://sound.mp3',
  //     data: { secret: "key" }
  //   });
  // }

  showNotification () {
    this.localNotifications.schedule({
      text: 'There is a legendary Pokemon near you'
    });

    this.notificationAlreadyReceived = true;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      // this.backgroundMode.on('activate',function() {
      //   // this.showNotification('activated');
      //   if(this.notificationAlreadyReceived === false) {
      //     this.showNotification();
      //   }
      // });
      // this.showNotification();
      // this.backgroundMode.enable();
      // // console.log(this.backgroundMode.isActive());
      // if(this.backgroundMode.isActive()){
      //   this.showNotification();
      // }
      this.authService.authenticationState.subscribe(state => {
        if(state){
          this.router.navigate(['dashboard']);
        }else{
          this.router.navigate(['login']);
        }
      });
    });
  }
}
