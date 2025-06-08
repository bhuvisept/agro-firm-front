import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatserviceService {
  public SOCKET_ENDPOINT = environment.URLHOST
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor() { }
  socket = io(this.SOCKET_ENDPOINT);

  public sendMessage(message) {
    this.socket.emit('message', message);
  }
  public createRoom (room){
    this.socket.emit('create', room);
  }
  public getNewMessage = () => {
    this.socket.on('message-broadcast', (message) =>{
      this.message$.next(message);
    });
    
    return this.message$.asObservable();
  };
}
