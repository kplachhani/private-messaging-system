import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import SocketIOClient from 'socket.io-client';
import { socketEventEnum } from 'src/app/constants/socket-event-enum';
import { AccountService } from 'src/app/account/services/account.service';


@Injectable({
  providedIn: 'root'
})


export class SocketService {
  socket: SocketIOClient.Socket;
  private token: string;
  private socketUrl: string;
  private socketConfig: object;

  constructor(private authService: AccountService) { }

  private impersonateToken(): void {
    this.authService.authUser.subscribe(
      (res) => this.token = res.userName // @** attach bearer token in header for socket Authorization.
    );
  }


  private initConfiguration(): void {
    this.socketUrl = `${environment.protocol}${environment.host}${environment.port}`;
    this.socketConfig = {
      query: { token: this.token },
      transports: ['websocket'], // @** strictly websocket protocol
      reconnection: true,
    };

  }

  private initHandler(): void {
    // TODO: display handshake notification in console here.
    this.socket.on('error', err => console.log(err));
    this.socket.on('disconnect', reason => console.log(reason));
  }

  connect(): void {
    this.impersonateToken();
    this.initConfiguration();
    this.socket = SocketIOClient(this.socketUrl, this.socketConfig);
    this.initHandler();
    this.socketHandshake();
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  emit(eventType: string, payload: any): void {
    this.socket.emit(eventType, payload);
  }

  listen<T>(eventType: string): Observable<T> {
    return new Observable<T>((observer) => {
      this.socket.on(eventType, (data) => observer.next(data));
    });
  }

  private socketHandshake() {
    this.listen<any>(socketEventEnum.websocketMessage).subscribe(
      (res) => {
        // TODO: display handshake notification in console here.
        console.log(res);
      },
      (err) => {
        // TODO: display error notification here.
        console.log(err);
      }
    );
  }
}
