import { ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { Router } from '@angular/router'
import { SharedService } from '../service/shared.service'
import { MatDialog } from '@angular/material/dialog'
import { SliderImgComponent } from 'src/app/slider-img/slider-img.component'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  providers: [NgxSpinnerService],
})
export class NotificationComponent implements OnInit {
  notificationsLists: any
  receiverImage: any
  public endUser = environment.URLHOST + '/uploads/enduser/'
  userObj: any
  userId: any
  totalCount: any
  page: any
  itemsPerPage = 10
  notificationsType: boolean = true

  constructor(
    private _generalService: GeneralServiceService,
    @Inject(DOCUMENT) private document: Document,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private router: Router,
    private SharedService: SharedService,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id

    window.scroll(0, 0)
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
    this.getNotificationsList(1)
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }
  getNotificationsList(pagenumber) {
    this.notificationsLists = []
    window.scroll(0, 0)
    let data = {
      receiver: this.userId,
      page: pagenumber,
      count: this.itemsPerPage,
      isReaded: this.notificationsType,
      role: this.userObj.userInfo.roleId.roleTitle,
      accessLevel: this.userObj.userInfo.accessLevel,
    }
    this.spinner.show()
    this._generalService.getNotificationsLists(data).subscribe((response) => {
      this.spinner.hide()
      if (response['code'] == genralConfig.statusCode.ok) {
        this.page = pagenumber
        this.notificationsLists = response['data']
        this.totalCount = response['totalCount']
      } else {
        this.totalCount = []
      }
    })
    ;(error) => {
      this.spinner.hide()
    }
  }

  NotificationChange(type) {
    if (this.notificationsType != type) {
      this.notificationsType = type
      this.getNotificationsList(1)
    }
  }

  reDirect(data, index) {
    if (data.isReaded == false) {
      this._generalService
        .NotificationsRead({
          notification_id: data._id,
          reader_id: this.userId,
        })
        .subscribe((res) => {
          if (res.code == 200) {
            this.notificationsLists[index].isReaded = true
            let list = {}
            list['info'] = data
            this.SharedService.setNotification(list)
            this.routePages(data)
          }
        })
    } else {
      this.routePages(data)
    }
  }
  // notification/readAll
  markAllRead() {
    this.spinner.show()
    this._generalService.markAllRead({ reader_id: this.userId }).subscribe((res) => {
      this.spinner.hide()
      if (res.code == 200) {
        this.notificationsType = true
        this.getNotificationsList(1)

        let list = {}
        list['readAll'] = true
        this.SharedService.setNotification(list)
      }
    })
    ;() => {
      this.spinner.hide()
    }
  }

  savePageChanged(pagenumber) {
    this.getNotificationsList(pagenumber)
  }

  routePages(data) {
    console.log(data,"777777777777777777777777777")
    switch (data.module) {
      case 'JOB':
        this.router.navigate([`/layout/myaccount/jobs/applicant-list/${data.type_id}`])
        break
      case 'EVENT':
        if (data.type == 'COMPANYEVENT') {
          this.router.navigate([`/layout/myaccount/event-management/view-event/${data.type_id}`])
        } else {
          this.router.navigate([`/pages/event-details/${data.type_id}`])
        }
        break
      case 'TRIP':
        this.router.navigate([`/layout/myaccount/trip-planner/trip-details/${data.type_id}`])
        break

      case 'ECOMMERCE':
        if (data.type === 'USER') {
          this.router.navigate([`/pages/e-commerce/product-view/${data.type_id}`])
        } else {
          this.router.navigate([`/layout/e-commerce/answer-question/${data.type_id}`])
        }
        break
        case 'MY NETWORK':
        if (data.type === 'COMMENTADDED') this.openPost(data.type_id,this.userId)
        else if (data.type === 'LIKEADDED') this.openPost(data.type_id,this.userId)
        else if (data.type === 'SHARED') this.openPost(data.type_id,this.userId)
          else if(data.type=='ACCEPTINVITATION') this.router.navigate([`/layout/social-media/connection-profileview/${data.sender}`])
          else if(data.type=='SENDINVITATION') this.router.navigate([`/layout/social-media`])
          break
        
       
      default:
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
            this.spinner.hide()
          }
        },
        () => {
          this.spinner.hide()
          this.toastr.warning('Server Error')
        }
      )
  
  }
  Back() {
    window.history.back()
  }
}
