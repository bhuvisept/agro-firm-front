import { Component, OnInit, ɵɵsetComponentScope } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { MapsAPILoader } from '@agm/core'
import { MatDialog } from '@angular/material'
import { LoginDialogComponent } from '../login-dialog/login-dialog.component'
import { SharedService } from 'src/app/service/shared.service'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast'
@Component({
  selector: 'app-pricing-page',
  templateUrl: './pricing-page.component.html',
  styleUrls: ['./pricing-page.component.css'],
  providers: [NgxSpinnerService],
})
export class PricingPageComponent implements OnInit {
  planList: any
  planOptionList: any
  firstFormGroup: FormGroup
  secondFormGroup: FormGroup
  userId: any

  singleClass: boolean = true
  planArray = [
    { value: 'ECOMMERCE', name: 'E-Commerce' },
    { value: 'EVENT', name: 'Event' },
    { value: 'JOB', name: 'Job' },
    { value: 'SERVICE', name: 'Services' },
    { value: 'TRIP PLANNER', name: 'Trip Planner' },
    { value: 'WEATHER', name: 'Weather' },
  ]

  planTitle: any
  newPlanList: any
  isSelectPlan: any = 'ECOMMERCE'
  cartTotalList: any
  carStatue: any
  userData: any
  bookedPlan = []
  planSetKey: any
  accessLevel: any
  planAccess = ['COMPANY', 'SELLER']
  currentPlan: any
  isCustomPlanVisible: boolean = true
  constructor(
    private SharedService: SharedService,
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.firstFormGroup = this.formbuilder.group({})
    this.userData = JSON.parse(localStorage.getItem('truckStorage'))
    if (this.userData) {
      this.accessLevel = this.userData.userInfo.accessLevel
      this.userId = this.userData.userInfo._id
    }
    this.currentPlan = JSON.parse(localStorage.getItem('planName'))
    if (this.currentPlan) {
      this.isSelectPlan = this.currentPlan.Name
    }
    this.getSubscriptionPlan()
    this.getCartListCount()
  }

  getSubscriptionPlan() {
    this.spinner.show()
    this._generalService.getSubscriptionPlanList({ userId: this.userId }).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.planList = res['data']
          if (res['userPlan']) {
            this.bookedPlan = [...res['userPlan']]
            // if(this.bookedPlan.length){
            //   this.planArray.map(item =>{
            //     if(!this.bookedPlan.includes(item.value)){
            //       this.isSelectPlan = item.value
            //     }})
            // }
          }

          this.spinner.hide()
          if (this.userData && this.userData.userInfo.accessLevel != 'ENDUSER') {
            this.planList = this.planList.filter((element) => {
              return element.title != 'GPS'
            })
          } else {
            this.planArray.push({ value: 'GPS', name: 'GPS' })
          }

          this.newPlanList = this.planList.filter((element) => {
            return element.heading == this.isSelectPlan && element.validity == 'MONTHLY'
          })
          this.carStatue = res['data'].inCart
        } else {
          this.spinner.hide()
        }
      },
      (error) => {
        this.spinner.hide()
      }
    )
  }
  getCartListCount() {
    this.spinner.show()
    this._generalService.getTotalCartList({ userId: this.userId }).subscribe((res) => {
      if (res['code'] == 200) {
        this.cartTotalList = res['data']
        this.spinner.hide()
      }
    })
  }

  changePlanOption(e) {
    if (e.value == 'WEATHER' || e.value == 'GPS') {
      this.isCustomPlanVisible = false
    } else {
      this.isCustomPlanVisible = true
    }
    this.isSelectPlan = e.value
    this.newPlanList = this.planList.filter((element) => {
      return element.heading == this.isSelectPlan && element.validity == 'MONTHLY'
    })
  }

  planMonthOption(e) {
    this.singleClass = true
    this.newPlanList = this.planList.filter((element) => {
      return element.heading == this.isSelectPlan && element.validity == 'MONTHLY'
    })
  }

  planAnnialOption(e) {
    this.singleClass = false
    this.newPlanList = this.planList.filter((element) => {
      return element.heading == this.isSelectPlan && element.validity == 'YEARLY'
    })
  }

  addToCart(item, index) {
    if (!this.userId) {
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        width: '500px',
        data: this.isSelectPlan,
      })
      return
    }

    if (this.userId && !this.planAccess.includes(this.accessLevel) && !(this.accessLevel == 'ENDUSER' && (item.title == 'WEATHER' || item.title == 'ECOMMERCE' || item.title == 'GPS'))) {
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        width: '500px',
        data: 'ISENDUSER',
      })
      return
    }

    let data = {
      userId: this.userId,
      planId: item._id,
      title: item.title,
    }
    this.spinner.show()
    this._generalService.addPlanToCart(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.toastr.success(res['message'])
          this.newPlanList[index].inCart = true
          this.getCartListCount()
          this.spinner.hide()
        } else {
          this.toastr.warning(res['message'])
          this.spinner.hide()
        }
      },
      (error) => {
        this.spinner.hide()
        this.toastr.warning('Something went wrong')
      }
    )
  }

  buyNow(item) {
    if (!this.userId) {
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        width: '500px',
      })
      return
    }
    if (this.userId && !this.planAccess.includes(this.accessLevel) && !(this.accessLevel == 'ENDUSER' && (item.title == 'WEATHER' || item.title == 'ECOMMERCE' || item.title == 'GPS'))) {
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        width: '500px',
        data: 'ISENDUSER',
      })
      return
    }
    let data = {
      userId: this.userId,
      planId: item._id,
      title: item.title,
    }
    this.spinner.show()
    this._generalService.addPlanToCart(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.router.navigate(['/pages/plan-cart'])
          this.spinner.hide()
        } else {
          this.toastr.warning(res['message'])
          this.spinner.hide()
        }
      },
      (error) => {
        this.spinner.hide()
        this.toastr.warning('Something went wrong')
      }
    )
  }
}
