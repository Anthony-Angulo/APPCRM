import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { environment as ENV } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formData = {
    email: '',
    password: ''
  };

  constructor(
    private http: HttpClient,
    public alertController: AlertController,
    private authService: AuthService,
    ) { }

  ngOnInit(){}

  login(){

    this.http.post(ENV.BASE_URL + '/login', this.formData).subscribe((data: any) =>{
      if(data.status){
        this.authService.login(data.id, data.token, data.name);
      }else{
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

}
