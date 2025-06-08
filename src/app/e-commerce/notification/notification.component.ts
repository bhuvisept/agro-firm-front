// import { Component, OnInit ,Renderer2} from '@angular/core';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import { environment } from 'src/environments/environment'
import { DOCUMENT } from '@angular/common'
import { SharedService } from 'src/app/service/shared.service'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
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
    private renderer: Renderer2,
    private _generalService: GeneralServiceService,
    @Inject(DOCUMENT) private document: Document,
    private spinner: NgxSpinnerService,
    private router: Router,
    private SharedService: SharedService
  ) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
   
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.getNotificationsList(1)
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }

  getNotificationsList(pagenumber) {
    this.notificationsLists = []
    window.scroll(0, 0)
    let data = {
      receiver: this.userId,
      page: pagenumber,
      count: this.itemsPerPage,
      isReaded: this.notificationsType,
      role: 'ECOMMERCE',
    }
    this.spinner.show()
    this._generalService.getNotificationsLists(data).subscribe((response) => {
      this.spinner.hide()
      if (response['code'] == genralConfig.statusCode.ok) {
        this.page = pagenumber
        this.notificationsLists = response['data']
        this.totalCount = response['totalCount']
      } else {
        this.notificationsLists = []
      }
    })
    ;(error) => {
      this.spinner.hide()
    }
  }

  NotificationChange(type) {
    if(this.notificationsType != type){
      this.notificationsType = type 
      this.getNotificationsList(1)
    }
  }

  reDirect(data, index) {
    
    let item = {
      notification_id: data._id,
      reader_id: this.userId,
      role: 'ECOMMERCE',
    }

    if (data.isReaded == false) {
      this._generalService.NotificationsRead(item).subscribe((res) => {
        if (res.code == 200) {
          this.notificationsLists[index].isReaded = true
          let list = {}
          list['info'] = data
          this.SharedService.setNotification(list)
          this.routePages(data)
        }else{
          this.routePages(data)
        }
      })
    }
    else{this.routePages(data)}
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

        case 'ECOMMERCE':
        if (data.type === 'USER') {
          this.router.navigate([`/pages/e-commerce/product-view/${data.type_id}`])
        } else {
          this.router.navigate([`/layout/e-commerce/answer-question/${data.type_id}`])
        }
        break
        case 'NETWORK':
        if (data.type === 'SENDINVITATION') {
          this.router.navigate([`/layout/social-media`])
        } else if(data.type === 'LIKEADDED')  {
          this.router.navigate([`/layout/e-commerce/answer-question/${this.userId}`])
        }
        break
        
      default:
        break
    }
  }
}


