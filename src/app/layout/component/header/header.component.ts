import { Component, OnInit, HostListener } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { SharedService } from 'src/app/service/shared.service'
import { environment } from 'src/environments/environment'
import { SocketService } from 'src/app/chat_files/socket-service/socket.service'
import { ChatService } from 'src/app/chat_files/socket-service/chat.service'
import { MatDialog } from '@angular/material'
import { LoginDialogComponent } from 'src/app/pages/login-dialog/login-dialog.component'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
import { PlanConfirmationDialogComponent } from 'src/app/plan-confirmation-dialog/plan-confirmation-dialog.component'
import { SliderImgComponent } from 'src/app/slider-img/slider-img.component'
import { NgxSpinnerService } from 'ngx-spinner'
import { Console } from 'console'



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userName: any = ''
  userPlanData: any
  personName: any

  // @HostListener('window:storage')
  // onStorageChange() {
  //   let userInfo = JSON.parse(localStorage.getItem('truckStorage'))

  //   if (!userInfo) {
  //     window.location.reload()
  //   }
  // }

  // @HostListener('window:beforeunload', ['$event'])
  // userDisconnectedUser($event: any) {
  //   if (true) {
  //   }
  // }

  navOpen: boolean = false
  userInfo: any
  ROLETITLE: any
  notificationsLists: any
  notList: any
  loggedIn: any
  receiverImage: any
  // socket:any;

  public endUser = environment.URLHOST + '/uploads/enduser/'
  totalCount: number = 0
  notificationCount: number = 0
  notificationPermission: any
  notificationBox: Notification
  accessLevel: any
  sellerData: string
  firstName:any
  lastName:any
  constructor(
    private translate: TranslateService,
    private toatsr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private chatService: ChatService,
    private sharedService: SharedService,
    private _generalService: GeneralServiceService,
    private SocketService: SocketService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,

  ) {
    translate.addLangs(['en', 'pa', 'es'])
  }

  ngOnInit() {
    // window.addEventListener("offline",()=>{
    //   this.toatsr.warning("You are offline")
    // })

    this.userInfo = JSON.parse(localStorage.getItem('truckStorage'))
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
  }

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
  routeMyCard() {
    this.router.navigate(['/layout/myaccount/card'])
  }
  routeMyinstallment(){
    this.router.navigate(['/layout/myaccount/installments'])

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

  // Navigation Menu for Company
  navigationCompanyMenu = [
    { navimg: 'fal for-hov fa-home', navlink: '/layout/myaccount/dashboard', navitem: 'Home' },
    { navimg: 'far for-hov fa-comment', navlink: '/chat-window', navitem: 'Chat' },
    { navimg: 'fal for-hov fa-briefcase', navlink: '/layout/myaccount/jobs', navitem: 'Jobs' },
    { navimg: 'fal fa-chart-network', navlink: '/layout/social-media', navitem: 'My Network' },
    // { navimg: 'far for-hov fa-comment', navlink: '/chat-window', navitem: 'Chat' },
  ]
  // Navigation Menu for User and Driver
  navigationUserMenu = [
    { navimg: 'fal for-hov fa-home', navlink: '/layout/myaccount/dashboard', navitem: 'Home', showPopUp: false },
    { navimg: 'far for-hov fa-comment', navlink: '/chat-window', navitem: 'Chat', showPopUp: false },
    { navimg: 'fal fa-chart-network', navlink: '/layout/social-media', navitem: 'My Network', showPopUp: false },
    { navimg: 'fal for-hov fa-briefcase', navlink: '/pages/search-job/jobs', navitem: 'Jobs', showPopUp: true },
    { navimg: 'fal fa-calendar-alt', navlink: '/pages/events', navitem: 'Events', showPopUp: true },
  ]
  // Navigation Menu for Company for mobile
  navigationMobileCompanyMenu = [
    { navimg: 'fal for-hov fa-home', navlink: '/layout/myaccount/dashboard', navitem: 'Home' },
    { navimg: 'far for-hov fa-comment', navlink: '/chat-window', navitem: 'Chat' },
    { navimg: 'fal for-hov fa-briefcase', navlink: '/layout/myaccount/jobs', navitem: 'Jobs' },
    { navimg: 'fal fa-chart-network', navlink: '/layout/social-media', navitem: 'My Network' },
    { navimg: 'fal fa-calendar-alt pl-2', navlink: '/layout/myaccount/event-management', navitem: 'Events' },
    { navimg: 'fal fa-truck-container', navlink: '/layout/myaccount/trip-planner', navitem: 'Trip Planner' },
    { navimg: 'fal fa-bags-shopping ', navlink: 'wish-list', navitem: 'Wishlist' },
    { navimg: 'fal fa-truck', navlink: '/layout/myaccount/manage-truck', navitem: 'Fleet manager' },
    { navimg: 'fal fa-users-medical', navlink: '/layout/myaccount/team-manager', navitem: 'Manage Team' },
    { navimg: 'fal fa-tools', navlink: '/layout/myaccount/service', navitem: 'Services' },
  ]
  // Navigation Menu for User and Driver for mobile
  navigationMobileUserMenu = [
    { navimg: 'fal for-hov fa-home', navlink: '/layout/myaccount/dashboard', navitem: 'Home' },
    { navimg: 'fal fa-chart-network', navlink: '../chat-window', navitem: 'chat' },
    { navimg: 'fal fa-chart-network', navlink: '/layout/social-media', navitem: 'My Network' },
    { navimg: 'fal fa-calendar-alt', navlink: 'my-event', navitem: 'My Events' },
    { navimg: 'fal for-hov fa-briefcase', navlink: 'my-jobs', navitem: 'My Jobs' },
    { navimg: 'fal fa-bags-shopping', navlink: 'wish-list', navitem: 'Wishlist' },
    { navimg: 'fal for-hov fa-briefcase', navlink: '/pages/search-job/jobs', navitem: 'Jobs', showPopUp: true },
    { navimg: 'fal fa-calendar-alt', navlink: '/pages/events', navitem: 'Events', showPopUp: true },
    { navimg: 'fal fa-truck-container', navlink: '/layout/myaccount/trip-planner', navitem: 'Trip Planner', showPopUp: true },
    { navimg: 'fal fa-tools', navlink: '/layout/myaccount/service', navitem: 'Services', showPopUp: true },

    // { navimg: 'fal for-hov fa-briefcase', navlink: '/layout/driver/planned-trip', navitem: 'Trip Detail' },
  ]
  navigationHrMenu = [
    { navimg: 'fal for-hov fa-home', navlink: '/layout/myaccount/dashboard', navitem: 'Home' },
    { navimg: 'fal fa-users-medical', navlink: '/layout/myaccount/team-manager', navitem: 'Manage Team' },
    { navimg: 'far for-hov fa-comment', navlink: '/chat-window', navitem: 'Chat' },
  ]
  navigationDispatcherMenu = [
    { navimg: 'fal fa-tools', navlink: '/pages/services', navitem: 'Service' },
    // { navimg: 'far for-hov fa-comment', navlink: '/chat-window', navitem: 'Chat' },   //  changes  by shivam kashyap 08/123/2022
  ]

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
          if (data.type === 'COMMENTADDED') this.openPost(data.type_id,this.loggedIn)
          else if (data.type === 'LIKEADDED') this.openPost(data.type_id,this.loggedIn)
          else if (data.type === 'SHARED') this.openPost(data.type_id,this.loggedIn)
          else if(data.type=='ACCEPTINVITATION') this.router.navigate([`/layout/social-media/connection-profileview/${data.sender}`])
          else if(data.type=='SENDINVITATION') this.router.navigate([`/layout/social-media`])
        break
    }
  }

  openPost(postId,loggedIn) {
    
      this.spinner.show()
      let data = { postId: postId, userId: loggedIn }
      this._generalService.PostsList(data).subscribe(
        (response) => {
          if (response['code'] == '200') {
            let allData = response['data']
            this.spinner.hide()
            const dialogRef = this.dialog.open(SliderImgComponent, { width: '1200px', height: '600px', panelClass: 'my-dialog-creat-post', data: { media: true, allData: allData } })
            dialogRef.afterClosed().subscribe((result) => {
            })
            this.spinner.hide()
          }
        },
        () => {
          this.spinner.hide()
          this.toastr.warning('Server Error')
        }
      )
  
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


}
