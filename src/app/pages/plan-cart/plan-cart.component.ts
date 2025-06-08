import { Component, OnInit } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast'
import { Console } from 'console'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material'
import { PromosPopupComponent } from '../promos-popup/promos-popup.component'
import { exit } from 'process'

@Component({
  selector: 'app-plan-cart',
  templateUrl: './plan-cart.component.html',
  styleUrls: ['./plan-cart.component.css'],
})
export class PlanCartComponent implements OnInit {
  
  selectedOption: any;
  userId: any
  planList: any
  finalPrice: any = 0
  promoCode: any = ''
  appliedPromo: any
  codeDiscount: any = 0
  discountPrice: any = 0
  discountValue: any = 0
  discountedAmount: any = 0
  userData: any
  PlanPrice: any

  promoList: any[] = []
  installmentPlan: any

  constructor(private service: GeneralServiceService, private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('truckStorage'))

    if (userData && userData.userInfo) {
      this.userId = userData.userInfo._id
      this.userData = userData
    }
    this.subsPlanList()
    window.scroll(0, 0)
  }

  subsPlanList() {
    this.spinner.show()
    this.service.subsPlanList({ userId: this.userId }).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.spinner.hide()
          this.planList = res['data']
          this.finalPrice = res['finalPrice']

          if (res['promoData']) {
            this.appliedPromo = res['promoData'].appliedCode[0]

            this.discountValue = parseFloat(res['promoData'].web_price).toFixed(2)
          }

          this.discountPrice = (this.finalPrice - this.discountValue).toFixed(2)
        } else {
          this.spinner.hide()
        }
      },
      () => {
        this.toastr.error('Something went wrong')
        this.spinner.hide()
      }
    )
  }
  removeProduct(i, id) {
    this.spinner.show()
    this.service.removePlan({ _id: id }).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.planList.splice(i, 1)
          this.subsPlanList()
          localStorage.removeItem('PLANPRICE')
          this.toastr.success('Item removed successfully')
          if (this.appliedPromo) {
            this.removePromo()
          }
          this.spinner.hide()
        } else {
          this.toastr.warning(res['message'])
          this.spinner.hide()
        }
      },
      () => {
        this.toastr.error('Something went wrong')
        this.spinner.hide()
      }
    )
  }

  applyPromoCode() {
    let data = {
      userId: this.userId,
      promocode: this.promoCode.toUpperCase(),
    }
    this.spinner.show()
    this.service.promocodeApply(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          if (res['data'][0].discountType && res['data'][0].discountType != '') {
            this.discountedAmount = res['data'][0].finalAmount
          }
          if (res['data']) this.PlanPrice = res['data'][0].planPrice
          localStorage.setItem('PLANPRICE', this.PlanPrice)
          this.appliedPromo = this.promoCode
          this.codeDiscount = this.appliedPromo.discountValue
          this.toastr.success(res['message'])
          this.promoCode = ''
          this.subsPlanList()
          this.spinner.hide()
        } else {
          this.spinner.hide()
          this.promoCode = ''
          this.toastr.warning(res['message'])
        }
      },
      () => {
        this.toastr.error('Something went wrong')
        this.spinner.hide()
      }
    )
  }

  removePromo() {
    this.spinner.show()
    this.service.promoRemove({ userId: this.userId }).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.appliedPromo = ''
          // this.toastr.success(res['message'])
          this.discountPrice = 0
          this.discountValue = 0
          this.spinner.hide()
          this.subsPlanList()
        } else {
          this.spinner.hide()
          this.toastr.warning(res['message'])
        }
      },
      () => {
        this.toastr.error('Something went wrong')
        this.spinner.hide()
      }
    )
  }

  // installmentplanList() {

  //   this.spinner.show()
  //  return  this.service.installmentplanList({ planId: this.planList[0].planId }).subscribe(
  //     (res) => {
  //       if (res['code'] == 200) {
  //         this.installmentPlan = res['data']
  //         console.log(this.installmentPlan[0].installmentPercent.length,"000000000111111111111")
  //         if(this.installmentPlan[0].installmentPercent.length>0){
  
  //         }else{
  //           this.toastr.error('sdgdrfsvuyhzsdvghjldsgbfuisdvgdszjhuyfvgdsuiyfdsgvbcyusdebfchjzsdfgdyufvbsd')
  //           this.spinner.hide()
            
  //         }
  //       } else {
  //         this.spinner.hide()
  //       }
  //     },
  //     () => {
  //       this.toastr.error('Something went wrong')
  //       this.spinner.hide()
  //     }
  //   )

  // }

  payment() {
    if(this.selectedOption==null && this.selectedOption == undefined) return this.toastr.warning('Please select installment or fullpayment') 
    
    if(this.selectedOption=='INSTALLMENT'){
    // this.installmentplanList()
    this.router.navigate(['/pages/installment-payment'])
    }
else{
  if (this.discountPrice == 0 && this.appliedPromo) {
    let data = {
      personName: this.userData.userInfo.firstName + ' ' + this.userData.userInfo.lastName,
      phoneNumber: this.userData.userInfo.mobileNumber,
      userEmail: this.userData.userInfo.email,
      userId: this.userId,
    }
    this.spinner.show()
    this.service.getFreeSubsPlan(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.spinner.hide()
          let data = JSON.parse(localStorage.getItem('truckStorage'))
          data['userInfo']['planData'] = res['data']
          localStorage.clear()
          localStorage.setItem('truckStorage', JSON.stringify(data))
          this.toastr.success('Plan purchased successfully')
          if (data.userInfo.roleId.roleTitle == 'COMPANY') {
            this.router.navigate(['/layout/myaccount/dashboard'])
          }
          if (data.userInfo.roleId.roleTitle == 'SELLER') {
            this.router.navigate(['/layout/e-commerce/dashboard'])
          }
          if (data.userInfo.roleId.roleTitle == 'ENDUSER') {
            this.router.navigate(['/layout/myaccount/my-plan'])
          }
        } else {
          this.spinner.hide()
        }
      },
      () => {
        this.toastr.error('Something went wrong')
        this.spinner.hide()
      }
    )
  } else {
    this.router.navigate(['/payment'])
  }
}

   
  }

  openPromo() {
    this.spinner.show()
    this.service.promoCodesList({ userId: this.userId }).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.spinner.hide()
          this.promoList = res['data']
          this.dialog.open(PromosPopupComponent, {
            width: '700px',
            panelClass: 'cus_promo_box',
            data: { promoList: this.promoList },
          })
        } else {
          this.spinner.hide()
          this.toastr.warning(res['message'])
        }
      },
      () => {
        this.toastr.error('Something went wrong')
        this.spinner.hide()
      }
    )
  }
}
