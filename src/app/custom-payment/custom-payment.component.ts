import { Component, OnInit, ViewChild } from '@angular/core'
import { StripeService, StripeCardComponent } from 'ngx-stripe'
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog } from '@angular/material'
import { PaymentSuccessDialogComponent } from '../payment-success-dialog/payment-success-dialog.component'
@Component({
  selector: 'app-custom-payment',
  templateUrl: './custom-payment.component.html',
  styleUrls: ['./custom-payment.component.css'],
})
export class CustomPaymentComponent implements OnInit {
  stripeTest: FormGroup
  submitted: boolean = false
  @ViewChild(StripeCardComponent, { static: false }) card: StripeCardComponent
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  }

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
  userId: any
  userPlanData: Object
  userData: any
  finalPrice: any
  token: any

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: GeneralServiceService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((param) => (this.token = param.token))
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    if (userData && userData.userInfo) {
      this.userId = userData.userInfo._id
      this.userData = userData
    }
    this.customPlanData()
    this.stripeTest = this.fb.group({
      name: ['', Validators.required],
      billingAddress: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
    })
    window.scroll(0, 0)
  }
  customPlanData() {
    this.service.customPlanDetails({ token: this.token }).subscribe(
      (res) => {
        if (res['code'] == 200) this.finalPrice = res['data'].planPrice
        else this.toastr.warning(res['message'])
      },
      () => this.toastr.warning('Something went wrong')
    )
  }

  createToken(): void {
    this.submitted = true
    if (this.stripeTest.valid) {
      this.spinner.show()
      const name = this.stripeTest.get('name').value
      this.stripeService.createToken(this.card.element, { name }).subscribe((result: any) => {
        if (result['token']) {
          let data = {
            tokenId: result.token.id,
            finalPrice: this.finalPrice,
            expireYear: result.token.card.exp_year,
            expireMonth: result.token.card.exp_month,
            cardHolderName: result.token.card.name,
            billingAddress: this.stripeTest.value.billingAddress,
            phoneNumber: this.stripeTest.value.phoneNumber,
            cardLast4: result.token.card.last4,
            cardBrand: result.token.card.brand,
            paymentToken: this.token,
          }
          if (this.token) {
            this.service.customPaymentForExistinguserSave(data).subscribe((res) => {
              if (res['code'] == 200) {
                this.dialog
                  .open(PaymentSuccessDialogComponent, { width: '800px', disableClose: true })
                  .afterClosed()
                  .subscribe((result) => {
                    if (result.close && this.userData.userInfo.roleId.roleTitle == 'COMPANY') this.router.navigate(['/layout/myaccount/dashboard'])
                    else if (result.close && this.userData.userInfo.roleId.roleTitle == 'SELLER') this.router.navigate(['/layout/e-commerce/dashboard'])
                    else this.router.navigate(['/login'])
                  })
              } else this.toastr.warning(res['message'])
              this.spinner.hide()
            })
          } else {
            this.toastr.warning('Invalid token.Please try again')
            this.spinner.hide()
          }
        } else if (result.error) {
          this.spinner.hide()
          this.toastr.warning(result.error.message)
        }
      })
    }
  }

  Back() {
    window.history.back()
  }
}
