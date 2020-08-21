import { Component, OnInit } from '@angular/core';
import { UserVm, User } from '../models/user';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  model: UserVm;
  errorMessage: string;

  constructor(private router: Router, private http: HttpClient, private authService: AccountService) {
    this.model = new UserVm();
  }

  ngOnInit(): void {
  }

  onsubmit(): void {
    console.log(this.model);
    const baseUrl = `${environment.protocol}${environment.host}${environment.port}`; // generate the base url from the enviroment file
    console.log(baseUrl);
    this.http.post(`${baseUrl}/login`, this.model).subscribe( // post the username and password to the server and authenticate
      (res) => { // response from the server
        console.log(res);
        if (!res) {
          this.errorMessage = 'credential is incorrect';
        }
        else {
          this.authService.setAuth(res as User); // set the authenticated user in session
          this.router.navigate(['dashboard']); // navigate to chat dashboard
        }
      },
      (error) => {
        console.log(error);
        this.errorMessage = error.message;
      }
    );
  }

}
