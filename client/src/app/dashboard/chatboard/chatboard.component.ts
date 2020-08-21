import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from 'src/app/shared/services/socket.service';
import { socketEventEnum } from 'src/app/constants/socket-event-enum';
import { User } from 'src/app/account/models/user';
import { AccountService } from 'src/app/account/services/account.service';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { E2eEncryptionService } from 'src/app/shared/services/e2e-encryption.service';

@Component({
  selector: 'app-chatboard',
  templateUrl: './chatboard.component.html',
  styleUrls: ['./chatboard.component.css']
})
export class ChatboardComponent implements OnInit, OnDestroy {
  user: User;
  messages: string[] = [];
  title = 'Chat App is running!';

  E2EActivated: boolean;


  constructor(
    private socketService: SocketService,
    private authService: AccountService,
    private localStorage: LocalstorageService,
    private encrypt: E2eEncryptionService
  ) {
    this.socketService.connect();
  }

  ngOnInit(): void {
    this.authService.authUser.subscribe((res) => this.user = res);
    this.encrypt.E2EActivated.subscribe(
      (res) => {
        this.E2EActivated = res;
        this.title = this.E2EActivated ? "end to end chat App is running!" : "Chat App is running!";
      });
  }

  ngOnDestroy(): void {
    debugger;
    console.log('ng on destroy from chatboard');
    this.socketService.disconnect();
  }

  triggerE2E() {
    this.socketService.emit('trigger_E2E', { room: 'Group_Room' });
  }

}



