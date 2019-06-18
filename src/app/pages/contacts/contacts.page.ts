// import { HttpClient } from '@angular/common/http';
import { /*ChangeDetectorRef,*/ Component, OnInit } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/File/ngx';
import { ActionSheetController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { ImagesService } from 'src/app/services/images.service';
import { SaveDataService } from 'src/app/services/save-data.service';
import { Contact, StorageService } from 'src/app/services/storage.service';
// import { load } from '@angular/core/src/render3';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  contactList: any[] = [];
  list: Contact[] = [];

  constructor(
    private storageservice: StorageService,
    private imageservice: ImagesService,
    private camera: Camera,
    private file: File,
    // private http: HttpClient,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private plt: Platform,
    private loadingController: LoadingController,
    // private ref: ChangeDetectorRef,
    private filePath: FilePath,
    private savedataservice: SaveDataService) { }

  ngOnInit() {
    this.storageservice.getContacts().then(contactList => {
      this.contactList = contactList;
      this.list = contactList;
    })
  }

  public getPath(name) {
    return this.imageservice.getPath(name)
  }

  showImage(name) {
    this.imageservice.showImage(name)
  }

  searchContacts(val: any) {
    let valor = val.target.value;
    if (valor && valor.trim() != '') {
      this.list = this.contactList.filter((item) => {
        return (item.nombre_reducido.toLowerCase().indexOf(valor.toLowerCase()) > -1) || (item.codigo_protevs.toLowerCase().indexOf(valor.toLowerCase()) > -1);
      })
    } else {
      this.list = this.contactList;
    }
  }

  async updateGeolocation(contact: any) {

    const loading = await this.loadingController.create({
      message: 'Actualizando Geolocalizacion',
    });
    await loading.present();

    this.savedataservice.updateGeolocation(contact.id).then(formData => {
      contact.latitud = formData.latitude;
      contact.longitud = formData.longitude;      
    }).catch(err =>{
      console.log(err)
    }).finally(() =>{
      loading.dismiss()
    });

  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  async addPhoto(id: number) {
    const actionSheet = await this.actionSheetController.create({
      header: "Selececcionar Origen de la Imagen",
      buttons: [
        {
          text: 'Cargar desde Libreria',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, id);
          }
        },
        {
          text: 'Usar Camara',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, id);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType, id: number) {
    var options: CameraOptions = {
      quality: 70,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), id);
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), id);
      }
    });

  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName, id: number) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName, id);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  updateStoredImages(name, id: number) {

    var contact_index = this.contactList.findIndex(contact => contact.id == id)

    if (this.contactList[contact_index].img != undefined) {

      let filePath = this.file.dataDirectory + this.contactList[contact_index].img;
      var correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
      this.file.removeFile(correctPath, this.contactList[contact_index].img).then(res => {
        this.presentToast('File removed.');
      });

    }

    this.contactList[contact_index].img = name;

    this.storageservice.setContacts(this.contactList)

  }

  // deleteImage(imgEntry, position) {
  //   this.images.splice(position, 1);

  //   
  // }

  // startUpload(imgEntry) {
  //   this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
  //       .then(entry => {
  //           ( < FileEntry > entry).file(file => this.readFile(file))
  //       })
  //       .catch(err => {
  //           this.presentToast('Error while reading file.');
  //       });
  // }

  // readFile(file: any) {
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //       const formData = new FormData();
  //       const imgBlob = new Blob([reader.result], {
  //           type: file.type
  //       });
  //       formData.append('file', imgBlob, file.name);
  //       this.uploadImageData(formData);
  //   };
  //   reader.readAsArrayBuffer(file);
  // }

  // async uploadImageData(formData: FormData) {
  //   const loading = await this.loadingController.create({
  //       content: 'Uploading image...',
  //   });
  //   await loading.present();

  //   this.http.post("http://localhost:8888/upload.php", formData)
  //       .pipe(
  //           finalize(() => {
  //               loading.dismiss();
  //           })
  //       )
  //       .subscribe(res => {
  //           if (res['success']) {
  //               this.presentToast('File upload complete.')
  //           } else {
  //               this.presentToast('File upload failed.')
  //           }
  //       });
  // }


}
