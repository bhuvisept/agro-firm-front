import { Component, OnInit, Inject } from '@angular/core'
import io from 'socket.io-client'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

import { environment } from 'src/environments/environment'
import { GeneralServiceService } from 'src/app/core/general-service.service'
const SOCKET_ENDPOINT = environment.URLHOST
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css'],
})
export class CreateGroupComponent implements OnInit {
  groupName: any
  socket: any
  userId: any
  connectList: any
  userObj: any
  constructor(public currentDialogRef: MatDialogRef<CreateGroupComponent>, private service: GeneralServiceService, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    if (userData && userData.userInfo) this.userId = userData.userInfo._id
    this.connectionList()
  }

  createGroup() {
    this.socket = io(SOCKET_ENDPOINT)
    this.socket.emit('create-room', { userId: this.userId, room: this.groupName })
    this.socket.on('getMessage', (data: any) => {})
  }
  joinRoom() {
    this.socket = io(SOCKET_ENDPOINT)
    this.socket.emit('create-room', { userId: '6188b4c2a9c86299e6405d9f', room: 'Javascript' })
    this.socket.on('getMessage', (data: any) => {})
  }

  onNoClick(): void {
    this.currentDialogRef.close()
  }

  connectionList() {
    let data = { senderId: this.userId }
    this.service.connectionList(data).subscribe((Response) => Response['code'] == 200 && (this.connectList = Response['data']))
  }
}
