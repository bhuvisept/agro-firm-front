import { isNullOrUndefined } from 'util'
// import { AppService } from "src/environments/environment";
import { AppService } from './app.service'
import { Injectable } from '@angular/core'
import io from 'socket.io-client'
import { ReplaySubject, BehaviorSubject } from 'rxjs'
import { Observable, observable } from 'rxjs'
import { ToastrService } from 'ngx-toastr'
import { ResAPI } from './ResAPI'
import { NewMessage } from './chatmodels'
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket
  public curGroupId = ''
  // public userName: string;
  public userName = 'Anonymous'
  public isNewRoom = false

  public PurchaseKey: BehaviorSubject<object> = new BehaviorSubject<object>({})

  constructor(private http: HttpClient, private appService: AppService, private toastrService: ToastrService) {}

  public async initSocket(_userId) {
    this.socket = io(this.appService.socketUrl)
    await this.socket.emit('login', _userId)
  }

  // ---------------------------------------- Emmitting events------------------------------------
  public sendMessage(message: string, senderId: string, receiverIds: any, msgType: string, url: string, attachmentType: string, isRead: boolean): void {
    if (isNullOrUndefined(this.curGroupId) || this.curGroupId === '') {
      this.toastrService.warning('Please join a channel to start chatting:)')
      return
    }

    if (isNullOrUndefined(this.userName) || this.userName === '') {
      this.toastrService.warning('Please enter a valid username to start chatting:)')
      return
    }

    // const data = {
    //   'grpId': this.curGroupId,
    //   'message': message,
    //   'username': this.userName
    // };
    const data: NewMessage = {
      grpId: this.curGroupId,
      data: message,
      username: this.userName,
      senderId: senderId,
      receiverIds: receiverIds,
      msgType: msgType,
      url: url,
      attachmentType: attachmentType,
      isRead: isRead,
    }

    this.socket.emit('clientMsg', data)
  }

  public createRoom(groupName: string, ownId: string, memberId: any) {
    this.socket.emit('addGrp', groupName, ownId, memberId)
  }

  public joinRoom(grpId: string) {
    this.socket.emit('joinGrp', grpId)
  }

  public disconnectFromRoom(_userId) {
    this.socket.emit('disconnectFromRoom', _userId)
  }

  public userTyping(data) {
    this.socket.emit('userTyping', data)
  }

  public readMessages(data) {
    this.socket.emit('readMessages', data)
  }

  // ---------------------------------------- Emmitting events------------------------------------

  // ---------------------------------------- Socket On events------------------------------------

  public onNumUsersUpdate(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('getUsers', (count) => observer.next(count))
    })
  }

  public onNewMessage(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('serverMsg', (message) => observer.next(message))
    })
  }

  public onRoomCreated(): Observable<ResAPI> {
    return new Observable<any>((observer) => {
      this.socket.on('grpCreated', (res) => observer.next(res))
    })
  }

  public onRoomJoined(): Observable<ResAPI> {
    return new Observable<any>((observer) => {
      this.socket.on('joinGrpResult', (res) => observer.next(res))
    })
  }

  public onLoadUserList(): Observable<ResAPI> {
    return new Observable<any>((observer) => {
      this.socket.on('onLoadUserList', (res) => observer.next(res))
    })
  }

  public loadOnlineUsers(): Observable<ResAPI> {
    this.socket.emit('loadOnlineUsers')
    return new Observable<any>((observer) => {
      this.socket.on('loadUsersData', (res) => observer.next(res))
    })
  }

  public userTypingResult(): Observable<ResAPI> {
    return new Observable<any>((observer) => {
      this.socket.on('userTypingResult', (res) => {
        observer.next(res)
      })
    })
  }

  public leftSideMessage(): Observable<ResAPI> {
    return new Observable<any>((observer) => {
      this.socket.on('leftSideMessage', (res) => {
        observer.next(res)
      })
    })
  }

  public getNotfication(): Observable<ResAPI> {
    return new Observable<any>((observer) => {
      this.socket.on('notification', (res) => {
        observer.next(res)
      })
    })
  }

  // ---------------------------------------- Socket On events------------------------------------

  public clearCurrentDetails(): void {
    this.curGroupId = ''
    this.userName = ''
    this.isNewRoom = false
  }
}
