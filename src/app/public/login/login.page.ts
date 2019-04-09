import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  formData = {email: '', password: ''};
  url = 'http://192.168.0.41';
  dato: any;

  constructor(
    private http: HttpClient, 
    private authService: AuthenticationService
    ) { }

  login(){
    console.log(this.formData);
     this.http.post(this.url + '/api/login',this.formData)
     .subscribe((data: any) =>{
      this.dato = JSON.parse(data);
      if(this.dato.status){
        this.authService.login(this.dato.id,this.dato.token);
      }
     });
  }  

  ngOnInit() {
  }

}
