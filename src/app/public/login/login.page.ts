import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/services/authentication.service';

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

  constructor(private authService: AuthService, private storage: Storage) { }

  ngOnInit() {
    this.storage.get('last_user').then(email => {
      if (email) this.formData.email = email
    })
  }

  login() {
    this.authService.login(this.formData)
  }

}
