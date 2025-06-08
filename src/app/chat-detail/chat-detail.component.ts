import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
import { GeneralServiceService } from '../core/general-service.service'
import { genralConfig } from 'src/app/constant/genral-config.constant'

import { environment } from 'src/environments/environment'
import * as moment from 'moment'

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.css'],
})
export class ChatDetailComponent implements OnInit {
  userInfo: any
  roleName: string
  groupData: any
  conversationId: string
  groupImage: string
  groupName: string
  membersData: any[] = []
  showUpdateBtn: boolean
  fileData: File
  newGroupImage: string
  isAdmin: boolean

  createdById: string
  createdByName: string
  createdByTime: Date
  groupNameOriginal: any
  addParticipant: boolean
  onlyAdminCanAddOrRemove: boolean
  onlyAdminCanMessage: boolean
  public image_url = environment.URLHOST + '/uploads/enduser/'
  public grup_img_url = environment.URLHOST + '/uploads/event/brand_logo/'

  onlyAdminUpdateInfo: boolean
  userListForGroup: any[] = []

  constructor(
    private DialogRef: MatDialogRef<ChatDetailComponent>,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private genralServices: GeneralServiceService,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('truckStorage'))
    this.data && (this.conversationId = this.data.groupId)
    this.getGroupDetailWithMembers()
  }

  getGroupDetailWithMembers() {
    this.spinner.show()
    let data = { conversation_id: this.conversationId, loggedInUser: this.userInfo.userInfo._id }
    this.genralServices.getGroupDetailWithMembers(data).subscribe(
      (res) => {
        if (res['code'] == genralConfig.statusCode.ok) {
          this.groupData = res['data']
          this.groupImage = res['data'].image
          this.groupName = res['data'].name
          this.groupNameOriginal = res['data'].name
          this.membersData = res['data'].membersData
          this.isAdmin = this.membersData[0].isAdmin
          this.showUpdateBtn = false
          this.createdById = res['data'].createdBy._id
          this.createdByName = res['data'].createdBy.firstName + ' ' + res['data'].createdBy.lastName
          this.createdByTime = res['data'].createdBy.dateTime
          this.onlyAdminCanAddOrRemove = res['data'].onlyAdminCanAddOrRemove
          this.onlyAdminCanMessage = res['data'].onlyAdminCanMessage
          this.onlyAdminUpdateInfo = res['data'].onlyAdminUpdateInfo
        } else this.toastr.warning(res['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.error('Something went wrong')
      }
    )
  }

  uploadImage(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0]
    if (this.fileData.type == 'image/png' || this.fileData.type == 'image/jpeg') {
      const formData = new FormData()
      formData.append('type', 'BRANDLOGO')
      formData.append('file', this.fileData)
      this.spinner.show()
      this.genralServices.uploadImageForPath(formData).subscribe(
        (res) => {
          if (res['code'] == genralConfig.statusCode.ok) {
            this.newGroupImage = res['data'].imagePath
            this.changeBtnStatus()
          } else res['code'] != genralConfig.statusCode.warning && this.toastr.warning(res['message'])
          this.spinner.hide()
        },
        () => {
          this.spinner.hide()
          this.toastr.error('something went wrong')
        }
      )
    } else this.toastr.warning('wrong image format')
  }

  leaveOrRemoveFromGroup(userId) {
    let data = { nowTime: moment(new Date()).utc(), member_id: userId, loggedInUser: this.userInfo.userInfo._id, conversation_id: this.conversationId }
    this.genralServices.leaveOrRemoveFromGroup(data).subscribe(
      (res) => {
        if (res['code'] == genralConfig.statusCode.ok) {
          this.membersData = this.membersData.filter((el) => el.user_id != userId)
          this.userInfo.userInfo._id == userId && this.DialogRef.close({ action: 'REMOVE', conversation_id: this.conversationId })
        } else this.toastr.warning(res['message'])
      },
      () => this.toastr.error('Something went wrong')
    )
  }

  closePage() {
    this.DialogRef.close({ name: this.groupNameOriginal, image: this.groupImage, conversationId: this.conversationId, membersCount: this.membersData.length })
  }

  updateGroupInfo() {
    let data = {
      loggedInUser: this.userInfo.userInfo._id,
      conversation_id: this.conversationId,
      nowTime: moment(new Date()).utc(),
      name: this.groupName,
      image: this.newGroupImage ? this.newGroupImage : this.groupImage,
    }
    this.genralServices.updateGroupInfo(data).subscribe(
      (res) => {
        if (res['code'] == genralConfig.statusCode.ok) this.DialogRef.close({ name: this.groupName, image: data.image, conversationId: this.conversationId, membersCount: this.membersData.length })
        else {
          this.toastr.warning(res['message'])
          this.closePage()
        }
      },
      () => this.toastr.error('Something went wrong')
    )
  }

  makeOrDismissAdmin(action, userId, index) {
    let data = { action: action, loggedInUser: this.userInfo.userInfo._id, conversation_id: this.conversationId, member_id: userId, nowTime: moment(new Date()).utc() }
    this.genralServices.makeOrDismissAdmin(data).subscribe(
      (res) => {
        if (res['code'] == genralConfig.statusCode.ok) action == 'ADD' ? (this.membersData[index].isAdmin = true) : (this.membersData[index].isAdmin = false)
        else {
          this.toastr.warning(res['message'])
          this.closePage()
        }
      },
      () => this.toastr.error('Something went wrong')
    )
  }

  updateGroupSettings(type, action) {
    let data = { loggedInUser: this.userInfo.userInfo._id, conversation_id: this.conversationId, nowTime: moment(new Date()).utc() }
    type == 'onlyAdminUpdateInfo' && (data[type] = action)
    type == 'onlyAdminCanMessage' && (data[type] = action)
    type == 'onlyAdminCanAddOrRemove' && (data[type] = action)
    this.genralServices.updateGroupSettings(data).subscribe(
      (res) => {
        if (res['code'] == genralConfig.statusCode.ok) {
          this.onlyAdminCanAddOrRemove = res['data'].addOrRemove
          this.onlyAdminCanMessage = res['data'].message
          this.onlyAdminUpdateInfo = res['data'].update
          this.toastr.success(res['message'])
        } else {
          type == 'onlyAdminUpdateInfo' && (this.onlyAdminUpdateInfo = action)
          type == 'onlyAdminCanMessage' && (this.onlyAdminCanMessage = action)
          type == 'onlyAdminCanAddOrRemove' && (this.onlyAdminCanAddOrRemove = action)
          this.toastr.warning(res['message'])
          this.closePage()
        }
      },
      () => this.toastr.error('Something went wrong')
    )
  }

  getUserListToAdd() {
    this.spinner.show()
    this.addParticipant = true
    let data = { loggedInUser: this.userInfo.userInfo._id, conversation_id: this.conversationId }
    this.genralServices.getMembersToAddinGroup(data).subscribe(
      (res) => {
        if (res['code'] == genralConfig.statusCode.ok) this.userListForGroup = res['data']
        else this.toastr.warning(res['message'])
        this.spinner.hide()
      },
      () => {
        this.toastr.error('Something went wrong')
        this.spinner.hide()
      }
    )
  }

  addUserToGroup(user, index) {
    this.spinner.show()
    let data = { loggedInUser: this.userInfo.userInfo._id,
       conversation_id: this.conversationId,
        nowTime: moment(new Date()).utc(),
         user_id: user.user_id 
        }
    this.genralServices.addMemberToGroup(data).subscribe(
      (res) => {
        if (res['code'] == genralConfig.statusCode.ok) {
          this.membersData.push({ firstName: user.firstName, image: user.image, isAdmin: false, isMyself: false, lastName: user.lastName, user_id: user.user_id })
          this.spinner.hide()
          this.userListForGroup[index].alreadyExist = true
        } else this.toastr.warning(res['message'])
      },
      () => this.toastr.error('Something went wrong')
    )
  }

  changeBtnStatus() {
    this.showUpdateBtn = true
  }
}
