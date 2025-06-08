import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { Router } from '@angular/router'
import moment from 'moment'
import { TranslateService } from '@ngx-translate/core'
import { SharedService } from 'src/app/service/shared.service'
import { ChatService } from 'src/app/chat_files/socket-service/chat.service'

@Component({
  selector: 'app-company-to-seller',
  templateUrl: './company-to-seller.component.html',
  styleUrls: ['./company-to-seller.component.css'],
})
export class CompanyToSellerComponent implements OnInit {
  formTwo: FormGroup
  formOne: FormGroup
  formThree: FormGroup
  userObj: any
  userId: any
  counter: number
  legalentity: any
  stateList: any
  countryList: any
  status: any
  countryId: any
  formDataOne: any
  formDataTwo: any
  sellerFrmlength = genralConfig.storage.SELLERFROMFIELDS
  countryNameDetails: any
  stateName: any
  formCountry: any
  formState: any
  public disabled = false
  public date: moment.Moment
  yesSelectOptionDropdown = [
    { title: 'Single - member LLC ( Limited liability company)' },
    { title: 'Cooperation / multi - member LLC' },
    { title: 'Partnership' },
    { title: 'Publicly traded company' },
    { title: 'Non - profit' },
  ]
  validZipCode: any
  zipcode: any
  minDateOfBirth: string
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private formbuilder: FormBuilder,
    private _generalService: GeneralServiceService,
    private renderer: Renderer2,
    private translate: TranslateService,
    private chatService: ChatService,
    private SharedService: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private sharedService: SharedService,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => {
      this.ngZone.run(() => {
        this.changeDetector.detectChanges()
      })
    })
  }
  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.formOne = this.formbuilder.group({
      legalentity: ['', Validators.required],
      legalEntityOption: [''],
    })
    this.formTwo = this.formbuilder.group({
      companyName: [''],
      personName: [''],
      firstName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE), Validators.pattern(genralConfig.pattern.REPORTNAME)]],
      lastName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE), Validators.pattern(genralConfig.pattern.REPORTNAME)]],
      email: ['', [Validators.required, Validators.pattern(genralConfig.pattern.EMAIL)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(genralConfig.pattern.PHONE_NO)]],
      dateOfBirth: ['', [Validators.required]],
      ssn: [''],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required, this._generalService.noWhitespaceValidator, Validators.minLength(genralConfig.pattern.MINLENGTH)]],
      address: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE)]],
    })
    this.formThree = this.formbuilder.group({})
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.getDetails()
    this.getCountry()
    this.minDateOfBirth = moment(new Date()).format('YYYY-MM-DD')
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  nameReq(e) {
    if (e == 'yes') {
      this.formTwo.controls['companyName'].setValidators([Validators.required])
      this.formTwo.controls['companyName'].updateValueAndValidity()
    } else {
      this.formTwo.controls['companyName'].reset()
      this.formOne.controls['legalEntityOption'].reset()
      this.formTwo.get('companyName').setValidators([])
      this.formTwo.controls['companyName'].updateValueAndValidity()
    }
  }
  formOneCheck() {
    if (!this.formOne.valid) {
      this.formOne.controls['legalentity'].markAsTouched()
    }
  }
  getCountry() {
    let data = { isActive: this.status ? this.status : 'true' }
    this._generalService.getCountryList(data).subscribe((res) => res['code'] == 200 && (this.countryList = res['data']))
  }
  getselectval(val) {
    this.countryId = val
    if (this.countryId) this.getState(this.countryId)
  }
  getState(countryId) {
    this._generalService.getStateList({ countryId: countryId, isActive: 'true' }).subscribe((res) => res['code'] == 200 && (this.stateList = res['data']))
  }
  getCityByZipcode() {
    this.spinner.show()
    let data = { zipcode: this.zipcode }
    this._generalService.getCityByZipcode(data).subscribe(
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
      () => this.toastr.error('server error')
    )
  }
  getDetails() {
    let data = { userId: this.userId }
    this._generalService.getAllUserDetails(data).subscribe(
      (res) => {
        this.formTwo.patchValue(res['data'])
        this.formTwo.patchValue({ country: res['data'].countryId, state: res['data'].stateId, address: res['data'].address, dateOfBirth: res['data'].incorporationDate || res['data'].dateOfBirth })
        let state = res['data'].countryId
        this.formState = res['data'].stateName
        this.formCountry = res['data'].countryName
        this.getState(state)
      },
      () => this.toastr.error('server error')
    )
  }

  onSubmit() {
    this.formDataOne = this.formOne.value
    this.formDataTwo = this.formTwo.value
    if (this.formOne.valid && this.formTwo.valid) {
      this.counter = (this.sellerFrmlength * 100) / this.sellerFrmlength
      let data = {
        userId: this.userId,
        legalentity: this.legalentity,
        ...this.formDataOne,
        ...this.formDataTwo,
        profileComplete: true,
        progressBar: this.counter,
        roleTitle: 'SELLER',
      }
      this.spinner.show()
      this._generalService.becomeSeller(data).subscribe(
        (res) => {
          if (res['code'] == 200) {
            let userInfo = {}
            userInfo['userInfo'] = res['data'].userInfo
            userInfo['userInfo']['planName'] = this.userObj.userInfo.planName
            userInfo['userInfo']['companyName'] = this.formTwo.value.companyName
            this.SharedService.setHeader(userInfo)
            localStorage.setItem('truckStorage', JSON.stringify(userInfo))
            this.toastr.success(res['message'])
            this.router.navigate(['/layout/myaccount/dashboard'])
            this.logout()
          } else this.toastr.warning(res['message'])
          this.spinner.hide()
        },
        () => this.toastr.error('server error')
      )
    }
  }
  getName(name) {
    this.countryNameDetails = name
  }
  State(name) {
    this.stateName = name
  }

  logout() {
    let ipAddress = localStorage.getItem('ipAddress')
    let userId = localStorage.getItem('truck_userId')
    let source = localStorage.getItem('source')
    let logoutDate = new Date()

    let logoutHistory = { ipAddress: ipAddress, userId: userId, source: source, logoutDate: logoutDate }
    this._generalService.userLogOut(logoutHistory).subscribe(
      async (result) => {
        this.chatService.leaveConversation(this.userObj.userInfo._id)
        await this.translate.setDefaultLang('en')
        localStorage.clear()
        localStorage.removeItem('userToken')
        localStorage.removeItem('truckStorage')
        localStorage.removeItem('planName')
        this.router.navigate(['/login'])
        this.sharedService.setHeader({})
        this.sharedService.setPath('')
      },
      () => {
        localStorage.clear()
        this.sharedService.setHeader({})
        this.sharedService.setPath('')
        this.router.navigate(['/login'])
      }
    )
  }
}
