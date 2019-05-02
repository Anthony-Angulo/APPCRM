import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

const URL = 'http://192.168.101.23';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  errorMessage: string = '';

  formData = {
    email: '',
    password: ''
  };

  authState$: Observable<boolean>;
  return: string = '';

  constructor(
    private http: HttpClient,
    public alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    ) { }

  login(){

    this.http.post(URL + '/api/login', this.formData).subscribe((data: any) =>{
      if(data.status){
        this.authService.login(data.id, data.token, data.name).then(
          _ => this.router.navigateByUrl(this.return)
        );
      }else{
        this.presentAlert()
      }
     });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Login',
      message: 'Credenciales Invalidas.',
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnInit() {
    // Get the query params
    this.route.queryParams.subscribe(params => this.return = params['return'] || '/dashboard');
  }

}
