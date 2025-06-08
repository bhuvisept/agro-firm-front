import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ThemePalette } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'
import * as moment from 'moment'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { MapsAPILoader } from '@agm/core'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { MatDialog } from '@angular/material/dialog'
import { EventCancelComponent } from '../event-cancel/event-cancel.component'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
})
export class EditEventComponent implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef
  public editor = ClassicEditor

  currentDate = new Date()
  startDate = moment.utc(this.currentDate).format('YYYY-MM-DD')
  endDate = new Date(moment.utc(this.startDate).add(1, 'days').format('YYYY-MM-DD'))
  public min = this.endDate
  public date: moment.Moment
  public disabled = false
  public showSpinners = true
  public showSeconds = false
  public touchUi = false
  public enableMeridian = false
  public minDate: moment.Moment
  public maxDate: moment.Moment
  public stepHour = 1
  public stepMinute = 1
  public stepSecond = 1
  public color: ThemePalette = 'primary'
  roleTitle: any

  // Event Types
  eventTypesList = genralConfig.eventTypesList
  eventType: any
  fileData: File = null
  fileInputBanner: File
  fileInputLogo: File
  fileInputVideo: File
  previewUrlLogo: any = null
  previewUrlVideo: any = null
  uploadedBannerImage: string = ''
  editEventForm: FormGroup
  getEventInfoList: any = []
  userId = ''
  eventId: any
  onlineEvent: any = false
  uploadedBrandLogo: any
  public banner_img_path = environment.URLHOST + genralConfig.Images.eventBanner
  public brandLogo_path = environment.URLHOST + genralConfig.Images.eventLogo
  fullAddress: string
  locationList: any
  geoCoder: any
  googleaddress: any = {}
  status: String
  companyLogo: any
  timezoneId: any
  timeZoneList: any = []
  broadcast: any
  isChecked: any
  online: boolean = false
  lat: number
  lng: number
  textarea: any
  bannerImage: any = ''
  brandLogo: any = ''
  addressError: boolean = false
  venueError: boolean = false
  onlineshow: boolean = true
  deleteArray = genralConfig.deleteArray
  isDeleted: string
  currency = genralConfig.currency
  imageChangedEvent: any
  croppedImage: string
  finalCroppedBanner: File
  logoChangedEvent: any
  croppedLogo: string
  finalCroppedLogo: File
  timeZone: any
  endTimeDis: string
  startTimeDis: string
  isLoading: boolean=false
  isLoadingBanner: boolean = false
  isLoadingLogo: boolean = false
  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private _generalService: GeneralServiceService,
    private route: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader,
    public dialog: MatDialog,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    if (localStorage.getItem('truckStorage') != null) this.userId = JSON.parse(localStorage.getItem('truckStorage')).userInfo._id
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleTitle = userData.userInfo.roleId.roleTitle

    this.route.params.subscribe((params) => (this.eventId = params.id))
    this.editEventForm = this.formBuilder.group({
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
      isDeleted: [''],
      brodcastLink: [''],
    })

    this.getTimezone()
    this.getEventInfo()
    this.autosearch()
  }

  setOnlineEventValue(event) {
    this.onlineEvent = event.checked
    this.onlineshow = true
    this.customRequired()
  }

  customRequired() {
    if (this.onlineEvent == true) {
      this.onlineshow = false
      this.editEventForm.controls['brodcastLink'].setValidators([Validators.required, Validators.pattern(genralConfig.pattern.URL)])
      this.editEventForm.controls['brodcastLink'].updateValueAndValidity()
      this.editEventForm.controls['address'].setValidators([])
      this.editEventForm.controls['address'].updateValueAndValidity()
      this.editEventForm.controls['venue'].setValidators([])
      this.editEventForm.controls['venue'].updateValueAndValidity()
      this.editEventForm.patchValue({ address: '', venue: '' })
    } else {
      this.editEventForm.controls['address'].setValidators([Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE)])
      this.editEventForm.controls['address'].updateValueAndValidity()
      this.editEventForm.controls['venue'].setValidators([Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE)])
      this.editEventForm.controls['venue'].updateValueAndValidity()
      this.editEventForm.controls['brodcastLink'].setValidators([])
      this.editEventForm.controls['brodcastLink'].updateValueAndValidity()
      this.editEventForm.patchValue({ brodcastLink: '' })
    }
  }

  getEventInfo() {
    let eventIdObj = { eventId: this.eventId }
    this.spinner.show()
    this._generalService.eventView(eventIdObj).subscribe(
      (res) => {
        if (res['code'] == 200) {
          
          this.getEventInfoList = res['data']
          this.fullAddress = this.getEventInfoList.address
          this.eventType = this.getEventInfoList.eventMode
          this.onlineEvent = this.eventType == 'online' ? true : false
          this.customRequired()
          this.uploadedBrandLogo = this.getEventInfoList.brandLogo
          this.uploadedBannerImage = this.getEventInfoList.bannerImage
          this.isDeleted = this.getEventInfoList.isDeleted ? 'true' : 'false'
          this.editEventForm.patchValue(this.getEventInfoList)
          this.editEventForm.patchValue({ isDeleted: this.isDeleted, brodcastLink: this.getEventInfoList.broadcast.link })
        } else {
          window.scrollTo(0, 0)
          this.toastr.error(res['message'])
        }
        this.spinner.hide()
      },
      () => {
        this.toastr.error('error')
        this.spinner.hide()
      }
    )
  }

  archivedMessage() {
    if (this.getEventInfoList.bookingCount) {
      this.dialog
        .open(EventCancelComponent, { width: '558px', data: this.getEventInfoList.bookingCount })
        .afterClosed()
        .subscribe((result) => result && result.apiHit == true && this.updateEvent())
    }
  }

  change() {
    this.startTimeDis = moment(this.editEventForm.value.startDate).tz(this.timeZone.timezoneCity).format('YYYY-MM-DD HH:mm:ss')
    this.endTimeDis = moment(this.editEventForm.value.endDate).tz(this.timeZone.timezoneCity).format('YYYY-MM-DD HH:mm:ss')
  }

  calcTime(offset) {
    this.timeZone = offset.find((oof) => oof._id === this.editEventForm.value.timezoneId)
    this.change()
    var d = new Date()
    var utc = d.getTime() + d.getTimezoneOffset() * 60000
    let timezone = this.timeZone.offset.split(' ')
    var nd = new Date(utc + 3600000 * timezone[1])
    this.min = nd
  }

  uploadBannerImage() {
    this.isLoadingBanner = true
    const imageName = this.imageChangedEvent.target.files[0].name
    const imageBlob = this.dataURItoBlob(this.croppedImage.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''))
    this.finalCroppedBanner = new File([imageBlob], imageName, { type: this.imageChangedEvent.target.files[0].type })
    if (this.fileData != this.finalCroppedBanner) {
      const formData = new FormData()
      formData.append('file', this.finalCroppedBanner)
      formData.append('type', 'BANNERIMAGE')
      this.spinner.show()
      this._generalService.uploadImageForPath(formData).subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.uploadedBannerImage = res['data'].imagePath
            this.isLoadingBanner = false
          }
          else {
            window.scrollTo(0, 0)
            this.toastr.error(res['message'])
          }
          this.spinner.hide()
        },
        () => this.spinner.hide()
      )
    } else this.previewUrlLogo = ''
  }

  getTimezone() {
    this._generalService.getTimeZoneList({ isActive: this.status ? this.status : 'true' }).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.timeZoneList = res['data']
          setTimeout(() => this.calcTime(this.timeZoneList), 100)
        }
      },
      () => this.toastr.warning('Server error')
    )
  }

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
          if (res['code'] == 200) {
            this.uploadedBrandLogo = res['data'].imagePath
            this.isLoadingLogo = false
          }
          else {
            window.scrollTo(0, 0)
            this.toastr.error(res['message'])
          }
          this.spinner.hide()
        },
        () => this.spinner.hide()
      )
    } else this.previewUrlLogo = ''
  }

  updateEventInfo() {
    if (this.getEventInfoList.bookingCount) this.archivedMessage()
    else this.updateEvent()
  }

  updateEvent() {
    if (this.editEventForm.valid) {
      if (this.onlineEvent == false) {
        if (!this.fullAddress) {
          this.toastr.warning('Select location from Dropdown')
          return false
        }
        this.editEventForm.value.lat = this.lat ? this.lat : this.getEventInfoList.location.coordinates[1]
        this.editEventForm.value.lng = this.lng ? this.lng : this.getEventInfoList.location.coordinates[0]
        this.editEventForm.value.address = this.fullAddress || this.getEventInfoList.address
        this.editEventForm.value.broadcast = {}
      } else if (this.onlineEvent == true) {
        let brodcastObj = { link: this.editEventForm.value.brodcastLink, isChecked: this.onlineEvent }
        this.editEventForm.value.broadcast = brodcastObj
      }
      this.editEventForm.value.eventMode = this.onlineEvent == true ? 'online' : 'offline'
      this.editEventForm.value.brandLogo = this.uploadedBrandLogo
      this.editEventForm.value.bannerImage = this.uploadedBannerImage
      this.editEventForm.value.createdBy = this.userId
      this.editEventForm.value.eventId = this.eventId
      let timeZoneStart = moment(this.editEventForm.value.startDate).tz(this.timeZone.timezoneCity)
      let timeZoneEnd = moment(this.editEventForm.value.endDate).tz(this.timeZone.timezoneCity)
      this.editEventForm.value.startDate = moment(timeZoneStart).utc()
      this.editEventForm.value.endDate = moment(timeZoneEnd).utc()

      // this.editEventForm.value.eventFee.replace(",","")
      this.editEventForm.value.eventFee = parseFloat(this.editEventForm.value.eventFee).toFixed(2)
      this.editEventForm.value.planTitle = 'EVENT'
      this.editEventForm.value.constName = 'NOOFEVENTS'
      this.editEventForm.value.roleTitle = this.roleTitle
      this.editEventForm.value.companyId = this.userId
      this._generalService.eventUpdate(this.editEventForm.value).subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.getEventInfoList = res['data']
            this.toastr.success('Event Updated Successfully')
            this.router.navigateByUrl('/layout/myaccount/event-management')
          } else {
            window.scrollTo(0, 0)
            this.toastr.error(res['message'])
          }
          this.spinner.hide()
        },
        () => this.spinner.hide()
      )
    }
  }

  autosearch() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder()
      var options = { componentRestrictions: { country: ['us', 'mx', 'ca'] } }
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

  //cropper event logo
  logoChangeEvent(event: any): void {
    this.isLoading = true
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
