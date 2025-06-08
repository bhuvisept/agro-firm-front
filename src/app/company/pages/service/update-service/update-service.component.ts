import { Component, NgZone, Inject, OnInit, Renderer2, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { MapsAPILoader } from '@agm/core'
import { ImageCroppedEvent } from 'ngx-image-cropper'
@Component({
  selector: 'app-update-service',
  templateUrl: './update-service.component.html',
  styleUrls: ['./update-service.component.css'],
})
export class UpdateServiceComponent implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef
  addservice: FormGroup
  userId: String = ''
  createdById: any
  description: ''
  fileData: File = null
  previewUrlLogo: any = null
  serviceId: any
  serviceName: ''
  serviceCost: Number
  public serviceImage = environment.URLHOST + '/uploads/service/'

  minelist: any
  uploadedServicesImage: any
  minelistdata: any
  textarea: any
  googleaddress: any = {}
  lat: number
  lng: number
  fullAddress: string = ''
  geoCoder: any
  location: any
  getlocation: any
  currency = genralConfig.currency
  status = [
    { value: true, name: 'Archived' },
    { value: false, name: 'Unarchived' },
  ]
  finalCroppedBanner: File
  uploadedBannerImage: string = ''
  imageChangedEvent: any
  croppedImage: string
  isLoading: boolean = false
  roleTitle: any
  userDetails: any
  constructor(
    private service: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private formbuilder: FormBuilder,
    private Router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleTitle = userData.userInfo.roleId.roleTitle
    this.userDetails = JSON.parse(localStorage.getItem('truckStorage'))

    if (userData && userData.userInfo) this.userId = userData.userInfo._id
    this.route.params.subscribe((params) => (this.serviceId = params.Id))
    this.addservice = this.formbuilder.group({
      serviceName: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      description: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      isDeleted: [''],
      serviceCost: ['', [Validators.required]],
      serviceImage: [''],
      location: ['', [Validators.required]],
    })

    this.getApiData()
    this.autosearch()
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
    this.textarea = document.querySelector('#autoresizing')
    this.textarea.addEventListener('input', autoResize, false)
    function autoResize() {
      this.style.height = 'auto'
      this.style.height = this.scrollHeight + 'px'
    }
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
  getApiData() {
    let data = { _id: this.serviceId }
    this.service.GetServiceDetails(data).subscribe((Response) => {
      if (Response['code'] == 200) {
        this.minelistdata = Response['data']
        this.location = Response['data'].address
        this.getlocation = Response['data'].location
        this.uploadedServicesImage = this.minelistdata.serviceImage
        this.addservice.patchValue(this.minelistdata)
        this.addservice.patchValue({ location: this.minelistdata.address })
        this.addservice.patchValue({ isDeleted: this.minelistdata.isDeleted })
        this.uploadedBannerImage = this.minelistdata.serviceImage
        this.minelist = Response['data']
        this.addservice.patchValue({
          ...this.minelist,
          location: Response['data'].address,
        })
      } else this.toastr.warning('', Response['message'])
    })
  }

  fileChangeEvent(event: any) {
    if (event.target.files[0].size > 5242880) throw this.toastr.warning('File size must be less then 5 mb')
    this.isLoading=true
    this.imageChangedEvent = event
    if (this.imageChangedEvent.target.files[0].name) document.getElementById('open-diaLog').click()
  }

  imageCropped(event: ImageCroppedEvent) {
    this.isLoading= false
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
    if (this.fileData != this.finalCroppedBanner) {
      const formData = new FormData()
      formData.append('file', this.finalCroppedBanner)
      formData.append('type', 'SERVICEIMAGE')
      this.spinner.show()
      this.service.uploadImagePostservice(formData).subscribe(
        (res) => {
          if (res['code'] == 200) this.uploadedBannerImage = res['data'].imagePath
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
      let data = {
        _id: this.serviceId,
        serviceName: this.addservice.value.serviceName,
        contactNumber: this.addservice.value.contactNumber,
        description: this.addservice.value.description,
        serviceCost: this.addservice.value.serviceCost,
        currency: this.addservice.value.currency,
        isDeleted: this.addservice.value.isDeleted,
        serviceImage: this.uploadedBannerImage,
        createdById: this.userId,
        address: this.fullAddress ? this.fullAddress : this.location,
        location: {
          lat: this.googleaddress.lat ? this.googleaddress.lat : this.getlocation.coordinates[1],
          lng: this.googleaddress.lng ? this.googleaddress.lng : this.getlocation.coordinates[0],
        },
        constName: "NOOFSERVICES" ,  
        planTitle: "SERVICE",
        companyId: this.roleTitle == 'COMPANY' ? this.userId : this.userDetails.userInfo.companyId,
        roleTitle:this.roleTitle      }
      this.service.updateService(data).subscribe((Response) => {
        if (Response['code'] == 200) {
          this.toastr.success('', Response['message'])
          this.Router.navigate(['/layout/myaccount/service'])
        } else this.toastr.warning('', Response['message'])
      })
    }
  }
}
