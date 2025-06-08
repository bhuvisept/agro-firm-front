import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css'],
})
export class ViewEventComponent implements OnInit {
  id: string
  public image_url_truck = environment.URLHOST + '/uploads/event/image/'
  public logo_url_truck = environment.URLHOST + '/uploads/event/brand_logo/'
  public enduser_url_profile = environment.URLHOST + '/uploads/enduser/'
  bannerImage: any
  brandLogo: any
  eventData: any = []
  userObj: any
  groupId: any
  BookedCount: any = 0
  eventStatus: any
  intrestCount: any
  statusFlag: boolean = false
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private _generalService: GeneralServiceService,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    window.scrollTo(0, 0)
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    if (userData && userData.userInfo && (userData.userInfo.roleId.roleTitle == genralConfig.rolename.COMPANY || userData.userInfo.accessLevel == genralConfig.rolename.HR)) {
      this.route.params.subscribe((params) => {
        this.id = params.id
        this.getEventInfo()
      })
    }

    window.scroll(0, 0)
  }

  getEventInfo() {
    let eventIdObj = {
      eventId: this.id,
    }
    this.spinner.show()
    this._generalService.eventView(eventIdObj).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.eventData = res['data']
          this.intrestCount = this.eventData.interestUserData.length
          this.BookedCount = res['data'].bookingCount

          // this.eventData.startDate =  new Date(this.eventData.startDate)
          // this.eventData.endDate = new Date(this.eventData.endDate)

          if (new Date(this.eventData.startDate) < new Date() && new Date(this.eventData.endDate) > new Date()) {
            this.eventStatus = 'On going'
            this.statusFlag = false
          } else if (new Date(this.eventData.endDate) < new Date()) {
            this.eventStatus = 'Expired'
//this.statusFlag = true // changes for edit expired event 
this.statusFlag = false // changes for edit expired event 
          }
          this.spinner.hide()
        } else {
          window.scrollTo(0, 0)
          this.toastr.error('error', res['message'])
        }
      },
      (err) => {
        this.toastr.error('error')
        this.spinner.hide()
      }
    )
  }

  Back() {
    window.history.back()
  }
}
