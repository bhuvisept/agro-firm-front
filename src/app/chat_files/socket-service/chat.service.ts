import { Injectable } from '@angular/core'
import { Socket, SocketIoConfig } from 'ngx-socket-io'
import { environment } from 'src/environments/environment'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { BehaviorSubject } from 'rxjs'

export class SocketNameSpace extends Socket {
  constructor(socketConfig: SocketIoConfig) {
    super(socketConfig)
  }
}
@Injectable({ providedIn: 'root' })
export class ChatService {
  private currentMsg = new BehaviorSubject<object>({})
  newMessage = this.currentMsg.asObservable()

  chat: SocketNameSpace
  roleName: any
  userInfo: any

  constructor() {
    this.userInfo = JSON.parse(localStorage.getItem('truckStorage'))
    this.userInfo && (this.roleName = this.userInfo.role_name)
    this.chat = new SocketNameSpace({ url: environment.URLHOST })
    // this.userInfo && this.chat.on(genralConfig.chatEndPoints.connect, () =>{})
    this.receivedMessage()
    this.joinNewConversation()
  }

  // connectChatFun() {

  // }

  joinConversation(userId) {
    this.chat.emit(genralConfig.chatEndPoints.joinConversation, { loggedInUser: userId })
  }

  joinNewConversation() {
    this.chat.on(genralConfig.chatEndPoints.newConversationStart, (data) => this.chat.emit(genralConfig.chatEndPoints.joinNewConversation, data))
  }

  sendMessage(data) {
    this.chat.emit(genralConfig.chatEndPoints.sendMsg, data)
  }

  receivedMessage() {
    this.chat.on(genralConfig.chatEndPoints.receiveMsg, (data) => { data.data && this.nextMessage(data) })
  }

  nextMessage(msg) {
    this.currentMsg.next(msg)
  }

  leaveConversation(userId) {
    this.chat.emit(genralConfig.chatEndPoints.leaveConversation, { loggedInUser: userId })
  }

}
