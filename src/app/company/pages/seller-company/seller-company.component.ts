import { Component, OnInit, Renderer2, Inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { SharedService } from 'src/app/service/shared.service'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import moment from 'moment'
@Component({
  selector: 'app-seller-company',
  templateUrl: './seller-company.component.html',
  styleUrls: ['./seller-company.component.css'],
})
export class SellerCompanyComponent implements OnInit {
  updateCompanyProfileForm: FormGroup
  formState: any
  formCountry: any
  stateList: any
  counter: any
  logoChangedEvent: any
  progressData: any = {}
  companyservicesArray: any = []
  servicesArrayView: any = []
  countryId: any
  countryList: any
  status: any
  userId: any
  userObj: any
  companyFrmlength = genralConfig.storage.COMPANYFROMFIELDS
  croppedLogo: any
  imageChangedEvent: any
  croppedImage: string
  finalCroppedLogo: File
  uploadedCompanyLogo: any
  previewUrlLogo: string
  finalCroppedBanner: File
  uploadedBannerImage: any
  zipcode: any
  validZipCode: any
  public date: moment.Moment

  profileLogo: any
  bannerImage: any
  public banner_img_path = environment.URLHOST + '/uploads/company/banner/'
  public companyLogo_path = environment.URLHOST + '/uploads/company/'
  public image_url_profile = environment.URLHOST + '/uploads/company/banner/'
  public logo_url_profile = environment.URLHOST + '/uploads/company/'
  public image_enduser_profile = environment.URLHOST + '/uploads/enduser/'
  minDateOfBirth: string
  roleName: any
  isLoading:boolean=false
  isLoadingBanner:boolean = false
  isLoadingLogo: boolean = false
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private formbuilder: FormBuilder,
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private SharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit() {
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.userId = this.userObj.userInfo._id
    this.updateCompanyProfileForm = this.formbuilder.group({
      companyName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      firstName: ['', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      lastName: ['', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      incorporationDate: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE)]],
      email: ['', [Validators.required, Validators.pattern(genralConfig.pattern.EMAIL)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(genralConfig.pattern.PHONE_NO)]],
      middleName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      aboutCompany: ['', [Validators.required, this._generalService.noWhitespaceValidator]],
      postalCode: ['', [Validators.required, this._generalService.noWhitespaceValidator, Validators.minLength(genralConfig.pattern.MINLENGTH)]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      roleTitle: genralConfig.rolename.COMPANY,
    })
    this.getDetails()
    this.getCountry()
    this.minDateOfBirth = moment(new Date()).format('YYYY-MM-DD')
  }

  getDetails() {
    let data = { userId: this.userId }
    this._generalService.getAllUserDetails(data).subscribe((res) => {
      this.updateCompanyProfileForm.patchValue(res['data'])
      this.updateCompanyProfileForm.patchValue({
        country: res['data'].countryId,
        state: res['data'].stateId,
        address: res['data'].address,
        incorporationDate: res['data'].incorporationDate || res['data'].dateOfBirth,
      })
      let state = res['data'].countryId
      this.formState = res['data'].stateName
      this.formCountry = res['data'].countryName
      this.getState(state)
    })
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

  logoChangeEvent(event: any): void {
    this.isLoading = true
    this.logoChangedEvent = event
    if (this.logoChangedEvent.target.files[0].name) document.getElementById('open-diaLog-logo').click()
  }

  //event for logo image
  logoCropped(event: ImageCroppedEvent) {
    this.isLoading = false
    this.croppedLogo = event.base64
  }

  stateEmpty() {
    this.updateCompanyProfileForm.patchValue({ state: '' })
  }

  //event for banner image
  fileChangeEvent(event: any): void {
    if (event.target.files[0].size > 5242880) throw this.toastr.warning('File size must be less then 5 mb')
    this.isLoading = true
    this.imageChangedEvent = event
    if (this.imageChangedEvent.target.files[0].name) document.getElementById('open-diaLog').click()
  }
  //event for banner image
  imageCropped(event: ImageCroppedEvent) {
    this.isLoading = false
    this.croppedImage = event.base64
  }

  //for banner image
  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI)
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const int8Array = new Uint8Array(arrayBuffer)
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([int8Array], { type: this.imageChangedEvent.target.files[0].type })
    return blob
  }

  //  for logo image
  DATAURItoBlob(dataURI) {
    const byteString = atob(dataURI)
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const int8Array = new Uint8Array(arrayBuffer)
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([int8Array], { type: this.logoChangedEvent.target.files[0].type })
    return blob
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  uploadCompanyLogo() {
    this.isLoadingLogo = true
    const imageName = this.logoChangedEvent.target.files[0].name
    const imageBlob = this.DATAURItoBlob(this.croppedLogo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''))
    this.finalCroppedLogo = new File([imageBlob], imageName, { type: this.logoChangedEvent.target.files[0].type })
    if (this.finalCroppedLogo != undefined) {
      const formData = new FormData()
      formData.append('file', this.finalCroppedLogo)
      formData.append('type', 'COMPANYLOGO')
      this._generalService.uploadImageForPath(formData).subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.uploadedCompanyLogo = res['data'].imagePath
            this.isLoadingLogo = false
            this.finalCroppedLogo = null
            this.croppedLogo = null
          } else {
            this.finalCroppedLogo = null
            window.scrollTo(0, 0)
            this.toastr.error(res['message'])
          }
          this.spinner.hide()
        },
        () => this.spinner.hide()
      )
    } else this.previewUrlLogo = ''
  }
  uploadBannerImage() {
    this.isLoadingBanner = true
    const imageName = this.imageChangedEvent.target.files[0].name
    const imageBlob = this.dataURItoBlob(this.croppedImage.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''))
    this.finalCroppedBanner = new File([imageBlob], imageName, { type: this.imageChangedEvent.target.files[0].type })
    if (this.finalCroppedBanner != undefined) {
      const formData = new FormData()
      formData.append('file', this.finalCroppedBanner)
      formData.append('type', 'COMPANYBANNER')
      this._generalService.uploadImageForPath(formData).subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.uploadedBannerImage = res['data'].imagePath
            this.isLoadingBanner = false
            this.finalCroppedBanner = null
            this.croppedImage = null
          } else {
            window.scrollTo(0, 0)
            this.toastr.error(res['message'])
            this.finalCroppedBanner = null
          }
          this.spinner.hide()
        },
        () => this.spinner.hide()
      )
    } else this.previewUrlLogo = ''
  }

  getCityByZipcode() {
    this.spinner.show()
    let data = { zipcode: this.zipcode }
    this._generalService.getCityByZipcode(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.validZipCode = res['data'].city
        this.updateCompanyProfileForm.patchValue({ city: res['data'].city, postalCode: res['data'].zip })
      } else {
        this.toastr.warning(res['message'])
        this.updateCompanyProfileForm.patchValue({ city: '', postalCode: '' })
      }
      this.spinner.hide()
    })
  }

  onSubmitCompanyProfileForm() {
    if (this.updateCompanyProfileForm.valid) {
      this.counter = ((this.companyFrmlength - 2) * 100) / this.companyFrmlength
      this.updateCompanyProfileForm.value.companyLogo = this.uploadedCompanyLogo
      this.updateCompanyProfileForm.value.bannerImage = this.uploadedBannerImage
      this.updateCompanyProfileForm.value.userId = this.userObj.userInfo._id
      this.updateCompanyProfileForm.value.roleTitle = genralConfig.rolename.COMPANY
      this.updateCompanyProfileForm.value.profileComplete = true
      if (this.updateCompanyProfileForm.value.companyLogo || this.profileLogo) this.counter += 100 / this.companyFrmlength
      if (this.updateCompanyProfileForm.value.bannerImage || this.bannerImage) this.counter += 100 / this.companyFrmlength
      this.progressData = { value: this.counter }
      this.SharedService.setProfileProgress(this.progressData)
      let tempVar = ''
      tempVar = this.counter
      localStorage.setItem('progressBar', tempVar)
      this.SharedService.setProfileProgress(this.progressData)
      this.servicesArrayView = []
      this.spinner.show()
      this.updateCompanyProfileForm.value.progressBar = this.counter
      this._generalService.sellerToCompany(this.updateCompanyProfileForm.value).subscribe(
        (result) => {
          if (result['code'] == 200) {
            let userObj = JSON.parse(localStorage.getItem('truckStorage'))
            let userInfo = {}
            userInfo['userInfo'] = result['data'].userInfo
            this.SharedService.setHeader(userInfo)
            localStorage.setItem('truckStorage', JSON.stringify(userInfo))
            this.SharedService.setHeader(userInfo)
            this.toastr.success('', result['message'])
            this.router.navigate(['/layout/e-commerce/dashboard'])
          } else this.toastr.warning('', result['message'])
          this.spinner.hide()
        },
        () => {
          this.spinner.hide()
          this.toastr.error('', 'Something went wrong')
        }
      )
    } else this._generalService.markFormGroupTouched(this.updateCompanyProfileForm)
  }
}
