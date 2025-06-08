import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material'
import * as moment from 'moment'
import { NgxSpinnerService } from 'ngx-spinner'
import { environment } from 'src/environments/environment'
import { debounceTime } from 'rxjs/operators'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from '../core/general-service.service'
import { ChatService } from '../chat_files/socket-service/chat.service'
import { AddUserToChatComponent } from '../add-user-to-chat/add-user-to-chat.component'
import { SharedService } from 'src/app/service/shared.service'
import { ChatDetailComponent } from '../chat-detail/chat-detail.component'
import { SocketService } from 'src/app/chat_files/socket-service/socket.service'


//-------------------------------------------

// import { Component, OnInit, HostListener } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
// import { genralConfig } from 'src/app/constant/genral-config.constant'
// import { GeneralServiceService } from 'src/app/core/general-service.service'
// import { SharedService } from 'src/app/service/shared.service'
// import { environment } from 'src/environments/environment'
// import { SocketService } from 'src/app/chat_files/socket-service/socket.service'
// import { ChatService } from 'src/app/chat_files/socket-service/chat.service'
// import { MatDialog } from '@angular/material'
import { LoginDialogComponent } from 'src/app/pages/login-dialog/login-dialog.component'
// import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
import { PlanConfirmationDialogComponent } from 'src/app/plan-confirmation-dialog/plan-confirmation-dialog.component'
import { SliderImgComponent } from 'src/app/slider-img/slider-img.component'


//-------------------------------------------

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  providers: [NgxSpinnerService],
})
export class ChatPageComponent implements OnInit {

//------------- FOR HEADER ---------------------

urls = genralConfig.chatlink.generatelinkPort

userName: any = ''
userPlanData: any
personName: any

navOpen: boolean = false
ROLETITLE: any
notificationsLists: any
notList: any
loggedIn: any
receiverImage: any

public endUser = environment.URLHOST + '/uploads/enduser/'
notificationCount: number = 0
notificationPermission: any
accessLevel: any
firstName:any
lastName:any

//-------------  FOR HEADER END -------------------------------
  selectedUserForChat: string
  message: string = ''
  modalScrollDistance = 1
  modalScrollThrottle = 50

  selectedUserForChatId: any
  userInfo: any
  roleName: any
  selectedIndex: number
  chatList: any[] = []
  type: string
  totalCountChatList: number
  chatMessageList: any[] = []
  pageMessages: number
  typeToSend: string
  totalCountMessages: number
  totalPagesMessages: number
  pageChatList: any
  totalPagesChatList: number
  selectedUserForChatImage: any
  selectedUserForChatName: string
  scrollel: HTMLElement
  selectedUserForChatTotalMembers: any
  onlyAdminCanMessage: boolean = false
  isAdmin: boolean
  image_url = environment.URLHOST + '/uploads/enduser/'
  grup_img_url = environment.URLHOST + '/uploads/event/brand_logo/'
  uploadedDocRoute = environment.URLHOST + '/uploads/chatImages/'
  notificationBox: Notification

  directUnread: boolean = false
  groupUnread: boolean = false
  sellerUnread: boolean = false

  isNotMember: boolean = false
  toggled: any

  term = new FormControl('')
  sellerData: any
  totalCount: any
  membersArr: any[]
  selectedUserForChat_id: any
  uploadedAttachment: any
  filesForS3

