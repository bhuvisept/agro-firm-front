import { Component, OnInit } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { environment } from 'src/environments/environment'
import { SharedService } from 'src/app/service/shared.service'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material'
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
    this.userObj = JSON.parse(localStorage.getItem('gauriStorage'))
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
  }

}
