import { Injectable } from '@angular/core';
import { File } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private file: File, private webview: WebView, private photoViewer: PhotoViewer, ) { }

  public getPath(name) {
    let filePath = this.file.dataDirectory + name;
    return this.pathForImage(filePath);
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  public showImage(name) {
    this.photoViewer.show(this.file.dataDirectory + name)
  }

}
