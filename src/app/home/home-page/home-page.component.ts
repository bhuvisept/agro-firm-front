import { DatePipe } from '@angular/common'
import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'
import { OwlOptions } from 'ngx-owl-carousel-o'
import { EventBookDialogComponent } from '../../event-book-dialog/event-book-dialog.component'
import { MatDialog } from '@angular/material'
import { PromosPopupComponent } from 'src/app/pages/promos-popup/promos-popup.component'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    nav: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    autoplayTimeout: 1000,
    responsive: { 0: { items: 1, nav: false }, 600: { items: 2 }, 1000: { items: 3 }, 1366: { items: 3, margin: 10 } },
  }

  blogCustomOptions: OwlOptions = {
    loop: true,
    autoplay: false,
    center: true,
    nav: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    margin: 10,
    responsive: { 0: { items: 1, nav: false, autoplay: true }, 567: { items: 1, nav: false, autoplay: true }, 767: { items: 2, nav: false, autoplay: true }, 1000: { items: 3 }, 1366: { items: 3 } },
  }

  demoDate: any = Date
  countDownDate: any
  newDateFormat: any
  x: any
  userId: any
  eventLists: any = []
  exampleTime: any = []
  imgLocation: any
  public image_url_truck = environment.URLHOST + '/uploads/event/image/thumbnail/'
  slider_url = environment.URLHOST + '/uploads/slider/image/thumbnail/'
  sliderList: any
  records: boolean
  interested = genralConfig.Interested
  roleTitle: any
  userDatause: any
  book: any
  cheak: boolean = false
  blogList: any
  public BLOGIMAGE = environment.URLHOST + '/uploads/blog/thumbnail/'
  totalCount: any
  blogListTotalCount: any
  sliderArrow = false
  userAgent = navigator
  accessLevel: any
  eventAccess = ['COMPANY', 'HR', 'SELLER', 'SALESPERSON', 'DISPATCHER']
  promoList: any[]=[]
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private _generalService: GeneralServiceService,
    private pipe: DatePipe,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    window.scroll(0, 0)
    this.userDatause = JSON.parse(localStorage.getItem('truckStorage'))
    if (this.userDatause && this.userDatause.userInfo) {
      this.userId = this.userDatause.userInfo._id
      this.roleTitle = this.userDatause.userInfo.roleId.roleTitle
      this.accessLevel = this.userDatause.userInfo.accessLevel
    }
    this.getBloglists()
    this.sliders()
    this.openPromoCode()
    if (this.roleTitle !== 'COMPANY') {
      this.getEventlists()
      return (this.cheak = true)
    } else return (this.cheak = false)
  }

  openPromo() {
    this.dialog.open(PromosPopupComponent, {data: {promoList:this.promoList,panelClass: 'cus_promo_box' }})
  }

  sliders() {
    let obj = { isDeleted: false, isActive: true }
    this.spinner.show()
    this._generalService.sliders(obj).subscribe((result) => {
      if (result.code == 200) {
        this.spinner.hide()
        this.sliderList = result.data
        setTimeout(() => {
          if (this.sliderList.length) {
            this.records = false
            this.sliderArrow = true
          } else {
            this.records = true
          }
        }, 1000)
      } else {
        this.spinner.hide()
      }
    })
  }
  getEventlists() {
    if (this.userId != null) {
      let data = {
        searchType: 'UPCOMING',
        visibility: 'Public',
        userId: this.userId ? this.userId : null,
        roleTitle: this.roleTitle ? this.roleTitle : null,
        isActive: 'true',
      }
      this.spinner.show()
      this._generalService.homePageEvents(data).subscribe(
        (response) => {
          if (response['code'] == 200) {
            this.eventLists = response['data']
            this.eventLists.forEach((element) => {
              this.exampleTime.push(element.startDate)
            })
            this.setTimer(this.exampleTime)
            this.spinner.hide()
          }
        },
        (error) => {
          this.toastr.show(error, 'Network Error')
          this.spinner.hide()
        }
      )
    } else {
      this.spinner.show()
      let data = { searchType: 'UPCOMING', visibility: 'Public' }
      this._generalService.eventList(data).subscribe(
        (response) => {
          if (response['code'] == 200) {
            this.eventLists = response['data']
            this.eventLists = this.eventLists.map((ele) => ele.description.item.replace(/<(.|\n)*?>/g, ''))
            this.eventLists.forEach((element) => {
              this.exampleTime.push(element.startDate)
            })
            this.setTimer(this.exampleTime)
            this.spinner.hide()
          }
        },
        (error) => {
          this.toastr.show(error, 'Network Error')
          this.spinner.hide()
        }
      )
    }
  }
  getBloglists() {
    let obj = { isDeleted: false, isActive: 'true' }
    this.spinner.show()
    this._generalService.homePageBlogs(obj).subscribe((result) => {
      if (result['code'] == genralConfig.statusCode.ok) {
        this.blogList = result['data']
        this.blogListTotalCount = result['totalCount']
      }
      this.spinner.hide()
    })
  }
  addInterestedAttendee(eventId: any) {
    if (this.userId != null) {
      this.spinner.show()
      let data = {
        userId: this.userId,
        eventId: eventId,
      }
      this._generalService.addInterestedAttendee(data).subscribe(
        (res) => {
          if (res['code'] == genralConfig.statusCode.ok) {
            this.getEventlists()
            this.toastr.success(res['message'])
          } else this.toastr.warning(res['message'])
          this.spinner.hide()
        },
        () => {
          this.toastr.warning('Something went wrong')
          this.spinner.hide()
        }
      )
    } else {
      this.toastr.warning('You have to log-In first.')
      window.scroll(0, 0)
    }
  }

  removeInterestedAttendee(eventId: any) {
    if (this.userId != null) {
      this.spinner.show()
      let data = {
        userId: this.userId,
        eventId: eventId,
      }
      this._generalService.removeInterestedAttendee(data).subscribe(
        (res) => {
          if (res['code'] == genralConfig.statusCode.ok) {
            this.getEventlists()
            this.toastr.success(res['message'])
            this.spinner.hide()
          } else {
            this.spinner.hide()
            this.toastr.warning(res['message'])
          }
        },
        () => {
          this.toastr.warning('Something went wrong')
          this.spinner.hide()
        }
      )
    } else {
      this.router.navigateByUrl('login')
    }
  }

  addFavourite(eventId: any) {
    if (this.userId != null) {
      this.spinner.show()
      let data = {
        userId: this.userId,
        eventId: eventId,
      }
      this._generalService.addFavouriteEvent(data).subscribe(
        (res) => {
          if (res['code'] == genralConfig.statusCode.ok) {
            this.getEventlists()
            this.toastr.success(res['message'])
            this.spinner.hide()
          } else {
            this.spinner.hide()
            this.toastr.warning(res['message'])
          }
        },
        () => {
          this.toastr.warning('Something went wrong')
          this.spinner.hide()
        }
      )
    } else {
      this.toastr.warning('You have to log-In first.')
      window.scroll(0, 0)
    }
  }
  removeFavourite(eventId: any) {
    if (this.userId != null) {
      this.spinner.show()
      let data = {
        userId: this.userId,
        eventId: eventId,
      }
      this._generalService.removeFavouriteEvent(data).subscribe(
        (res) => {
          if (res['code'] == genralConfig.statusCode.ok) {
            this.getEventlists()
            this.toastr.success(res['message'])
            this.spinner.hide()
          } else {
            this.spinner.hide()
            this.toastr.warning(res['message'])
          }
        },
        () => {
          this.toastr.warning('Something went wrong')
          this.spinner.hide()
        }
      )
    } else {
      this.router.navigateByUrl('login')
    }
  }

  setTimer(time) {
    setInterval(() => {
      time.forEach((element, index) => {
        let eventSDate = element
        this.newDateFormat = this.pipe.transform(eventSDate, 'EEEE, MMMM d, y, h: mm: ss a zzzz')
        this.demoDate = new Date(this.newDateFormat).getTime()
        var now = new Date().getTime()
        var distance = this.demoDate - now
        var days = Math.floor(distance / (1000 * 60 * 60 * 24))
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        var seconds = Math.floor((distance % (1000 * 60)) / 1000)
        this.countDownDate = days + ' days ' + hours + ' hours ' + minutes + ' min ' + seconds + ' sec '
        this.eventLists[index].countdown = this.countDownDate
        if (distance < 0) {
          if (new Date(this.eventLists[index].endDate) > new Date()) {
            this.eventLists[index].countdown = 'On-going'
          } else {
            this.eventLists[index].countdown = 'Expired !'
          }
        }
      })
    })
  }

  bookEvent(id) {
    this.dialog
      .open(EventBookDialogComponent, { width: '500px', data: { jobId: id } })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          let data = { userId: this.userId, eventId: id, userName: this.userDatause.userInfo.personName, userImage: this.userDatause.userInfo.image }
          this.spinner.show()
          this._generalService.bookedEvent(data).subscribe((res) => {
            this.spinner.hide()
            if (res && res.code == genralConfig.statusCode.ok) {
              this.toastr.success('Event Successfully Booked')
              this.getEventlists()
            } else this.toastr.error(res.message)
            this.spinner.hide()
          })
        }
      })
  }
  openPromoCode() {
    this._generalService.promoCodesList({ userId: this.userId }).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.spinner.hide()
          this.promoList = res['data']
        }
      },
      () => {
        this.toastr.error('Something went wrong')
        this.spinner.hide()
      }
    )
  }
}
