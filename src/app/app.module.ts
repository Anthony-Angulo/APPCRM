import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Network } from '@ionic-native/network/ngx';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AuthService } from './services/authentication.service';
import { NgCalendarModule  } from 'ionic2-calendar';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { LocationTrackerService  } from './services/location-tracker.service';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    NgCalendarModule],
  providers: [
    StatusBar,
    SplashScreen,
    LocationTrackerService,
    GoogleMaps,
    Network,
    BackgroundGeolocation,
    Geolocation,
    BarcodeScanner,
    LocalNotifications,
    BackgroundMode,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