  constructor(
    private translate: TranslateService,
    private toatsr: ToastrService,
    private router: Router,
    private chatService: ChatService,
    private _generalService: GeneralServiceService,
    private dialog: MatDialog,
    private chat: ChatService,
    private genralServices: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private SocketService: SocketService,
    private zone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    translate.addLangs(['en', 'pa', 'es']),
    setTimeout(() => this.zone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('truckStorage'))
    this.sellerData = JSON.parse(localStorage.getItem('chatSellerData'))
    this.roleName = this.userInfo.userInfo.roleId.roleTitle
    // this.type = this.roleName != 'SELLER' ? 'INDIVIDUAL' : 'SELLER'
    this.type = 'INDIVIDUAL' 
    this.chat.newMessage.subscribe((msg) => this.getChatData(msg))
    this.accessLevel = this.userInfo.userInfo.accessLevel
    if (this.sellerData && this.sellerData.id) {
      this.type = this.roleName == 'ENDUSER' ? 'SELLER' : 'INDIVIDUAL' 
      this.getChatList(1)
      this.startNewConversation()
      this.selectedIndex = 1
    } else this.getChatList(1)
    this.firstName = this.userInfo.userInfo.firstName
    this.lastName = this.userInfo.userInfo.lastName
    this.userInfo.userInfo._id && this.chatService.joinConversation(this.userInfo.userInfo._id)
    if (!this.userInfo) {
      this._generalService.logout()
    } else {
      this.ROLETITLE = this.userInfo.userInfo.roleId.roleTitle
      this.loggedIn = this.userInfo.userInfo._id
      this.accessLevel = this.userInfo.userInfo.accessLevel
      this.personName = this.userInfo.userInfo.personName
      this.SocketService.initSocket(this.loggedIn)
    }
    this.requestNotificationPermission()
    this.getNotificationsList()

    if (this.ROLETITLE != 'SELLER') {
      this.notifyUser()
      this.removeMarketSocket()
    }

    this.sharedService.getNotification().subscribe((res) => {
      if (res && res['info']) {
        this.totalCount--
        this.notificationsLists = this.notificationsLists.filter((item) => item._id != res['info']._id)
      } else if (res && res['readAll'] == true) {
        this.totalCount = 0
        this.notificationsLists = []
      }
    })

    this.sharedService.getHeader().subscribe((res: any) => {
      if (res && (res.companyName || res.personName)) this.userName = res.companyName ? res.companyName : res.personName
      else {
        if (this.userInfo.userInfo.roleId.roleTitle == 'ENDUSER') this.getUserProfileDetails()
        else if (this.userInfo.userInfo.roleId.roleTitle == 'COMPANY') this.getCompany()
        else if (this.userInfo.userInfo.roleId.roleTitle == 'SELLER') this.getSeller()
      }
      res.defaultLanguage && this.useLanguage(res.defaultLanguage)
    })
    this.userPlanData = this.userInfo.userInfo.planData
    this.term.valueChanges.pipe(debounceTime(1000)).subscribe(() => (this.term.value != null || this.term.value != undefined) && this.getChatList(1))
  }
  
// ------------   FOR HEADER  --------------------

  redirect(navlink) {
    // this.router.navigate([navlink])
  }

  useLanguage(language: string) {
    this.translate.setDefaultLang('en')
    this.translate.use(language || 'en')
  }

  routeMyProfile() {
    this.router.navigate(['/layout/myaccount/my-profile'])
  }

  notifyUser() {
    this.SocketService.getNotfication().subscribe((res) => {
      this.NotificationCheak(res)
      this.getNotificationsList()
    })
  }

  removeMarketSocket() {
    this.chatService.newMessage.subscribe()
  }

  async requestNotificationPermission() {
    await Notification.requestPermission()
  }

  NotificationCheak(data) {
    this.notificationBox = new Notification(data.title, {
      body: data.message,
      icon: data.userImage ? this.endUser + data.userImage : this.endUser + '038fc32c-383d-4f09-94c5-53709ba6388a-1644389458801_imagesss.jpg',
    })
    this.notificationBox.addEventListener('click', () => {
      let item = { notification_id: data.notificationId, reader_id: this.userInfo.userInfo._id }
      this._generalService.NotificationsRead(item).subscribe((res) => this.routePages(data))
    })
  }

