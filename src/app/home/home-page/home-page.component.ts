import { DatePipe } from '@angular/common'
import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'
import { OwlOptions } from 'ngx-owl-carousel-o'
import { MatDialog } from '@angular/material'

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
    navSpeed: 1,
    responsive: { 0: { items: 1, nav: false }, 600: { items: 2 }, 1000: { items: 3 }, 1366: { items: 3, margin: 10 } },
  }

  blogCustomOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    nav: true,
    dots: false,
    autoHeight: false,
    autoWidth: true,
    autoplayTimeout: 2000,
    navSpeed: 400,
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
  // slider_url = environment.URLHOST + '/uploads/slider/image/thumbnail/'
  slider_url = environment.URLHOST + '/assets/'
  sliderList: any
  records: boolean
  interested = genralConfig.Interested
  roleTitle: any
  userDatause: any
  book: any
  cheak: boolean = false
  productList: any
  serviceList : any
  public BLOGIMAGE = environment.URLHOST + '/uploads/blog/thumbnail/'
  product_img_url = environment.URLHOST + '/assets/products/'
  service_img_url = environment.URLHOST + '/assets/services/'
  totalCount: any
  blogListTotalCount: any
  sliderArrow = false
  userAgent = navigator
  
  
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
    
    //this.getBloglists()
    //this.sliders()
    this.serviceList = [
      {
        "_id":1,
        "image":"dron.png",
        "title":"High Tech Farming ",
      },
      {
        "_id":1,
        "image":"kisan_seva.jpeg",
        "title":"Kisan Seva Kendra",
      },
      {
        "_id":1,
        "image":"kisan_seva.jpeg",
        "title":"Agriculture Magazine",
      },
    ]
    this.productList = [
      {
        "_id":1,
        "image":"borers.jpg",
        "title":"Product 1",
        "description":"Dummy text Dummy text Dummy text Dummy text"
      },
       {
        "_id":1,
        "image":"Fungicides.jpg",
        "title":"Product 1",
        "description":"Dummy text Dummy text Dummy text Dummy text"
      },
       {
        "_id":1,
        "image":"Herbicides.jpg",
        "title":"Product 1",
        "description":"Dummy text Dummy text Dummy text Dummy text"
      },
      {
        "_id":1,
        "image":"plan5.jpg",
        "title":"Product 1",
        "description":"Dummy text Dummy text Dummy text Dummy text"
      }
    ];
    this.sliderList = [
      {
        "alt":"Jitendra",
        "title" : "Jitenra",
        "url" : "footer_background_new.png"
      },
      {
        "alt":"Jitendra",
        "title" : "Jitenra",
        "url" : "slider1.jpg"
      },
      {
        "alt":"Jitendra",
        "title" : "Jitenra",
        "url" : "slider2.jpg"
      },{
        "alt":"Jitendra",
        "title" : "Jitenra",
        "url" : "slider4.jpg"
      }
  ]
   
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
        // this.blogList = result['data']
        // this.blogListTotalCount = result['totalCount']
      }
      this.spinner.hide()
    })
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

}
