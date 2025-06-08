import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { SocketService } from 'src/app/chat_files/socket-service/socket.service'
import { SharedService } from 'src/app/service/shared.service'
import { TranslateService } from '@ngx-translate/core'
import { ChatService } from 'src/app/chat_files/socket-service/chat.service'

@Component({
  selector: 'app-e-commerce-header',
  templateUrl: './e-commerce-header.component.html',
  styleUrls: ['./e-commerce-header.component.css'],
})
export class ECommerceHeaderComponent implements OnInit {
  userObj: any
  userId: any
  sellerData: any
  show: boolean = true
  nextRole: any
  toggleValue: 'true'
  profileComplete: any
  notificationsLists = []
  totalCount: any
  endUser: any
  page: any = 1
  notificationBox: Notification
  ROLETITLE = ''

  constructor(
    private router: Router,
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private SocketService: SocketService,
    private SharedService: SharedService,
    private translate: TranslateService,
    private chatService: ChatService
  ) {}
  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    if (this.userId) this.SocketService.initSocket(this.userId)
    this.userId && this.chatService.joinConversation(this.userId)
    this.ROLETITLE = this.userObj.userInfo.roleId.roleTitle
    this.profileComplete = this.userObj.userInfo.profileComplete
    this.getSeller()
    if (this.userObj['userInfo'].multiRole.length > 1) this.show = false
    this.getNotificationsList(1)
    this.notifyUser()

    this.SharedService.getNotification().subscribe((res) => {
      if (res && res['info']) {
        this.totalCount--
        this.notificationsLists = this.notificationsLists.filter((item) => item._id != res['info']._id)
      } else if (res && res['readAll'] == true) {
        this.totalCount = 0
        this.notificationsLists = []
      }
    })
  }

  useLanguage(language: string) {
    this.translate.use(language || 'en')
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

  clicked(event) {
    document.getElementsByTagName('BODY')[0].classList.toggle('open-close-sidemenu')
  }
  getSeller() {
    let data = { userId: this.userObj.userInfo._id }
    this.spinner.show()
    this._generalService.getSellerDetails(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.sellerData = response['data'].personName
        this.useLanguage(response['data'].defaultLanguage)
      } else this.toastr.warning('', response['message'])
      this.spinner.hide()
    })
  }
  toggleBtn(event) {
    document.getElementsByTagName('BODY')[0].classList.toggle('open-close-sidemenu')
  }
  changeEvent(event) {
    if (!event) {
      for (let role of this.userObj.multipleRole) {
        if (role.roleTitle != 'SELLER') this.nextRole = role.roleTitle
      }
      let data = { oldRoleId: this.userObj.userInfo.roleId._id, userId: this.userObj.userInfo._id, roleTitle: this.nextRole }
      this.spinner.show()
      this._generalService.changeRole(data).subscribe(
        (res) => {
          if (res['code'] == 200) {
            localStorage.clear()
            localStorage.setItem('truckStorage', JSON.stringify(res['data']))
            this.router.navigate(['/layout/myaccount/dashboard'])
          }
          this.spinner.hide()
        },
        () => {
          this.spinner.hide()
          this.toastr.error('server error')
        }
      )
    }
  }

  getNotificationsList(pagenumber) {
    this.notificationsLists = []
    window.scroll(0, 0)
    let data = { receiver: this.userId, page: pagenumber, accessLevel: this.userObj.userInfo.accessLevel, isReaded: false, role: 'ECOMMERCE' }
    this._generalService.getNotificationsLists(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.page = pagenumber
          this.notificationsLists = response['data']
          this.totalCount = response['totalCount']
        } else {
          this.totalCount = []
          this.page = 1
          this.notificationsLists = []
        }
      },
      () => {
        this.spinner.hide()
        this.toastr.error('server error')
      }
    )
  }

  notifyUser() {
    this.SocketService.getNotfication().subscribe((res) => {
      if (res && res.module === 'ECOMMERCE' && this.ROLETITLE === 'SELLER') {
        this.NotificationCheak(res)
        this.getNotificationsList(1)
      }
    })
  }

  NotificationCheak(data) {
    this.notificationBox = new Notification(data.title, { body: data.message })
    this.notificationBox.addEventListener('click', () => {
      if (data.module == 'ECOMMERCE') {
        if (data.type === 'USER') this.router.navigate([`/pages/e-commerce/product-view/${data.type_id}`])
        else this.router.navigate([`/layout/e-commerce/answer-question/${data.type_id}`])
      }
      setTimeout(() => this.notificationBox.close(), 3000)
    })
  }

  readNotification(item) {
    if (item.isReaded === false) {
      let data = { notification_id: item._id, reader_id: this.userId }
      this._generalService.NotificationsRead(data).subscribe((res) => this.routePages(item))
    } else this.routePages(item)
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
    }
  }

  routeMyCard() {
    this.router.navigate(['/layout/myaccount/card'])
  }
  routeMyinstallment(){
    this.router.navigate(['/layout/e-commerce/installmentList'])

  }
}
