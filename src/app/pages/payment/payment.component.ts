import { Component, OnInit, ViewChild } from '@angular/core';
import { StripeService, StripeCardComponent } from 'ngx-stripe'
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner'
import { GeneralServiceService } from 'src/app/core/general-service.service';
import { Router } from '@angular/router'
import { genralConfig } from 'src/app/constant/genral-config.constant'
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

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

  constructor(
    private _generalService: GeneralServiceService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: GeneralServiceService,
    private router : Router
  ) { }

  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    if (userData && userData.userInfo) {
      this.userId = userData.userInfo._id;
      this.userData = userData
    }

    this.stripeTest = this.fb.group({
      name: ['', Validators.required],
      billingAddress: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern(genralConfig.pattern.MOB_NO)]],
      // phoneNumber: ['', Validators.required, Validators.pattern(genralConfig.pattern.PHONE_NO)]
    })
    window.scroll(0, 0)
    this.subsPlanList()
  }

  subsPlanList() {
    this.spinner.show()
    this.service.subsPlanList({ userId: this.userId }).subscribe((res) => {
      if (res['code'] == 200) {

        this.spinner.hide()
        this.userPlanData = res
      } else {
        this.spinner.hide()
      }
     
    }, () => {
      this.toastr.error('Something went wrong')
    })
  }




  createToken(): void {
    this.submitted = true
    if (this.stripeTest.valid) {
      this.spinner.show()
      const name = this.stripeTest.get('name').value;
      this.stripeService.createToken(this.card.element, { name }).subscribe((result: any) => {
          if (result.token) {
            let data = {
              tokenId: result.token.id,
              userId: this.userId,
              // totalPrice : this.userPlanData['GrandTotal'],
              finalPrice: this.userPlanData['finalPrice'],
              expireYear: result.token.card.exp_year,
              expireMonth: result.token.card.exp_month,
              cardHolderName: result.token.card.name,
              billingAddress: this.stripeTest.value.billingAddress,
              phoneNumber: this.stripeTest.value.phoneNumber,
              cardLast4: result.token.card.last4,
              cardBrand: result.token.card.brand,
              userEmail: this.userData.userInfo.email
            }           
            this.service.paymentSave(data).subscribe((res) => {
              if (res['code'] == 200) {
                this.toastr.success(res['message'])
                this.router.navigate(['/layout/myaccount/dashboard'])
                this.spinner.hide()
              }else{
                this.toastr.warning(res['message'])
                this.spinner.hide()
              }

            }) 
          } else if (result.error) {
           
          }
        });
    }

  }

  Back() {
    window.history.back()
  }

}
