import { Component, NgZone, Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
import { Router } from '@angular/router'
import moment from 'moment'
import { SharedService } from 'src/app/service/shared.service'
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  formTwo: FormGroup
  stateList: any
  userObj: any
  userId: any
  legalentity: any
  country: any
  state: any
  status: any
  countryList: any
  zipcode: any
  validZipCode: any
  formDataTwo: any
  countryId: any
  sellerData: any
  legalEntityOption: any
  minDateOfBirth: string
  public date: moment.Moment
  defaultLanguages = genralConfig.defaultLanguage
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private service: GeneralServiceService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}
  ngOnInit() {
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.getCountry()
    this.formTwo = this.fb.group({
      companyName: [''],
      firstName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE), Validators.pattern(genralConfig.pattern.REPORTNAME)]],
      lastName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE), Validators.pattern(genralConfig.pattern.REPORTNAME)]],
      email: ['', [Validators.required, Validators.pattern(genralConfig.pattern.EMAIL)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(genralConfig.pattern.PHONE_NO)]],
      dateOfBirth: ['', [Validators.required]],
      ssn: [''],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.minLength(genralConfig.pattern.MINLENGTH)]],
      address: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE)]],
      defaultLanguage: ['', [Validators.required]],
    })
    this.getSeller()
    this.minDateOfBirth = moment(new Date()).format('YYYY-MM-DD')
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  getCountry() {
    let data = { isActive: this.status ? this.status : 'true' }
    this.service.getCountryList(data).subscribe((res) => res['code'] == 200 && (this.countryList = res['data']))
  }
  getState(countryId) {
    this.service.getStateList({ countryId: countryId, isActive: 'true' }).subscribe((res) => res['code'] == 200 && (this.stateList = res['data']))
  }
  getCityByZipcode() {
    this.spinner.show()
    let data = { zipcode: this.zipcode }
    this.service.getCityByZipcode(data).subscribe(
      (res) => {
        this.spinner.hide()
        if (res['code'] == 200) {
          this.validZipCode = res['data'].city
          this.formTwo.patchValue({ city: res['data'].city, postalCode: res['data'].zip })
          this.formTwo.patchValue({ city: res['data'].city, postalCode: res['data'].zip })
        } else {
          this.toastr.warning(res['message'])
          this.formTwo.patchValue({ city: '', postalCode: '' })
          this.formTwo.patchValue({ city: '', postalCode: '' })
          return false
        }
      },
      (error) => {
        this.toastr.error('server error')
      }
    )
  }
  getselectval(val) {
    this.countryId = val
    if (this.countryId) {
      this.getState(this.countryId)
      this.formTwo.controls['state'].reset()
      this.formTwo.controls['state'].updateValueAndValidity()
    }
  }
  getSeller() {
    let data = { userId: this.userObj.userInfo._id }
    this.spinner.show()
    this.service.getSellerDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.formTwo.patchValue(response['data'])
          this.formTwo.patchValue(response['data'].sellerData)
          this.formTwo.patchValue({ ssn: response['data'].sellerData.ssnNumber })
          this.legalentity = response['data'].sellerData.legalEntity
          this.legalEntityOption = response['data'].sellerData.legalEntityOption
          this.sellerData = response['data'].sellerData
          this.country = response['data'].countryName
          this.getState(response['data'].country)
        } else this.toastr.warning('', response['message'])
        this.spinner.hide()
      },
      (error) => {
        this.toastr.error('server error')
      }
    )
  }
  goBack() {
    window.history.back()
  }
  onSubmit() {
    if (this.legalentity && this.formTwo.valid) {
      this.formDataTwo = this.formTwo.value
      let data = { userId: this.userId, legalentity: this.legalentity, ...this.formDataTwo, legalEntityOption: this.legalEntityOption, profileComplete: true }
      this.spinner.show()
      this.service.sellerProfile(data).subscribe((res) => {
        if (res['code'] == 200) {
          this.toastr.success(res['message'])
          this.router.navigate(['/layout/e-commerce/dashboard'])
        } else this.toastr.success(res['message'])
        this.spinner.hide()
      })
    } else{
      this.service.markFormGroupTouched(this.formTwo)
      this.toastr.error("Your profile is not completed as a seller.")
    } 
  }
}
