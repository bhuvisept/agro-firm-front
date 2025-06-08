import { Component, OnInit, ViewChild } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import { MatStepper } from '@angular/material'
import { StripeService, StripeCardComponent } from 'ngx-stripe'
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js'
import { ToastrService } from 'ngx-toastr'
import { timeout } from 'rxjs/operators'
@Component({
  selector: 'app-upgrade-plan',
  templateUrl: './upgrade-plan.component.html',
  styleUrls: ['./upgrade-plan.component.css'],
})
export class UpgradePlanComponent implements OnInit {
  @ViewChild('stepper', { static: false }) private myStepper: MatStepper

  /** STRIPE SECTION */
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
  /** END STRIPE SECTION */
  planList: any[] = []
  userData: any
  accessLevel: any
  userId: any
  singleClass: boolean = true
  previousPlanId: any = ''
  SelectedPlanId: any = ''
  upgradePlanId: any = ''
  newPlanList: any[]
  firstFormGroup: FormGroup
  secondFormGroup: FormGroup
  validityType: any = 'MONTHLY'
  heading: any
  length: any
  finalPrice: any
  formGroup1: any
  formGroup2: any
  secondGroup1: any
  singleClassYearly: boolean = false
  isLinear: any

  constructor(
    private stripeService: StripeService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _generalService: GeneralServiceService,
    private route: ActivatedRoute,
    private service: GeneralServiceService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.spinner.show()
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('truckStorage'))
    if (this.userData) {
      this.accessLevel = this.userData.userInfo.accessLevel
      this.userId = this.userData.userInfo._id
    }

    this.stripeTest = this.fb.group({
      name: ['', Validators.required],
      billingAddress: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      // phoneNumber: ['', Validators.required]
    })


    this.route.params.subscribe((res) => {
      this.previousPlanId = res.planId
    this.getSubscriptionPlan()

    })
  }
  getSubscriptionPlan() {
   this.spinner.show()
   this._generalService.getAllPlans({ userId: this.userId, planId: this.previousPlanId, validityType: this.validityType }).subscribe(
    (res) => {
          if (res['code'] == 200) {
            this.planList = res['data']
            this.length = res['data'].length
            this.heading = res['data'][0].heading
          }
          this.spinner.hide()
        },
        () => {
          this.spinner.hide()
          this.toastr.error('Something went wrong')
        }
      )
  }

  planMonthOption(e) {
    this.validityType = e
    if (this.validityType == 'MONTHLY') {
      this.singleClass = true
      this.singleClassYearly = false
    } else {
      this.singleClass = false
      this.singleClassYearly = true
    }

    this.getSubscriptionPlan()
  }

  planAnnialOption(e) {
    this.singleClass = false
    this.newPlanList = this.planList.filter((element) => {
      return element.heading == this.previousPlanId && element.validity == 'YEARLY'
    })
  }
  prevoousSteper() {
    this.myStepper.previous()
    this.spinner.show()
   
     setTimeout(() => {
      this.spinner.hide()
     }, 200);
  }

  payment(id) {
    this.SelectedPlanId = id
    this.upgradePlanId = id ? this.SelectedPlanId : this.previousPlanId
    this.getSelectedPlan()
  }
  getSelectedPlan() {
    this.spinner.show()
    this.service.getSelectedPlan({ userId: this.userId, planId: this.upgradePlanId ,previousPlanId:this.previousPlanId}).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.myStepper.next()
          this.finalPrice = res['data'].finalPrice
          this.finalPrice = (Math.round(this.finalPrice * 100) / 100).toFixed(2)
        }else{
          this.toastr.warning(res['message'])
          this.router.navigate(['/layout/myaccount/my-plan'])
        }
        this.spinner.hide()
        this.spinner.hide(res['code'])
      },
      () => {
        this.spinner.hide()
        this.toastr.error('Something went wrong')
      }
    )
  }
  createToken(): void {
    this.submitted = true
    this.spinner.show()
    if (this.stripeTest.valid) {
      const name = this.stripeTest.get('name').value
      this.stripeService.createToken(this.card.element, { name }).subscribe(
        (result: any) => {
          if (result.token) {
            let data = {
              tokenId: result.token.id,
              userId: this.userId,
              // totalPrice : this.userPlanData['GrandTotal'],
              finalPrice: this.finalPrice,
              expireYear: result.token.card.exp_year,
              expireMonth: result.token.card.exp_month,
              cardHolderName: result.token.card.name,
              billingAddress: this.stripeTest.value.billingAddress,
              phoneNumber: this.stripeTest.value.phoneNumber,
              cardLast4: result.token.card.last4,
              cardBrand: result.token.card.brand,
              userEmail: this.userData.userInfo.email,
              SelectedPlanId: this.SelectedPlanId,
              previousPlanId: this.previousPlanId,
              personName: this.userData.userInfo.personName,
            }
            this.service.upgradePayment(data).subscribe((res) => {
              if (res['code'] == 200) {
                this.toastr.success(res['message'])
                setTimeout(() => this.service.logout(), 100)
              } else this.toastr.warning(res['message'])
              this.spinner.hide()
            })
          } else if (result.error) {
            this.toastr.warning(result.error.message)
            this.spinner.hide()
          }
        },
        () => {
          this.spinner.hide()
          this.toastr.error('Something went wrong')
        }
      )
    } else {
      // this.toastr.warning('Invalid detail.')  // Commented By shivam kashyap Date : 05/12/2022
      this.spinner.hide()
    }
  }
}
