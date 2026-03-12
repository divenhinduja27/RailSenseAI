import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user = {
    name:'',
    email:'',
    password:''
  };

  constructor(private router:Router){}

  register() {

  if(!this.user.name || !this.user.email || !this.user.password){
    alert("Please fill all fields before registering.");
    return;
  }

  console.log("Register Data:", this.user);

  alert("Account created successfully");

}
}