import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { ThemePalette } from '@angular/material'
import { GeneralServiceService } from '../../../../core/general-service.service'
import * as moment from 'moment'
import { environment } from 'src/environments/environment'
import { MapsAPILoader } from '@agm/core'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  providers: [NgxSpinnerService],
})
export class CreateEventComponent implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef

  public editor = ClassicEditor
  addEventForm: FormGroup
  currentDate = new Date()
  startDate = moment(this.currentDate).format('YYYY-MM-DD')
  endDate = new Date(moment.utc(this.startDate).format('YYYY-MM-DD').toString())
  public date: moment.Moment
  public disabled = false
  public showSpinners = true
  public showSeconds = false
  public touchUi = false
  public enableMeridian = false
  public maxDate: moment.Moment
  public min = this.endDate
  public stepHour = 1
  public stepMinute = 1
  public stepSecond = 1
  public color: ThemePalette = 'primary'
  eventTypesList = genralConfig.eventTypesList
  timeZoneList: any
  eventForm: FormGroup
  uploadedBannerImage: string = ''
  userId = ''
  bannerImage: any
  brodcastLink: any
  isChecked: any
  companyLogo: any
  startTime: any
  endTime: any
  time: any
  onlineEvent: any = false
  previewBannerimg: string | ArrayBuffer
  uploadedBrandLogo: any
  public banner_img_path = environment.URLHOST + genralConfig.Images.eventBanner
  public brandLogo_path = environment.URLHOST + genralConfig.Images.eventLogo
  geoCoder: any
  googleaddress: any = {}
  createdId: any
  lat: number
  lng: number
  role: any
  fullAddress: string = ''
  onlineshow: boolean = false
  imageChangedEvent: any
  croppedImage: string
  finalCroppedBanner: File
  currency = genralConfig.currency
  logoChangedEvent: any
  croppedLogo: string
  finalCroppedLogo: File
  roleTitle: any
  companyId: any
  newTimeZone: Date
  timeZone: any
  startTimeDis: string
  endTimeDis: string
  isLoading:boolean=false
  isLoadingBanner: boolean = false
  isLoadingLogo: boolean = false

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    if (localStorage.getItem('truckStorage') != null) {
      let userData = JSON.parse(localStorage.getItem('truckStorage'))
      this.userId = userData.userInfo._id
      this.createdId = userData.userInfo.roleId.createdby_id
      this.roleTitle = userData.userInfo.roleId.roleTitle
      this.companyId = userData.userInfo.companyId
    }

    this.eventForm = this.formbuilder.group({
      name: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE)]],
      address: ['', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE)]],
      venue: ['', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE)]],
      description: [''],
      timezoneId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      speaker: ['', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE)]],
      visibility: ['', Validators.required],
      currency: ['', Validators.required],
      eventFee: ['', [Validators.required]],
      brodcastLink: [''],
    })

    this.getTimezone()
    this.autosearch()
  }

  getTimezone() {
    this.spinner.show()
    this._generalService.getTimeZoneList({ isActive: 'true', isDeleted: 'false' }).subscribe(
      (res) => {
        if (res['code'] == 200) this.timeZoneList = res['data']
        this.spinner.hide()
      },
      () => {
        this.toastr.warning('Server error')
        this.spinner.hide()
      }
    )
  }

  //  Condition Based Required
  setOnlineEventValue(event) {
    this.onlineEvent = event.checked
    this.onlineshow = true
    if (this.onlineEvent == true) {
      this.onlineshow = false
      this.eventForm.controls['brodcastLink'].setValidators([Validators.required, Validators.pattern(genralConfig.pattern.URL)])
      this.eventForm.controls['brodcastLink'].updateValueAndValidity()
      this.eventForm.controls['address'].setValidators([])
      this.eventForm.controls['address'].updateValueAndValidity()
      this.eventForm.controls['venue'].setValidators([])
      this.eventForm.controls['venue'].updateValueAndValidity()
      this.eventForm.patchValue({ address: '', venue: '' })
    } else {
      this.eventForm.controls['address'].setValidators([Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE)])
      this.eventForm.controls['address'].updateValueAndValidity()
      this.eventForm.controls['venue'].setValidators([Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE)])
      this.eventForm.controls['venue'].updateValueAndValidity()
      this.eventForm.controls['brodcastLink'].setValidators([])
      this.eventForm.controls['brodcastLink'].updateValueAndValidity()
      this.eventForm.patchValue({ brodcastLink: '' })
    }
  }

  change() {
    this.startTimeDis = moment(this.eventForm.value.startDate).tz(this.timeZone.timezoneCity).format('YYYY-MM-DD HH:mm:ss')
    this.endTimeDis = moment(this.eventForm.value.endDate).tz(this.timeZone.timezoneCity).format('YYYY-MM-DD HH:mm:ss')
  }

  onSubmit() {
    if (this.eventForm.valid) {
      if (this.onlineEvent == false) {
        if (!this.fullAddress) {
          this.toastr.warning('Select location from Dropdown')
          return false
        }
        this.eventForm.value.broadcast = {}
      } else if (this.onlineEvent == true) {
        let brodcastObj = { link: this.brodcastLink, isChecked: this.onlineEvent }
        this.eventForm.value.broadcast = brodcastObj
      }
      this.eventForm.value.eventMode = this.onlineEvent == true ? 'online' : 'offline'
      this.eventForm.value.brandLogo = this.uploadedBrandLogo
      this.eventForm.value.bannerImage = this.uploadedBannerImage
      this.eventForm.value.address = this.fullAddress
      this.eventForm.value.lat = this.lat
      this.eventForm.value.lng = this.lng
       this.eventForm.value.userId = this.userId

      if (this.roleTitle == 'COMPANY') {
        this.eventForm.value.createdById = this.userId
        this.eventForm.value.companyId = this.userId
      } else {
        this.eventForm.value.createdById = this.companyId
        this.eventForm.value.companyId = this.companyId
      }


      this.eventForm.value.planTitle = 'EVENT'
      this.eventForm.value.constName = 'NOOFEVENTS'
      this.eventForm.value.roleTitle = this.roleTitle
      let timeZoneStart = moment(this.eventForm.value.startDate).tz(this.timeZone.timezoneCity)
      let timeZoneEnd = moment(this.eventForm.value.endDate).tz(this.timeZone.timezoneCity)
      this.eventForm.value.startDate = moment(timeZoneStart).utc()
      this.eventForm.value.endDate = moment(timeZoneEnd).utc()
      this.spinner.show()
      this.eventForm.value.eventFee = parseFloat(this.eventForm.value.eventFee)
      this._generalService.addEvent(this.eventForm.value).subscribe(
        (result) => {
          if (result['code'] == 200) {
            this.toastr.success(result['message'])
            this.router.navigate(['/layout/myaccount/event-management'])
          } else this.toastr.warning(result['message'])

          this.spinner.hide()
        },
        () => {
          this.spinner.hide()
          this.toastr.error('Server Error')
        }
      )
    }
  }

  // GOOGLE AUTOPLACE API
  autosearch() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder()
      var options = {
        componentRestrictions: { country: ['us', 'mx', 'ca'] },
      }
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, options)
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace()
          if (place.geometry === undefined || place.geometry === null) {
            return
          }
          this.googleaddress.lat = place.geometry.location.lat()
          this.googleaddress.lng = place.geometry.location.lng()
          this.googleaddress.fullAddress = place.formatted_address
          this.lat = this.googleaddress.lat
          this.lng = this.googleaddress.lng
          this.fullAddress = this.googleaddress.fullAddress
        })
      })
    })
  }
  // uploadBanner
  uploadBannerImage() {
    this.isLoadingBanner = true
    const imageName = this.imageChangedEvent.target.files[0].name
    const imageBlob = this.dataURItoBlob(this.croppedImage.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''))
    this.finalCroppedBanner = new File([imageBlob], imageName, { type: this.imageChangedEvent.target.files[0].type })
    if (this.finalCroppedBanner != undefined) {
      const formData = new FormData()
      formData.append('file', this.finalCroppedBanner)
      formData.append('type', 'BANNERIMAGE')
      // this.spinner.show()
      this._generalService.uploadImageForPath(formData).subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.isLoadingBanner = false
            this.uploadedBannerImage = res['data'].imagePath
          }
          else {
            window.scrollTo(0, 0)
            this.toastr.error(res['message'])
          }
          // this.spinner.hide()
        },
        () => {
          this.spinner.hide()
          this.toastr.error('Server error')
        }
      )
    }
  }
  // uploadLogo
  uploadBrandLogo() {
  
    this.isLoadingLogo = true
    const imageName = this.logoChangedEvent.target.files[0].name
    const imageBlob = this.DATAURItoBlob(this.croppedLogo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''))
    this.finalCroppedLogo = new File([imageBlob], imageName, { type: this.logoChangedEvent.target.files[0].type })
    if (this.finalCroppedLogo != undefined) {
      const formData = new FormData()
      formData.append('file', this.finalCroppedLogo)
      formData.append('type', 'BRANDLOGO')
      this._generalService.uploadImageForPath(formData).subscribe(
        (res) => {
          if (res['code'] == 200) {this.uploadedBrandLogo = res['data'].imagePath
             this.isLoadingLogo = false
        
        }
          else {
            window.scrollTo(0, 0)
            this.toastr.error(res['message'])
          }
          this.spinner.hide()
        },
        () => {
          this.spinner.hide()
          this.toastr.error('Server Error')
        }
      )
    }
  }

  calcTime(offset) {
    this.timeZone = offset.find((oof) => oof._id === this.eventForm.value.timezoneId)
    this.eventForm.controls['startDate'].reset()
    this.eventForm.controls['endDate'].reset()
    var d = new Date()
    var utc = d.getTime() + d.getTimezoneOffset() * 60000
    let timezone = this.timeZone.offset.split(' ')
    var nd = new Date(utc + 3600000 * timezone[1])
    this.min = nd
  }

  //cropper banner image logic start
  fileChangeEvent(event: any) {
    if (event.target.files[0].size > 5242880) throw this.toastr.warning('File size must be less then 5 mb')
    this.isLoading = true
    this.imageChangedEvent = event
    if (this.imageChangedEvent.target.files[0].name) document.getElementById('open-diaLog').click()
  }
  imageCropped(event: ImageCroppedEvent) {
    this.isLoading = false
    this.croppedImage = event.base64
  }
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
  imageLoaded() {}
  cropperReady() {}
  loadImageFailed() {}
  logoChangeEvent(event: any): void {
    this.isLoading = true
    if (event.target.files[0].size > 5242880) throw this.toastr.warning('File size must be less then 5 mb')
    this.logoChangedEvent = event
    if (this.logoChangedEvent.target.files[0].name) document.getElementById('open-diaLog-logo').click()
  }
  logoCropped(event: ImageCroppedEvent) {
    this.isLoading = false
    this.croppedLogo = event.base64
  }
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
}
