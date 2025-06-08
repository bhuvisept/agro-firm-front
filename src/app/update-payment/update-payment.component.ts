import { Component, OnInit, ViewChild } from '@angular/core';
import { StripeService, StripeCardComponent } from 'ngx-stripe'
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner'
import { GeneralServiceService } from 'src/app/core/general-service.service';
import { ActivatedRoute,Router } from '@angular/router'

@Component({
  selector: 'app-update-payment',
  templateUrl: './update-payment.component.html',
  styleUrls: ['./update-payment.component.css']
})
export class UpdatePaymentComponent implements OnInit {

  stripeTest: FormGroup
  submitted: boolean = false
  @ViewChild(StripeCardComponent, { static: false }) card: StripeCardComponent
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        lineHeight: '3.5',
        letterSpacing: '2px',
        fontSize: '16px',
        fontFamily: '"Open Sans", sans-serif',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': { color: '#fce883' },
        textAlign: 'justify',
        '::placeholder': { color: '#000000' },
      },
      invalid: { color: '#e5424d', ':focus': { color: '#303238' } },
    },
    hidePostalCode: true,
  }
  userId: any;
  userPlanData: Object;
  userData: any;
  finalPrice: any;
  isSelectPlan: any;

  constructor(
    private _generalService: GeneralServiceService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: GeneralServiceService,
    private router: Router,
    private  route : ActivatedRoute
  ) { }

  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    if (userData && userData.userInfo) {
      this.userId = userData.userInfo._id;
      this.userData = userData
     
    }
    this.route.params.subscribe((res)=>{
      this.isSelectPlan = res.planId
      this.getSelectedPlan()
    })   

    this.stripeTest = this.fb.group({
      name: ['', Validators.required],
      billingAddress: ['', Validators.required],
      phoneNumber: ['', [Validators.required,Validators.minLength(10)]],
      // phoneNumber: ['', Validators.required]
    })
    window.scroll(0, 0)

  }
  getSelectedPlan(){
    this.spinner.show()
    this.service.getSelectedPlan({ userId: this.userId,planId:this.isSelectPlan }).subscribe((res) => {
      this.spinner.hide()
      if (res['code'] == 200) {        
        this.finalPrice = res['data'].finalPrice
        this.finalPrice = (Math.round(this.finalPrice * 100) / 100).toFixed(2)
      } else {
        this.spinner.hide()
      }
    }, () => {
      this.toastr.error('Something went wrong')
    })
  }
  createToken(){
    
  }
  // createToken(): void {
  //   this.submitted = true
  //   if (this.stripeTest.valid) {
  //     this.spinner.show()
  //     const name = this.stripeTest.get('name').value;
  //     this.stripeService.createToken(this.card.element, { name }).subscribe((result: any) => {
  //       if (result.token) {
  //         let data = {
  //           tokenId: result.token.id,
  //           userId: this.userId,
  //           finalPrice: this.finalPrice,
  //           expireYear: result.token.card.exp_year,
  //           expireMonth: result.token.card.exp_month,
  //           cardHolderName: result.token.card.name,
  //           billingAddress: this.stripeTest.value.billingAddress,
  //           phoneNumber: this.stripeTest.value.phoneNumber,
  //           cardLast4: result.token.card.last4,
  //           cardBrand: result.token.card.brand,
  //           userEmail: this.userData.userInfo.email,
  //           paymentToken: this.userData.userInfo.paymentToken,
  //           personName: this.userData.userInfo.firstName + " " + this.userData.userInfo.lastName,
  //         }
  //         if (this.userData.userInfo.paymentToken) {
  //           this.service.customPaymentSave(data).subscribe((res) => {
  //             if (res['code'] == 200) {
               
  //               this.spinner.hide()

  //               let data = JSON.parse(localStorage.getItem('truckStorage'))
  //               data['userInfo']['planData']= res['data'] 
  //               data['userInfo']['paymentToken'] = null
              
               
  //               localStorage.setItem('truckStorage', JSON.stringify(data))
  //               //  localStorage.removeItem('planName')
  //               const dialogRef = this.dialog.open(PaymentSuccessDialogComponent, {
  //                 width: '800px',
  //                 disableClose : true

  //               });
  //               dialogRef.afterClosed().subscribe(result => {
  //                 if (result.close ) {

  //                   this.router.navigate(['/layout/myaccount/dashboard'])
  //                 }
  //               })

  //             } else {
  //               this.toastr.warning(res['message'])
  //               this.spinner.hide()
  //             }
  //           })

  //         } else {
  //           this.service.paymentSave(data).subscribe((res) => {
  //             if (res['code'] == 200) {
  //               let response = res['data'] 
  //               this.spinner.hide()
  //               let data = JSON.parse(localStorage.getItem('truckStorage')) 
  //               data['userInfo']['planData']= res['data'] 
  //               let planArray = []
  //               response.forEach(element => {
  //                 planArray.push(element.plan)
  //                 data['userInfo']['planName'] = planArray
  //               });
  //               localStorage.setItem('truckStorage', JSON.stringify(data))  
  //               const dialogRef = this.dialog.open(PaymentSuccessDialogComponent, {
  //                 width: '800px',
  //                 disableClose : true

  //               });
  //               dialogRef.afterClosed().subscribe((result) => {
                  
  //                 if ( result.close && (data.userInfo.roleId.roleTitle == "COMPANY" || data.userInfo.roleId.roleTitle == "ENDUSER") ) {
            
  //                   this.router.navigate(['/layout/myaccount/dashboard'])
  //                 }
  //                 if( result.close && data.userInfo.roleId.roleTitle == "SELLER"  ){
  //                   this.router.navigate(['/layout/e-commerce/dashboard'])
  //                 }
  //               })

  //             } else {
  //               this.toastr.warning(res['message'])
  //               this.spinner.hide()
  //             }
  //           })
  //         }
  //       } else if (result.error) {
  //         this.spinner.hide()
  //         this.toastr.warning(result.error.message)

  //       }
  //     });
  //   }

  // }

  Back() {
    window.history.back()
  }

}
