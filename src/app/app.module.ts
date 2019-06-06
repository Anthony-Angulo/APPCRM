import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/File/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Network } from '@ionic-native/network/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { NgCalendarModule } from 'ionic2-calendar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/authentication.service';

// import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
// import { LocationTrackerService  } from './services/location-tracker.service';
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
    // LocationTrackerService,
    GoogleMaps,
    Network,
    // BackgroundGeolocation,
    Geolocation,
    BarcodeScanner,
    BackgroundMode,OneSignal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService,
    Camera,
    File,
    WebView,
    FilePath,
    PhotoViewer
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
