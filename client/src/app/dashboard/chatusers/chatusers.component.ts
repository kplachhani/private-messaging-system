import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService } from 'src/app/account/services/account.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { User } from 'src/app/account/models/user';

@Component({
  selector: 'app-chatusers',
  templateUrl: './chatusers.component.html',
  styleUrls: ['./chatusers.component.css']
})
export class ChatusersComponent implements OnInit, OnDestroy {

  activeUsers: User

  constructor(private socketService: SocketService, private authService: AccountService) {
  }

  ngOnInit(): void {
    this.socketService.listen<any>('active_users').subscribe(
      (users) => {
        // TODO: display handshake notification in console here.
        console.log(users);
        this.activeUsers = users;
      },
      (err) => {
        // TODO: display error notification here.
        console.log(err);
      }
    );

  }

  ngOnDestroy(): void {

  }




}
