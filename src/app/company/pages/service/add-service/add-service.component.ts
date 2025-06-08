import { Component, NgZone, Inject, OnInit, Renderer2, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { MapsAPILoader } from '@agm/core'
import { ImageCroppedEvent } from 'ngx-image-cropper'

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css'],
})
export class AddServiceComponent implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef
  userId: String = ''
  createdById: any
  description: ''
  previewUrlLogo: any = null
  serviceName: ''
  serviceCost: Number
  geoCoder: any
  googleaddress: any = {}
  lat: number
  lng: number
  fullAddress: string = ''
  currency = genralConfig.currency
  public serviceImage = environment.URLHOST + '/uploads/service/'
  addservice = new FormGroup({
    serviceName: new FormControl('', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE)]),
    contactNumber: new FormControl('', [Validators.pattern(genralConfig.pattern.PHONE_NO), Validators.required]),
    description: new FormControl('', Validators.required),
    currency: new FormControl('', Validators.required),
    serviceCost: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    serviceImage: new FormControl(''),
  })
  roleTitle: any
  companyId: any
  uploadedBannerImage: string = ''
  imageChangedEvent: any
  croppedImage: string
  finalCroppedBanner: File
  isLoading: boolean = false
  constructor(
    private changeDetector: ChangeDetectorRef,
    private service: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private Router: Router,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }
  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleTitle = JSON.parse(localStorage.getItem('truckStorage')).userInfo.roleId.roleTitle
    this.companyId = JSON.parse(localStorage.getItem('truckStorage')).userInfo.companyId
    if (userData && userData.userInfo) {
      this.userId = userData.userInfo._id
      this.addservice.patchValue({
        contactNumber: userData.userInfo.mobileNumber ? userData.userInfo.mobileNumber : userData.userInfo.contactNumber,
      })
    }
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
    this.autosearch()
  }
  checkNumberFieldLength(elem) {
    if (elem.value.length > 4) elem.value = elem.value.slice(0, 4)
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }
  // GOOGLE AUTOPLACE API
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
  // image upload cropper banner image
  fileChangeEvent(event: any) {
    if (event.target.files[0].size > 5242880) throw this.toastr.warning('File size must be less then 5 mb')
    this.isLoading=true
    this.imageChangedEvent = event
    if (this.imageChangedEvent.target.files[0].name) document.getElementById('open-diaLog').click()
  }
  imageCropped(event: ImageCroppedEvent) {
    this.isLoading=false
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
  // show cropper
  imageLoaded() {}
  // cropper ready
  cropperReady() {}
  // show message
  loadImageFailed() {}
  uploadBannerImage() {
    const imageName = this.imageChangedEvent.target.files[0].name
    const imageBlob = this.dataURItoBlob(this.croppedImage.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''))
    this.finalCroppedBanner = new File([imageBlob], imageName, { type: this.imageChangedEvent.target.files[0].type })
    if (this.finalCroppedBanner != undefined) {
      const formData = new FormData()
      formData.append('file', this.finalCroppedBanner)
      formData.append('type', 'SERVICEIMAGE')
      this.spinner.show()
      this.service.uploadImagePostservice(formData).subscribe(
        (res) => {
          if (res['code'] == 200) setTimeout(() => (this.uploadedBannerImage = res['data'].imagePath), 700)
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
  onSubmit() {
    if (this.addservice.valid) {
      if (this.uploadedBannerImage == '') return this.toastr.warning('Please select Service image')
      if (!this.fullAddress) return this.toastr.warning('Select location from dropdown')
      let data = {
        serviceName: this.addservice.value.serviceName,
        contactNumber: this.addservice.value.contactNumber,
        description: this.addservice.value.description,
        serviceCost: parseFloat(this.addservice.value.serviceCost),
        currency: this.addservice.value.currency,
        createdById: this.userId,
        serviceImage: this.uploadedBannerImage,
        location: { lat: this.googleaddress.lat, lng: this.googleaddress.lng },
        address: this.fullAddress,
        planTitle: 'SERVICE',
        constName: 'NOOFSERVICES',
        roleTitle: this.roleTitle,
      }
      if (this.roleTitle == 'COMPANY') {
        data['createdById'] = this.userId
        data['companyId'] = this.userId
      } else {
        data['createdById'] = this.userId
        data['companyId'] = this.companyId
      }
      this.spinner.show()
      this.service.addService(data).subscribe((Response) => {
        if (Response['code'] == 200) {
          this.toastr.success('', Response['message'])
          this.Router.navigate(['layout/myaccount/service'])
        } else this.toastr.warning('', Response['message'])
        this.spinner.hide()
      })
    }
  }
}
