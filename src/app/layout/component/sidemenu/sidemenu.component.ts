import { Component, OnInit } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { environment } from 'src/environments/environment'
import { SharedService } from 'src/app/service/shared.service'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material'
import { LoginDialogComponent } from 'src/app/pages/login-dialog/login-dialog.component'
import { PlanConfirmationDialogComponent } from 'src/app/plan-confirmation-dialog/plan-confirmation-dialog.component'
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css'],
  providers: [NgxSpinnerService],
})
export class SidemenuComponent implements OnInit {
  userObj: any
  profile: []
  companyName: any
  userInfo: any
  ROLETITLE: any
  profileCompleted: any
  public Userprofile = environment.URLHOST + '/uploads/enduser/'
  personName: any
  loggedUser: any
  loggedImage: any
  imagePath: any
  accessLevel: any
  progressBar
  show: boolean
  userPlanData: any
  constructor(
    private dialog: MatDialog,
    private SharedService: SharedService,
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))

    // if(this.userObj.userInfo.roleId.roleTitle == "ENDUSER"){
    //  this.getUserProfileDetails()
    // }
    // if(this.userObj.userInfo.roleId.roleTitle == "COMPANY"){
    //   this.getCompany()
    // }

    this.userPlanData = this.userObj.userInfo.planData
    if (!this.userObj) {
      this._generalService.logout()
    } else {
      if (this.userObj.accessLevel == 'ENDUSER') {
        this.accessLevel = 'USER'
      } else {
        this.accessLevel = this.userObj.userInfo.accessLevel
      }
    }
    if (this.userObj.userInfo && this.userObj.userInfo.multiRole.length > 1) {
      this.show = false
    } else {
      this.show = true
    }
    this.SharedService.getProfileProgress().subscribe((res: any) => {
      if (res && res['value']) {
        this.profileCompleted = Math.round(parseFloat(res['value']))
      } else if (this.userObj.userInfo.progressBar) {
        this.profileCompleted = Math.round(parseFloat(this.userObj.userInfo.progressBar))
      } else {
        this.profileCompleted = Math.round(parseFloat(localStorage.getItem('progressBar')))
      }
    })
    this.SharedService.getHeader().subscribe((res: any) => {
      if (res && res.personName) {
        this.loggedImage = res.image
        this.ROLETITLE = res.roleId.roleTitle
        this.imagePath = this.Userprofile
        this.loggedUser = res.roleId.roleTitle == 'ENDUSER' ? res.personName : res.companyName
      } else {
        if (this.userObj && this.userObj.userInfo) {
          if (this.userObj.userInfo.roleId.roleTitle == 'ENDUSER') {
            this.getUserProfileDetails()

            this.loggedUser = this.userObj.userInfo.personName
          }
          if (this.userObj.userInfo.roleId.roleTitle == 'COMPANY') {
            this.getCompany()
            this.loggedUser = this.userObj.userInfo.companyName ? this.userObj.userInfo.companyName : this.userObj.companyName
          }
          if (this.userObj.userInfo.roleId.roleTitle == 'SELLER') {
            this.loggedUser = this.userObj.userInfo.sellerName
          }
          this.ROLETITLE = this.userObj.userInfo.roleId.roleTitle
          // this.loggedImage = this.userObj.userInfo.image;
          this.imagePath = this.Userprofile
        }
      }
    })
  }
  //Full Menu TS Json Company Role Menu
  navigationCompanySideMenu = [
    { navimg: 'fal fa-chart-network', navlink: '/layout/social-media', navitem: 'My network' },
    { navimg: 'fal fa-calendar-alt', navlink: '/layout/myaccount/event-management', navitem: 'Events' },
    { navimg: 'fal fa-truck-container', navlink: '/layout/myaccount/trip-planner', navitem: 'Trip Planner' },
    { navimg: 'fal fa-bags-shopping', navlink: 'wish-list', navitem: 'Wishlist' },
    { navimg: 'fal fa-truck', navlink: '/layout/myaccount/manage-truck', navitem: 'Fleet manager' },
    { navimg: 'fal fa-users-medical', navlink: '/layout/myaccount/team-manager', navitem: 'Manage Team' },
    { navimg: 'fal fa-tools ml-1', navlink: '/layout/myaccount/service', navitem: 'Services' },
    { navimg: 'fas fa-ticket-alt', navlink: '/layout/myaccount/manage-team', navitem: 'My Tickets' },

  ]
  //naviigation menu for HR accesslevel
  navigationHRSideMenu = [
    { navimg: 'fal fa-chart-network', navlink: '/layout/social-media', navitem: 'My network' },
    { navimg: 'fal fa-calendar-alt ', navlink: '/layout/myaccount/event-management', navitem: 'Events' },
    { navimg: 'fal for-hov fa-briefcase', navlink: '/layout/myaccount/jobs', navitem: 'Jobs' },
    { navimg: 'fas fa-ticket-alt', navlink: '/layout/myaccount/manage-team', navitem: 'My Tickets' },

  ]
  //Full Menu TS Json Enduser Role Menu
  navigationEnduserSideMenu = [
    // { navimg: 'fal fa-chart-network', navlink: '/layout/social-media', navitem: 'My network' },
    { navimg: 'fal fa-truck-container', navlink: '', navitem: 'GPS' },
    { navimg: 'fal fa-calendar-alt', navlink: 'my-event', navitem: 'My Events' },
    { navimg: 'fal for-hov fa-briefcase', navlink: 'my-jobs', navitem: 'My Jobs' },
    { navimg: 'fal fa-bags-shopping', navlink: 'wish-list', navitem: 'Wishlist' },
    { navimg: 'fal fa-truck-container', navlink: '/layout/myaccount/trip-planner', navitem: 'Trip Planner', showPopUp: true },
    { navimg: 'fal fa-tools', navlink: '/layout/myaccount/service', navitem: 'Add Services', showPopUp: true },
    { navimg: 'fas fa-ticket-alt', navlink: '/layout/myaccount/manage-team', navitem: 'My Tickets' },

    // { navimg: 'fal fa-chart-network', navlink: '../chat-window', navitem: 'chat' },
  ]
  navigationDriverSideMenu = [
    { navimg: 'fal fa-chart-network', navlink: '/layout/social-media', navitem: 'My network' },
    { navimg: 'fal fa-calendar-alt', navlink: 'my-event', navitem: 'My Events' },
    { navimg: 'fal for-hov fa-briefcase', navlink: 'my-jobs', navitem: 'My Jobs' },
    { navimg: 'fal fa-bags-shopping', navlink: 'wish-list', navitem: 'Wishlist' },
    { navimg: 'fal for-hov fa-briefcase', navlink: '/layout/driver/planned-trip', navitem: 'Trips Detail' },
    { navimg: 'fas fa-ticket-alt', navlink: '/layout/myaccount/manage-team', navitem: 'My Tickets' },

    // { navimg: 'fal fa-chart-network', navlink: '../chat-window', navitem: 'chat' },
  ]
  navigationDispatcherSideMenu = [
    { navimg: 'fal fa-truck-container', navlink: '/layout/myaccount/trip-planner', navitem: 'Trip Planner' },
    { navimg: 'fal fa-truck', navlink: '/layout/myaccount/manage-truck', navitem: 'Fleet manager' },
    { navimg: 'fal fa-users-medical', navlink: '/layout/myaccount/manage-team', navitem: 'Manage Team' },
    { navimg: 'fas fa-ticket-alt', navlink: '/layout/myaccount/manage-team', navitem: 'My Tickets' },

  ]
  changeEvent(event) {
    if (!event) {
      let data = {
        oldRoleId: this.userObj.userInfo.roleId._id,
        userId: this.userObj.userInfo._id,
        roleTitle: 'SELLER',
      }
      this.spinner.show()
      this._generalService.changeRole(data).subscribe((res) => {
        if (res['code'] == 200) {
          localStorage.clear()
          localStorage.setItem('truckStorage', JSON.stringify(res['data']))
          this.router.navigate(['/layout/e-commerce/dashboard'])
          this.spinner.hide()
        } else {
          this.spinner.hide()
        }
      })
    }
  }

  showDialog() {
    this.dialog.open(LoginDialogComponent, { width: '500px', data: 'PLANFEATURE' })
  }

  gpsPlan() {
    let servicesPlanInfo = this.userPlanData.filter((planDtl) => planDtl.plan == 'GPS')
    if (!servicesPlanInfo.length) {
      this.dialog.open(PlanConfirmationDialogComponent, {
        width: '550px',
        data: 'GPS',
      })
    } else {
      this.router.navigate(['/layout/gps'])
    }
  }

  getCompany() {
    let data = { companyId: this.userObj.userInfo._id }
    this._generalService.getCompanyDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.loggedUser = response['data'].companyName
          this.loggedImage = response['data'].companyLogo
        } else {
          this.toastr.warning('', response['message'])
        }
      },
      () => {
        this.toastr.warning('Something went wrong')
      }
    )
  }

  getUserProfileDetails() {
    let data = {
      endUserId: this.userObj.userInfo._id,
    }
    this._generalService.getEndUserDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.loggedUser = response['data'].personName
          this.loggedImage = response['data'].image
        } else {
          this.toastr.warning('', response['message'])
        }
      },
      () => {
        this.toastr.warning('Something went wrong')
      }
    )
  }
}
