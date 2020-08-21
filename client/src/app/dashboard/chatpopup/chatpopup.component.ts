import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';

import { SocketService } from 'src/app/shared/services/socket.service';
import { User } from 'src/app/account/models/user';
import { AccountService } from 'src/app/account/services/account.service';
import { E2eEncryptionService } from 'src/app/shared/services/e2e-encryption.service';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';


@Component({
  selector: 'app-chatpopup',
  templateUrl: './chatpopup.component.html',
  styleUrls: ['./chatpopup.component.css']
})
export class ChatpopupComponent implements OnInit, OnDestroy {
  chatMessages: ChatResponse[] = [];
  inputMessage: string;
  E2EActivated: boolean;


  constructor(
    private socketService: SocketService,
    private authService: AccountService,
    private encrypt: E2eEncryptionService,
    private localStorage: LocalstorageService
  ) {

  }

  ngOnDestroy(): void {
    console.log('ng on destroy from chatpopup');
    this.socketService.emit('leave_room', { room: 'Group_Room' });
    this.localStorage.deleteToken('public-key');
    this.localStorage.deleteToken('shared-key');
  }

  ngOnInit(): void {

    this.encrypt.generatePublicKey();

    this.socketService.emit('join_room', { room: 'Group_Room' });

    this.socketService.listen<ChatResponse>('listen_room').subscribe(
      (res) => {
        // TODO: display handshake notification in console here.
        console.log(res);
        const decryptedPayload = this.encrypt.decrypt(res.payload);
        console.log(`decypted payload : ${JSON.stringify(decryptedPayload)}`);
        this.chatMessages.push({ ...res, payload: decryptedPayload });
      },
      (err) => {
        // TODO: display error notification here.
        console.log(err);
      }
    );

    this.socketService.listen<any>('trigger_E2E').subscribe(
      (res) => {

        this.socketService.emit('activate_E2E', {
          room: 'Group_Room',
          key: this.localStorage.get('public-key')
        });
      },
      (err) => {
        console.log(err);
      }
    );

    this.socketService.listen<any>('activate_E2E').subscribe(
      (res) => {

        console.log(res);
        const { key: relyingPartyPublicKeyBase64 } = res;
        this.encrypt.computeSecretKey(relyingPartyPublicKeyBase64);
      },
      (err) => {
        console.log(err);
      }
    );

    this.encrypt.E2EActivated.subscribe(
      (res) => {

        this.E2EActivated = res;
      });

  }

  sendMessage(): void {
    if (this.inputMessage && this.E2EActivated) {
      let user: User;
      this.authService.authUser.subscribe((res) => user = res);
      const messageDateTime = moment().format('MMMM Do YYYY, h:mm:ss a'); // June 5th 2020, 2:34:09 pm
      const data: ChatResponse = {
        room: 'Group_Room',
        user: user,
        payload: {
          message: this.inputMessage,
          datetime: messageDateTime
        }
      };
      this.chatMessages.push(data);
      this.socketService.emit('emit_room', { ...data, payload: this.encrypt.encrypt(data.payload) });
      this.inputMessage = null;
    }
  }

}

interface ChatResponse {
  room: string;
  user: User;
  payload: ChatPayload;
}

interface ChatPayload {
  message: string;
  datetime: string;
}