  getNotificationsList() {
    let data = { receiver: this.loggedIn, count: 5, isReaded: false, role: this.userInfo.userInfo.roleId.roleTitle != 'SELLER' ? this.userInfo.userInfo.roleId.roleTitle : 'ECOMMERCE' }
    this._generalService.getNotificationsLists(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        window.scroll(0, 0)
        this.totalCount = response['totalCount'] > 99 ? 99 : response['totalCount']
        this.notificationCount = response['totalCount']
        this.notificationsLists = response['data']
      }
    })
  }

  navToggle() {
    this.navOpen = !this.navOpen
  }

  logout() {
    let ipAddress = localStorage.getItem('ipAddress')
    let userId = localStorage.getItem('truck_userId')
    let source = localStorage.getItem('source')
    let logoutDate = new Date()

    let logoutHistory = { ipAddress: ipAddress, userId: userId, source: source, logoutDate: logoutDate }
    this._generalService.userLogOut(logoutHistory).subscribe(
      async (result) => {
        this.chatService.leaveConversation(this.userInfo.userInfo._id)
        await this.translate.setDefaultLang('en')
        localStorage.clear()
        localStorage.removeItem('userToken')
        localStorage.removeItem('truckStorage')
        localStorage.removeItem('planName')
        this.router.navigate(['/login'])
        this.sharedService.setHeader({})
        this.sharedService.setPath('')
      },
      () => {
        localStorage.clear()
        this.sharedService.setHeader({})
        this.sharedService.setPath('')
        this.router.navigate(['/login'])
      }
    )
  }

  routePages(data) {
    switch (data.module) {
      case 'JOB':
        this.router.navigate([`/layout/myaccount/jobs/applicant-list/${data.type_id}`])
        break
      case 'EVENT':
        if (data.type == 'COMPANYEVENT') this.router.navigate([`/layout/myaccount/event-management/view-event/${data.type_id}`])
        else this.router.navigate([`/pages/event-details/${data.type_id}`])
        break
      case 'TRIP':
        this.router.navigate([`/layout/myaccount/trip-planner/trip-details/${data.type_id}`])
        break
      case 'ECOMMERCE':
        if (data.type === 'USER') this.router.navigate([`/pages/e-commerce/product-view/${data.type_id}`])
        else this.router.navigate([`/layout/e-commerce/answer-question/${data.type_id}`])
        break
      case 'ECOMMERCE':
        if (data.type === 'USER') this.router.navigate([`/pages/e-commerce/product-view/${data.type_id}`])
        else this.router.navigate([`/layout/e-commerce/answer-question/${data.type_id}`])
        break
      case 'NETWORK':
        if (data.type === 'SENDINVITATION') this.router.navigate([`/layout/social-media`])
        else if (data.type === 'LIKEADDED' || data.type === 'COMMENTADDED') this.router.navigate([`/layout/myaccount/dashboard/`])
        break
        case 'MY NETWORK':
          if (data.type === 'COMMENTADDED') this.dialog.open(SliderImgComponent, { width: '1200px',height:'auto', panelClass: 'my-dialog-creat-post',  data: { postId: data.type_id, userId: this.loggedIn,media:false } })
          else if (data.type === 'LIKEADDED')this.dialog.open(SliderImgComponent, { width: '1200px',height:'auto', panelClass: 'my-dialog-creat-post',  data: { postId: data.type_id, userId: this.loggedIn,media:false } })
          else if (data.type === 'SHARED')this.dialog.open(SliderImgComponent, { width: '1200px',height:'auto', panelClass: 'my-dialog-creat-post',  data: { postId: data.type_id, userId: this.loggedIn,media:false } })
          else if(data.type=='ACCEPTINVITATION') this.router.navigate([`/layout/social-media/connection-profileview/${data.sender}`])
          else if(data.type=='SENDINVITATION') this.router.navigate([`/layout/social-media`])
        break
    }
  }

  reDirect(item) {
    if (item.isReaded === false) {
      let data = { notification_id: item._id, reader_id: this.userInfo.userInfo._id }
      this._generalService.NotificationsRead(data).subscribe((res) => {
        if (res) {
          this.notificationCount--
          this.notificationsLists = this.notificationsLists.filter((e) => e._id != item._id)
          this.routePages(item)
        }
      })
    } else this.routePages(item)
  }
  showSubsPopUp() {
    this.dialog.open(LoginDialogComponent, { width: '500px', data: 'PLANFEATURE' })
  }

  gpsPlan() {
    let servicesPlanInfo = this.userPlanData.filter((planDtl) => planDtl.plan == 'GPS')
    if (!servicesPlanInfo.length) this.dialog.open(PlanConfirmationDialogComponent, { width: '550px', data: 'GPS' })
    else this.router.navigate(['/layout/gps'])
  }

  getCompany() {
    let data = { companyId: this.userInfo.userInfo._id }
    this._generalService.getCompanyDetails(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.userName = response['data'].companyName
        this.useLanguage(response['data'].defaultLanguage)
      } else this.toatsr.warning('', response['message'])
    })
  }

  getUserProfileDetails() {
    let data = { endUserId: this.userInfo.userInfo._id }
    this._generalService.getEndUserDetails(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.userName = response['data'].personName
        this.useLanguage(response['data'].defaultLanguage)
      } else this.toatsr.warning('', response['message'])
    })
  }

  getSeller() {
    let data = { userId: this.userInfo.userInfo._id }
    this._generalService.getSellerDetails(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.sellerData = response['data'].personName
        this.useLanguage(response['data'].defaultLanguage)
      } else this.toatsr.warning('', response['message'])
    })
  }

  readNotification(item) {
    if (item.isReaded === false) {
      let data = { notification_id: item._id, reader_id: this.userInfo.userInfo._id }
      this._generalService.NotificationsRead(data).subscribe((res) => this.routePages(item))
    } else this.routePages(item)
  }

  logOutSeller() {
    let ipAddress = localStorage.getItem('ipAddress')
    let userId = localStorage.getItem('truck_userId')
    let source = localStorage.getItem('source')
    let logoutDate = new Date()

    let logoutHistory = { ipAddress: ipAddress, userId: userId, source: source, logoutDate: logoutDate }
    this._generalService.userLogOut(logoutHistory).subscribe((result) => {
      localStorage.clear()
      localStorage.removeItem('userToken')
      localStorage.removeItem('truckStorage')
      localStorage.removeItem('planName')
      this.router.navigate(['/login'])
    })
  }

