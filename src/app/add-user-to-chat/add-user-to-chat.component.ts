import { Component, OnInit, Inject } from '@angular/core'

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
import { GeneralServiceService } from '../core/general-service.service'
import { genralConfig } from '../constant/genral-config.constant'
import { environment } from 'src/environments/environment'
import * as moment from 'moment'

@Component({
  selector: 'app-add-user-to-chat',
  templateUrl: './add-user-to-chat.component.html',
  styleUrls: ['./add-user-to-chat.component.css'],
  providers: [NgxSpinnerService],
})
export class AddUserToChatComponent implements OnInit {
  openType: string
  roleName: string
  clinicId: string
  userInfo: any
  userListForChat: any[] = []
  page: number = 1
  totalCount: number
  totalPages: number
  modalScrollDistance = 1
  modalScrollThrottle = 50
  newChat: any
  totalcount:any
  groupName: string = ''
  membersArr: any[] = []
  fileData: File
  uploadedImage: string
  selectedUser: any
  isAccepted: any = 'accept'
  // accessLevel: any = 'SALESPERSON'
  accessLevel:any
  SearchText: string = ''
  userListPage:any
  noData: boolean
  inviteList:any[]=[]
  searchUser: string
  searchKey: any
  itemsPerPage: any = 10
  invitedList: any
  connectTotalNo: any
  count: any
  public image_url = environment.URLHOST + '/uploads/enduser/'
  public grup_img_url = environment.URLHOST + '/uploads/event/brand_logo/'
  constructor(
    private DialogRef: MatDialogRef<AddUserToChatComponent>,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private service: GeneralServiceService,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('truckStorage'))
    this.userInfo && (this.roleName = this.userInfo.userInfo.roleId.roleTitle)
    this.accessLevel =this.userInfo.userInfo.accessLevel
    this.data && (this.openType = this.data.type)
    this.getMyConnectList(1)
  }

  destroyComponent() {
    this.DialogRef.close()
  }

  getUserList() {
    this.spinner.show()
    let data = { clinic_id: this.clinicId, loggedInUser: this.userInfo.userId }
    this.service.getTeamMemberForChat(data).subscribe(
      (res) => {
        this.totalCount = res['totalCount']
        if (res['code'] == genralConfig.statusCode.ok) this.userListForChat = res['data']
        else this.toastr.warning(res['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.error(genralConfig.messages.apiError)
      }
    )
 
  }

  getMyConnectList(pageNumber) {
    // let data = { userId: this.userInfo.userInfo._id, searchText: this.searchKey, count: 10000 ,companyId: this.userInfo.userInfo.companyId, type:"SALESPERSON"}
    // this.spinner.show()
    // this.service.getConnectListDetails(data).subscribe(
    //   (response) => {
    //     if (response['code'] == 200) {
    //       this.invitedList = response['data']
    //       this.connectTotalNo = response.totalCount
    //       this.count = this.invitedList.length
    //     }
    //     this.spinner.hide()
    //   },
    //   () => this.spinner.hide()
    // )
       let data = {
      userId:this.userInfo.userInfo._id,
      companyId: this.userInfo.userInfo.companyId,
      isAccepted: this.isAccepted,
      accessLevel: this.accessLevel,
      searchKey: this.SearchText ? this.SearchText.replace(/^\s+|\s+$/gm, '') : null,
      page: pageNumber,
      count: 10000,
    }
    this.spinner.show()
    this.service.ChatSalesPersonList(data).subscribe((res) => {
      this.inviteList = res['data']
      this.totalcount = res['totalCount']
      this.userListPage = pageNumber
      this.spinner.hide()
      if (this.inviteList && this.inviteList.length) this.noData = false
      else this.noData = true
    })
  }

  selectedSingleUser(user) {
    this.selectedUser = user
    this.membersArr.push(this.selectedUser.userId)
    this.startNewConversation('INDIVIDUAL')
  }

  selectedMultiple(event, userId) {
    event.checked ? this.membersArr.push(userId) : (this.membersArr = this.membersArr.filter((el) => el != userId))
  }

  uploadImage(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0]
    if (this.fileData.type == 'image/png' || this.fileData.type == 'image/jpeg') {
      const formData = new FormData()
      formData.append('type', 'BRANDLOGO')
      formData.append('file', this.fileData)
      this.spinner.show()
      this.service.uploadImageForPath(formData).subscribe(
        (res) => {
          if (res['code'] == genralConfig.statusCode.ok) this.uploadedImage = res['data'].imagePath
          else res['code'] != genralConfig.statusCode.warning && this.toastr.warning(res['message'])
          this.spinner.hide()
        },
        () => {
          this.spinner.hide()
          this.toastr.error(genralConfig.messages.apiError)
        }
      )
    } else this.toastr.warning(genralConfig.messages.imageFormat)
  }

  startNewConversation(type) {
    if (type == 'GROUP' && this.groupName.trim().length === 0) return this.toastr.warning('Please enter group name')
    this.groupName = this.groupName.trim()
    if (!this.membersArr.length) return this.toastr.warning('Please select atleast one user')
    this.spinner.show()
    let data = { loggedInUser: this.userInfo.userInfo._id, type: type, membersArr: this.membersArr, nowTime: moment(new Date()).utc() }

    if (type == 'GROUP') {
      data['name'] = this.groupName
      this.uploadedImage ? (data['image'] = this.uploadedImage) : (data['image'] = '')
    } else {
      data['name'] = this.selectedUser.personName
      data['image'] = this.selectedUser.image ? this.selectedUser.image : ''
      data['roleTitle'] = this.roleName
    }
    this.service.startNewConversation(data).subscribe(
      (res) => {
        this.totalCount = res['totalCount']
        if (res['code'] == genralConfig.statusCode.ok) {
          this.newChat = res['data']
          this.DialogRef.close(this.newChat)
        } else this.toastr.warning(res['message'])
        this.spinner.hide()
        this.membersArr = []
      },
      () => {
        this.spinner.hide()
        this.toastr.error(genralConfig.messages.apiError)
        this.membersArr = []
      }
    )
  }
}
