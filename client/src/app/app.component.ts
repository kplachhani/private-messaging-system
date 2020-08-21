import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './shared/services/socket.service';
import { socketEventEnum } from './constants/socket-event-enum';
import { AccountService } from './account/services/account.service';
import { Router } from '@angular/router';
import { LocalstorageService } from './shared/services/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Chat App';

  constructor(
    private router: Router,
    private authService: AccountService,
    private localStorage: LocalstorageService
  ) { }

  ngOnDestroy(): void {
    debugger;
    this.localStorage.deleteToken('public-key');
    this.localStorage.deleteToken('shared-key');
  }

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe(
      res => {
        console.log(`Is authenticated ${res}`);
        if (!res) {
          this.localStorage.deleteToken('public-key');
          this.localStorage.deleteToken('shared-key');
          return this.router.navigateByUrl('/login');  // if user not present navigate to login
        }
      }
    );
  }


}
