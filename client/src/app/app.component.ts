import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './shared/services/socket.service';
import { socketEventEnum } from './constants/socket-event-enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Chat App';
  messages: string[] = [];

  constructor(private strategy: ChangeDetectorRef, private socketService: SocketService) {
    this.socketService.connect();
  }

  ngOnInit(): void {

    this.socketService.listen<any>(socketEventEnum.websocketMessage).subscribe(
      (res) => {
        // TODO: display handshake notification in console here.
        console.log(res);
        this.messages.push(res);
      },
      (err) => {
        // TODO: display error notification here.
        console.log(err);
      }
    );

  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }


}