// -----------------------------------------    FOR HEADER END       --------------------------------------------------------------------------------------------------------
  
ngOnDestroy() {
    this.chat.nextMessage({})
  }

  getChatData(data) {
    // console.log(data,"------------------",this.selectedUserForChatId)
    switch (data['code']) {
      case genralConfig.chatCodes.success:
        let apiObj = {
          sender_id: data.data.sender_id,
          message_id: data.data.message_id,
          nowTime: moment(new Date()).utc(),
          loggedInUser: this.userInfo.userInfo._id,
          conversation_id: data.data.conversation_id,
          conversationType: data.data.conversationType,
          roleTitle: this.userInfo.userInfo.roleId.roleTitle,
          convOpened: data.data.conversation_id == this.selectedUserForChatId ? true : false,
        }
        this.genralServices.getSpecificMsgData(apiObj).subscribe(
          (res) => {
            if (res['code'] == genralConfig.statusCode.ok) {

              if (res['data'].conversation_id && res['data'].conversation_id == this.selectedUserForChatId) {
                
                this.chatMessageList.push(res['data'].lastMessages[0])
                this.chatMessageList.length > 10 && setTimeout(() => this.scrollel.scroll({ top: 10000, behavior: 'smooth' }), 200)
                this.changeMessage(res['data'])
              } else if (res['data'].conversation_id != this.selectedUserForChatId && res['data'].type == this.type) {
                
                this.selectedUserForChat_id = res['data'].sender_id

                this.changeMessage(res['data'])
              }
              else {
                switch (res['data'].type) {
                  case genralConfig.chatTypes.IND:
                    this.directUnread = true
                    break
                  case genralConfig.chatTypes.GRP:
                    this.groupUnread = true
                    break
                  case genralConfig.chatTypes.SEL:
                    this.sellerUnread = true
                    break
                }
              }
            }
          },
          () => this.toastr.warning(genralConfig.messages.apiError)
        )
        break
      case genralConfig.chatCodes.isAdminOnly:
        this.onlyAdminCanMessage = true
        break
      case genralConfig.chatCodes.isBlocked:
        this.selectedUserForChat['isBlocked'] = true
        break
      case genralConfig.chatCodes.isNotMember:
        this.isNotMember = true
        break
    }
  }

  changeMessage(chatDate) {
    if(chatDate.conversation_id !=this.selectedUserForChatId){
      
      this.notificationBox = new Notification("New Message", {
        body: "You receive message ",
      })
    }
    this.chatList = this.chatList.filter((el) => el.conversation_id != chatDate.conversation_id)
    this.chatList.unshift(chatDate)
  }

  onScrollDownChatList() {
    if (this.pageChatList < this.totalPagesChatList) {
      let pageToSend = this.pageChatList + 1
      this.getChatList(pageToSend)
    }
  }

  onScrollUpMessages() {
    if (this.pageMessages < this.totalPagesMessages) {
      let pageToSend = this.pageMessages + 1
      this.getChatMessages(pageToSend)
    }
  }

  chatTabChange(event) {

    this.term.setValue(null)
    this.selectedUserForChatId = null
    this.uploadedAttachment = ''
    if(this.accessLevel=='COMPANY' || this.accessLevel=='ENDUSER' || this.accessLevel=='DRIVER'){
      switch (event.index) {
        case 0:
          this.type = genralConfig.chatTypes.IND
          this.directUnread = false
          break
        case 1:
          this.type = genralConfig.chatTypes.SEL
          this.groupUnread = false
          break
        case 2:
          this.type = genralConfig.chatTypes.GRP
          this.groupUnread = false
          break
      }
       } 
    if(this.accessLevel=='SELLER'){
      switch (event.index) {
           case 0:
             this.type = genralConfig.chatTypes.IND
             this.directUnread = false
             break
            case 1:
              this.type = genralConfig.chatTypes.SEL
              this.groupUnread = false
              break
         }
       }  
    if(this.accessLevel=='SALESPERSON'){
    switch (event.index) {
      case 0:
        this.type = genralConfig.chatTypes.IND
        this.directUnread = false
        break
      case 1:
        this.type = genralConfig.chatTypes.SEL
        this.groupUnread = false
        break
      case 2:
        this.type = genralConfig.chatTypes.GRP
        this.groupUnread = false
        break
    }
  }
  if(this.accessLevel=='HR'){
    switch (event.index) {
      case 0:
        this.type = genralConfig.chatTypes.IND
        this.directUnread = false
        break
      case 1:
        this.type = genralConfig.chatTypes.GRP
        this.groupUnread = false
        break
    }
  }
  if(this.accessLevel=='DISPATCHER' ){
    switch (event.index) {
      case 0:
        this.type = genralConfig.chatTypes.IND
        this.directUnread = false
        break
     
    }
  }

  
    this.chatList = []
    this.getChatList(1)
  }

  getChatList(pageNumber) {
   
    !this.term.value && this.spinner.show()
    let data = { searchText: this.term ? this.term.value : '', roleTitle: this.roleName, loggedInUser: this.userInfo.userInfo._id, type: this.type, page: pageNumber, count: 20 }
    pageNumber == 1 && (this.chatList = [])
    this.genralServices.getChatList(data).subscribe(
      (res) => {
        this.totalCountChatList = res['totalCount']
        if (res['code'] == genralConfig.statusCode.ok){
           this.chatList = res['data']
           
           
           this.selectedUserForChat_id=res['data'].userId
          }
        else this.chatList = []
        this.pageChatList = pageNumber
        
        this.totalPagesChatList = Math.ceil(this.totalCountChatList / 20)
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.error(genralConfig.messages.apiError)
      }
    )
  }

  getChat(user, index) {
    user.userId=this.selectedUserForChat_id
    this.message = ''
    if (this.selectedUserForChatId != user.conversation_id) {
      
      this.selectedUserForChat = user
      this.selectedUserForChatTotalMembers = user.totalMember
      this.selectedUserForChatImage = user.image
      this.selectedUserForChatName = user.name
      this.selectedUserForChatId = user.conversation_id
      this.selectedUserForChat_id = user.userId
      this.typeToSend = user.type
      this.chatList[index].unReadMsg = 0
      this.getChatMessages(1)

      
    }
  }

  groupDetails() {
   
    if (this.typeToSend == 'GROUP') {
      this.dialog
        .open(ChatDetailComponent, { width: '800px', height: '690px', disableClose: true, data: { groupId: this.selectedUserForChatId } })
        .afterClosed()
        .subscribe((res) => {
          if (res && res.action == 'REMOVE') {
            let index = this.chatList.findIndex((el) => el.conversation_id == res.conversation_id)
            this.chatList.splice(index, 1)
            this.selectedUserForChatId = null
          }
          if (res.conversationId == this.selectedUserForChatId) {
            this.selectedUserForChatTotalMembers = res.membersCount
          }
          if (res) {
            let index = this.chatList.findIndex((el) => el.conversation_id == this.selectedUserForChatId)
            if (this.typeToSend == 'GROUP') {
              this.chatList[index].name = res.name
              this.chatList[index].image = res.image
              this.chatList[index].totalMember = res.membersCount
              if (res.conversationId == this.selectedUserForChatId) {
                this.selectedUserForChatName = res.name
                this.selectedUserForChatImage = res.image
              }
            }
          }
        })
    }
  }

  sendMessage() {
    if (this.message.trim().length != 0 || this.uploadedAttachment) {
      let data = {
        document: this.uploadedAttachment ? [this.uploadedAttachment] : [],
        loggedInUser: this.userInfo.userInfo._id,
        conversation_id: this.selectedUserForChatId,
        message: this.message.trim(),
        conversationType: this.typeToSend,
        type: 'TEXT',
        nowTime: moment(new Date()).utc(),
      }

      this.chat.sendMessage(data)
      this.message = ''
      this.uploadedAttachment = ''
    }
  }

  getTime(date) {
    if (moment(new Date()).format('YYYY-MM-DD') == moment(new Date(date)).format('YYYY-MM-DD')) return moment(date).format('hh:mm a')
    else return moment(new Date(date)).format('DD-MMM-YYYY')
  }

  getTimeChat(date) {
    return moment(new Date(date)).format('hh:mm a')
  }

  matchTime(currentTime, prevousTime) {
    if (moment(currentTime).format('YYYY-MM-DD') == moment(prevousTime).format('YYYY-MM-DD')) return ''
    else return moment(currentTime).format('ll')
  }

  getChatMessages(pageNumber) {
  
    let data = {
      loggedInUser: this.userInfo.userInfo._id,
      page: pageNumber,
      count: 40,
      clinic_id: this.userInfo.userId,
      conversationType: this.typeToSend,
      conversation_id: this.selectedUserForChatId,
      nowTime: moment(new Date()).utc(),
    }
    pageNumber == 1 && (this.chatMessageList = [])
    this.spinner.show()
    this.genralServices.getChatMessages(data).subscribe(
      (res) => {
        this.totalCountMessages = res['totalCount']
        if (res['code'] == genralConfig.statusCode.ok) {
          this.spinner.hide()
          this.chatMessageList.unshift(...res['data'].messagesData.allMessages)
          this.onlyAdminCanMessage = res['data'].onlyAdminCanMessage
          this.isAdmin = res['data'].isAdmin

          this.selectedUserForChat_id=res['data'].addedby_id
           
          this.pageMessages = pageNumber
          this.totalPagesMessages = Math.ceil(this.totalCountMessages / 50)
          if (pageNumber == 1) {
            this.scrollel = document.getElementById('chatMsgScreen')
            this.chatMessageList.length > 10 && setTimeout(() => this.scrollel.scroll({ top: 10000, behavior: 'smooth' }), 200)
          }

        }
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.error(genralConfig.messages.apiError)
      }
    )
  }

  deleteMessages() {
    let data = { loggedInUser: this.userInfo.userInfo._id, conversation_id: this.selectedUserForChatId, nowTime: moment(new Date()).utc() }
    this.spinner.show()
    this.genralServices.deleteMessages(data).subscribe(
      (res) => {
        if (res['code'] == genralConfig.statusCode.ok) {
          this.chatList = this.chatList.filter((el) => el.conversation_id != this.selectedUserForChatId)
          this.chatMessageList = []
          this.clearSelection()
        } else this.toastr.warning(res['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.error(genralConfig.messages.apiError)
      }
    )
  }

  fileClick(event) {}

  leaveOrRemoveFromGroup() {
    let data = { nowTime: moment(new Date()).utc(), member_id: this.userInfo.userInfo._id, loggedInUser: this.userInfo.userInfo._id, conversation_id: this.selectedUserForChatId }
    this.genralServices.leaveOrRemoveFromGroup(data).subscribe(
      (res) => {
        if (res['code'] == genralConfig.statusCode.ok) {
          this.chatList = this.chatList.filter((el) => el.conversation_id != this.selectedUserForChatId)
          this.clearSelection()
        } else this.toastr.warning(res['message'])
      },
      () => this.toastr.error(genralConfig.messages.apiError)
    )
  }

  clearSelection() {
    this.selectedUserForChat = ''
    this.selectedUserForChatId = ''
    this.selectedUserForChatImage = ''
    this.selectedUserForChatName = ''
    this.selectedUserForChatTotalMembers = ''
  }

  pickedEmoji(event) {
    this.message += event.char
  }

  isActive(item) {
    return this.selectedUserForChatId == item
  }

  addUserToChat(type) {
    console.log(type,"111111111111");
    
    let width = ''
    type == 'GROUP' ? (width = '800px') : (width = '500px')
    this.dialog
      .open(AddUserToChatComponent, { width: width, panelClass: 'cus-add-user-chat', data: { type: type } })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          let newChat = res
          let isOld = false
          this.chatList.length && this.chatList.forEach((el) => el.conversation_id == newChat.conversation_id && (isOld = true))
          newChat.conversation_id != this.selectedUserForChatId && (this.chatMessageList = [])
          this.typeToSend = type
          this.type = type
         
          this.selectedUserForChat = newChat
          this.selectedUserForChatTotalMembers = newChat.totalMember
          this.selectedUserForChatName = newChat.name
          this.selectedUserForChatImage = newChat.image
          this.selectedUserForChatId = newChat.conversation_id
          if (!isOld) this.chatList.unshift(newChat)
          if (res.lastMessages.length) this.getChatMessages(1)
        }
      })
  }

  blockUser(action) {
    this.spinner.show()
    let data = { loggedInUser: this.userInfo.userInfo._id, conversation_id: this.selectedUserForChatId, nowTime: moment(new Date()).utc(), action: action }
    this.genralServices.blockUser(data).subscribe(
      (res) => {
        if (res['code'] == genralConfig.statusCode.ok) {
          this.chatList.forEach((el) => el.conversation == this.selectedUserForChatId && (el.isBlocked = action == 'BLOCK' ? true : false))
          this.selectedUserForChat['isBlocked'] = action == 'BLOCK' ? true : false
          this.toastr.success(res['message'])
        } else this.toastr.warning(res['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.error(genralConfig.messages.apiError)
      }
    )
  }

  startNewConversation() {
    let data = {
      name: this.sellerData.name,
      image: '',
      loggedInUser: this.userInfo.userInfo._id,
      membersArr: [this.sellerData.id],
      nowTime: moment(new Date()).utc(),
      type: this.type,
    }
    this.spinner.show()
    this.genralServices.startNewConversation(data).subscribe(
      (res) => {
        if (res.code == 200) {
          let newChat = res['data']
          let isOld = false
          this.chatList.length && this.chatList.forEach((el) => el.conversation_id == newChat.conversation_id && (isOld = true))
          newChat.conversation_id != this.selectedUserForChatId && (this.chatMessageList = [])
          if (!isOld) {
            this.chatList.unshift(newChat)
            this.selectedUserForChat = newChat
            this.typeToSend = this.type
            this.type = this.type
            this.selectedUserForChatTotalMembers = newChat.totalMember
            this.selectedUserForChatImage = newChat.image
            this.selectedUserForChatName = newChat.name
            this.selectedUserForChatId = newChat.conversation_id
          } else {
            this.typeToSend = this.type
            this.type = this.type
            this.selectedUserForChat = newChat
            this.selectedUserForChatTotalMembers = newChat.totalMember
            this.selectedUserForChatName = newChat.name
            this.selectedUserForChatImage = newChat.image
            this.selectedUserForChatId = newChat.conversation_id
            this.getChatMessages(1)
            this.chat.joinNewConversation()
          }
        } else this.toastr.warning(res['message'])
        this.spinner.hide()
        this.membersArr = []
      },
      () => {
        this.spinner.hide()
        this.toastr.error('Something went wrong')
        this.membersArr = []
      }
    )

    localStorage.removeItem('chatSellerData')
  }

  //link generate to give rating to seller
  generateLink() {

    console.log(this.selectedUserForChat_id,"this.selectedUserForChat_id");
    
    
    let data = { sellerId: this.userInfo.userInfo._id, userId: this.selectedUserForChat_id, path: '/pages/e-commerce/rating' }
  
    
    this.genralServices.ratingTokenGererate(data).subscribe((res) => {
      if (res['code'] == 200) {
        // let linkurl = window.location.origin
        let linkurl =this.urls 

        
        this.message = linkurl + res['data'].urlPath
        this.toastr.success('Link generated successfully')
      } else this.toastr.success('error generating link')
    })
  }

  // uploadDocument(fileInput) {
  //   const fileData = <File>fileInput.target.files[0]
  //   if (!genralConfig.chatDocumentExtension.includes(fileData.type)) return this.toastr.warning('only pdf , jpeg and png are allowed')
  //   if (fileData.size > 5000000) return this.toastr.warning('Please upload file less than 5 MB')
  //   const formData = new FormData()
  //   formData.append('type', 'CHAT')
  //   formData.append('file', fileData)
  //   this.spinner.show()
  //   this.genralServices.uploadChatAttachment(formData).subscribe(
  //     (res) => {
  //       if (res['code'] == genralConfig.statusCode.ok) this.uploadedAttachment = res['data']
  //       else this.toastr.warning(res['message'])
  //       this.spinner.hide()
  //     },
  //     () => {
  //       this.spinner.hide()
  //       this.toastr.error('Something went wrong')
  //     }
  //   )
  // }

  deleteDocument(file) {
    let data = { file: file, filePath: '../truck-backend/uploads/chatImages/' }
    this.spinner.show()
    this.genralServices.deleteChatDocument(data).subscribe(
      (res) => {
        if (res['code'] == genralConfig.statusCode.ok) this.uploadedAttachment = ''
        else this.toastr.warning(res['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.error('Something went wrong')
      }
    )
  }
  downlaodDocument(file) {
    const link = document.createElement('a')
    link.setAttribute('target', '_blank')
    link.setAttribute('href', `${this.uploadedDocRoute}${file}`)
    link.setAttribute('download', `${file}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  uploadS3File(event) {
    let imgExtType= event.target.files[0].name.split('.').pop()
    if(event.target.files.length==1){
      // if (imgExtType =='pdf' || imgExtType =='jpeg' || imgExtType =='png') this.filesForS3 = event.target.files 
      if (imgExtType =='pdf' || imgExtType =='jpeg' || imgExtType =='png') this.filesForS3={newS3Files:event.target.files}
      else return this.toastr.warning('Only pdf, jpeg and png file is allowed')
    }else return this.toastr.warning('Please selelct only 1 image')

  }

  showS3FileData(val:any){
    this.uploadedAttachment = val[0].name.split('/').pop()

  }
}
