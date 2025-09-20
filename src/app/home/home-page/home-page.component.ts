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
    margin: 5,
    responsive: { 0: { items: 1, nav: false }, 600: { items: 2 }, 1000: { items: 4 }, 1366: { items: 4, margin: 10 } },
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
    margin: 5,
    responsive: { 0: { items: 1, nav: false, autoplay: true }, 567: { items: 1, nav: false, autoplay: true }, 767: { items: 2, nav: false, autoplay: true }, 1000: { items: 4 }, 1366: { items: 4 } },
  }
  customOptions1: any = {
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    responsive: {
      0: {
        items: 1   // mobile
      },
      600: {
        items: 2   // tablet
      },
      1000: {
        items: 4   // desktop
      }
    }
  }
  customOptions2: any = {
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    responsive: {
      0: {
        items: 1   // mobile
      },
      600: {
        items: 2   // tablet
      },
      1000: {
        items: 4   // desktop
      }
    }
  }

  demoDate: any = Date
  countDownDate: any
  newDateFormat: any
  x: any
  userId: any
  eventLists: any = []
  exampleTime: any = []
  imgLocation: any
  slider_url = environment.URLHOST + '/uploads/slider/image/'
  product_img_url = environment.URLHOST + '/uploads/product/thumbnail_150X120/'
  service_img_url = environment.URLHOST + '/uploads/services/'
  public EVENTIMAGE = environment.URLHOST + '/uploads/event/thumbnail/'
  sliderList: any
  records: boolean
  interested = genralConfig.Interested
  roleTitle: any
  userDatause: any
  book: any
  cheak: boolean = false
  productList: any
  serviceList: any

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
    this.sliders();
    this.getEventlists();
    this.getLatestProducts();
    this.serviceList = [
      {
        "_id": 1,
        "image": "dron.png",
        "title": "High Tech Farming ",
      },
      {
        "_id": 1,
        "image": "kisan_seva.jpeg",
        "title": "Kisan Seva Kendra",
      },
      {
        "_id": 1,
        "image": "kisan_seva.jpeg",
        "title": "Agriculture Magazine",
      },
    ]
    // this.productList = [
    //   {
    //     "_id": 1,
    //     "image": "borers.jpg",
    //     "title": "Product 1",
    //     "description": "Dummy text Dummy text Dummy text Dummy text"
    //   },
    //   {
    //     "_id": 1,
    //     "image": "Fungicides.jpg",
    //     "title": "Product 1",
    //     "description": "Dummy text Dummy text Dummy text Dummy text"
    //   },
    //   {
    //     "_id": 1,
    //     "image": "Herbicides.jpg",
    //     "title": "Product 1",
    //     "description": "Dummy text Dummy text Dummy text Dummy text"
    //   },
    //   {
    //     "_id": 1,
    //     "image": "plan5.jpg",
    //     "title": "Product 1",
    //     "description": "Dummy text Dummy text Dummy text Dummy text"
    //   }
    // ];

  }
  sliders() {
    let obj = { isDeleted: false, isActive: true }
    this.spinner.show()
    this._generalService.sliders(obj).subscribe((result) => {
      if (result.code == 200) {
        this.spinner.hide()
        this.sliderList = result.data;
        console.log("this.sliderList ", this.sliderList)
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
    // if (this.userId != null) {
    let data = { isActive: 'true' }
    this.spinner.show()
    this._generalService.homePageEvents(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.eventLists = response['data']
          // this.eventLists.forEach((element) => {
          //   this.exampleTime.push(element.startDate)
          // })
          // this.setTimer(this.exampleTime)
          this.spinner.hide()
        }
      },
      (error) => {
        this.toastr.show(error, 'Network Error')
        this.spinner.hide()
      }
    )
    // } 
  }
  getLatestProducts() {
    this.spinner.show()
    this._generalService.latestProducts({}).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.productList = response['data']
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
