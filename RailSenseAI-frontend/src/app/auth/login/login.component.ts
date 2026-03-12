import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginData = {
    email: '',
    password: ''
  };

  constructor(private router: Router) {}

 login() {

  if(!this.loginData.email || !this.loginData.password){
    alert("Please fill the credentials before login.");
    return;
  }

  console.log("Login Data:", this.loginData);

  // later connect backend API here

  alert("Login successful");

  this.router.navigate(['/dashboard']);

}

}