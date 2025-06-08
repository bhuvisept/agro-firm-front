import { Component, HostListener, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { SharedService } from 'src/app/service/shared.service'
import { ToastrService } from 'ngx-toastr'
import { LoginDialogComponent } from 'src/app/pages/login-dialog/login-dialog.component'
import { MatDialog } from '@angular/material'
import { TranslateService } from '@ngx-translate/core'
import { SocketService } from 'src/app/chat_files/socket-service/socket.service'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isSalesperson: boolean
  paymentToken: any
  // @HostListener('window:storage')
  // onStorageChange() {
  //   let userData = JSON.parse(localStorage.getItem('truckStorage'))

  //   if (userData == undefined) {
  //     window.location.reload()
  //   }
  // }

  navOpen: boolean = false
  userId: String = ''
  userName: any
  userData: any
  isChecked: boolean = false
  isSeller: boolean = false
  isHR: boolean = false
  isDispatcher: boolean = false
  // loggedIn: boolean
  loggedOut: boolean = false
  user: any
  checkProfileStatus: any
  planSetKey: any
  loggedIn: any

  notificationBox: Notification
  public endUser = environment.URLHOST + '/uploads/enduser/'

  constructor(
    private translate: TranslateService,
    private SocketService: SocketService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private router: Router,
    private _generalService: GeneralServiceService
  ) {
    translate.setDefaultLang('en')
    translate.addLangs(['en', 'pa', 'es'])
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('truckStorage'))
    if (this.userData && this.userData.userInfo.roleId.roleTitle == 'COMPANY') {
      this.getCompany()
      this.isChecked = true
    } else if (this.userData && this.userData.userInfo.roleId.roleTitle == 'ENDUSER') {
      this.getUserProfileDetails()
      this.isChecked = false
    }
    if (this.userData) {
      this.loggedIn = this.userData.userInfo._id
      this.user = this.userData.userInfo.roleId.roleTitle
      this.checkProfileStatus = this.userData.userInfo.profileComplete
      this.paymentToken = this.userData.userInfo.paymentToken
      this.SocketService.initSocket(this.loggedIn)
      if (this.userData.userInfo.roleId.roleTitle != 'SELLER') {
        this.notifyUser()
        // this.removeMarketSocket()
      }
    }

    if (this.userData && this.userData.userInfo.roleId.roleTitle == 'SELLER') {
      this.isSeller = true
    }
    if (this.userData && this.userData.userInfo.accessLevel == 'HR') {
      this.isHR = true
    }
    if (this.userData && this.userData.userInfo.accessLevel == 'DISPATCHER') {
      this.isDispatcher = true
    }
    if (this.userData && this.userData.userInfo.accessLevel == 'SALESPERSON') {
      this.isSalesperson = true
    }

    if (this.userData && this.userData.userInfo._id) {
      this.loggedOut = true
    } else {
      this.loggedOut = false
    }

    this.sharedService.getHeader().subscribe((res: any) => {
      this.userData = JSON.parse(localStorage.getItem('truckStorage'))
      if (res && res.userId && res.email) {
        this.userId = res.userId
        this.userName = res.firstName
        // this.planSetKey = res.planKey.planSelectKey
      } else {
      }
    })

    window.addEventListener('offline', () => {
      this.toastr.error('your internet connection was revoked')
    })
  }

  useLanguage(lang) {
    this.translate.setDefaultLang(lang || 'en')
  }

  goToTrip() {
    if (this.user && this.isChecked && this.checkProfileStatus && !this.paymentToken) {
      this.router.navigate(['/layout/myaccount/trip-planner'])
    } else if (this.user && this.isChecked && this.checkProfileStatus && this.paymentToken) {
      this.router.navigate(['/payment'])
    } else if (this.user && this.isChecked && !this.checkProfileStatus) {
      this.router.navigate(['/set-profile'])
    } else {
      this.router.navigate(['/signup/company-signup'])
      // this.dialog.open(LoginDialogComponent, {
      //   width: '500px',
      //   data: 'SHOWCOMPANY'
      // })
    }
  }

  myAccount() {
    if (this.userData && this.userData.userInfo._id) {
      this.router.navigate(['layout/myaccount/dashboard'])
    }
  }
  checkProfileComplete() {
    if (this.user === 'SELLER' || (this.userData.userInfo.accessLevel == 'SALESPERSON' && this.user == 'ENDUSER')) {
      // if (this.checkProfileStatus) {
      //   this.router.navigate(['layout/e-commerce/dashboard'])
      // } else {
      //   this.router.navigate(['/layout/e-commerce'])
      // }
      // }

      // changes by shivam kashyap 27-12-2022
      if (this.checkProfileStatus && !this.paymentToken) {
          this.router.navigate(['layout/e-commerce/dashboard'])
        } else if(this.checkProfileStatus && this.paymentToken){
          this.router.navigate(['/payment'])
        }
        else {
          this.router.navigate(['/layout/e-commerce'])
        }
        
    } else if (this.user == 'COMPANY' || this.user == 'ENDUSER') {
      if (this.userData.userInfo.accessLevel === 'DISPATCHER') {
        this.router.navigate(['/layout/myaccount/trip-planner'])
      } else {
        if (this.checkProfileStatus && !this.paymentToken) {
          this.router.navigate(['layout/myaccount/dashboard'])
        } else if (this.checkProfileStatus && this.paymentToken) {
          this.router.navigate(['/payment'])
        } else {
          this.router.navigate(['/set-profile'])
        }
      }
    }
  }
  logout() {
    let ipAddress = localStorage.getItem('ipAddress')
    let userId = localStorage.getItem('truck_userId')
    let source = localStorage.getItem('source')
    let logoutDate = new Date()

    let logoutHistory = {
      ipAddress: ipAddress,
      userId: userId,
      source: source,
      logoutDate: logoutDate,
    }

    this._generalService.userLogOut(logoutHistory).subscribe((result) => {
      this.translate.setDefaultLang('en')

      localStorage.clear()
      window.localStorage.clear()
      this.sharedService.setHeader({})
      this.sharedService.setPath('')
      this.router.navigate(['/login'])
    })
  }
  navToggle() {
    this.navOpen = !this.navOpen
  }

  getCompany() {
    let data = { companyId: this.userData.userInfo._id }
    this._generalService.getCompanyDetails(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.userName = response['data'].companyName
        this.useLanguage(response['data'].defaultLanguage)
      } else {
        this.toastr.warning('', response['message'])
      }
    })
  }

  getUserProfileDetails() {
    let data = {
      endUserId: this.userData.userInfo._id,
    }
    this._generalService.getEndUserDetails(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.userName = response['data'].personName
        this.useLanguage(response['data'].defaultLanguage)
      } else {
        this.toastr.warning('', response['message'])
      }
    })
  }
  // type_id

  /** NOTIFICATION  */
  notifyUser() {
    this.SocketService.getNotfication().subscribe((res) => {
     
      this.NotificationCheak(res)
    })
  }
  NotificationCheak(data) {
    this.notificationBox = new Notification(data.title, {
      body: data.message,
      icon: data.userImage ? this.endUser + data.userImage : this.endUser + '038fc32c-383d-4f09-94c5-53709ba6388a-1644389458801_imagesss.jpg',
    })
    this.notificationBox.addEventListener('click', () => {
      let item = { notification_id: data.notificationId, reader_id: this.userData.userInfo._id }

      this._generalService.NotificationsRead(item).subscribe((res) => {
        // this.routePages(data)
      })
      ;() => {
        // this.routePages(data)
      }
      // setTimeout(() => {
      //   this.notificationBox.close()
      // }, 3 * 1000)
    })
  }

  // navClosed() {
  //   let navbarSupportedContent = document.getElementById('navbarSupportedContent')
  //   navbarSupportedContent.classList.remove('navOpen')
  // }
}
