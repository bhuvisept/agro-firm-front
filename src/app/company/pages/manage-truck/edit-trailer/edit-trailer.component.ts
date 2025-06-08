import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { environment } from 'src/environments/environment'
import { ToastrService } from 'ngx-toastr'
import { ActivatedRoute } from '@angular/router'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-edit-trailer',
  templateUrl: './edit-trailer.component.html',
  styleUrls: ['./edit-trailer.component.css'],
})
export class EditTrailerComponent implements OnInit {
  file: any
  id: any
  fileData: File = null
  editTruckForm: FormGroup
  editTruckImage: any
  disbale = false
  truckDetails: any
  brandList: any
  data: any
  selectedA: any = ''
  selected: any
  imgSrc: any
  currentImg: boolean = false
  brandId: any

  trailerList = [
    { name: 'Flat-bed', value: 'Flat-bed' },
    { name: 'Step-Deck', value: 'Step-Deck' },
    { name: 'Conestoga', value: 'Conestoga' },
    { name: 'Trailer Dry Van', value: 'Trailer Dry Van' },
    { name: 'Trailer Flat', value: 'Trailer Flat' },
    { name: 'Trailer Tanker', value: 'Trailer Tanker' },
    { name: 'Trailer Low Boy', value: 'Trailer Low Boy' },
    { name: 'Trailer Pneumatic', value: 'Trailer Pneumatic' },
  ]

  truckPath = environment.URLHOST + '/uploads/truck/'
  deleteArray = [
    { value: true, name: 'Archived' },
    { value: false, name: 'Unarchived' },
  ]
  fuelList = [
    { value: 'petrol', showValue: 'Petrol' },
    { value: 'diesel', showValue: 'Diesel' },
  ]
  vehicleType: any
  editTrailerForm: FormGroup
  image: any
  userObj: any
  img: boolean = false
  isLoading: boolean=false
  roleTitle: any
  constructor(
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private service: GeneralServiceService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private http : HttpClient

  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleTitle = this.userObj.userInfo.roleId.roleTitle
    this.route.params.subscribe((res) => (this.id = res.id))
    this.editTrailerForm = this.fb.group({
      vehicleType: [''],
      name: ['', [Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      trailerVinNumber:['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.PRODUCTVIN_MIN_SIZ), Validators.pattern(genralConfig.pattern.PRODUCTIVE_MAX_SIZ)]],
      weight: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      length: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      height: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      width: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      image: [''],
      trailerType: [''],
      isDeleted: [],
      loadCapacity: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
    })

    this.getTruck()
    this.getBrands()
  }

  getTruck() {
    let data = { _id: this.id }
    this.spinner.show()
    this.service.oneTruck(data).subscribe((res) => {
      this.truckDetails = res['data']
      if (res['data'].image == null) this.img = true
      this.vehicleType = this.truckDetails.vechicleType
      this.selectedA = this.truckDetails.fuelType
      this.image = this.truckDetails.image
      this.editTrailerForm.patchValue(this.truckDetails)
      this.editTrailerForm.patchValue({ brand: this.truckDetails.brand._id })
      this.selected = this.truckDetails.brand.name
      this.spinner.hide()
    })
  }

  getBrands() {
    this.service.getBrands(this.data).subscribe((res) => (this.brandList = res['data']))
  }
  
  vinDetailTrailer(event){
    const VIN =  event.target.value
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/`+ VIN + `?format=json`
    this.http.get(url).subscribe(Response => {
    let trailerData =  Response['Results'][0]

  if(Response['Results'][0].VehicleType === "TRAILER"){
    this.editTrailerForm.patchValue({
      weight:parseInt(trailerData.CurbWeightLB),
      height:parseInt(Response['Results'][0].CurbWeightLB),
      width: parseInt(Response['Results'][0].CurbWeightLB),
      length:parseInt(Response['Results'][0].TrailerLength)
    }) 
  
  }
    });
    
  }
  onChange(event: any) {
    if (event.target.files[0].size > 5242880) throw this.toastr.warning('File size must be less then 5 mb')
    this.isLoading = true
    this.fileData = <File>event.target.files[0]
    const reader = new FileReader()
    reader.onload = (e: any) => {
      this.imgSrc = e.target.result
      this.currentImg = true
    }
    reader.readAsDataURL(event.target.files[0])

    if (this.fileData != undefined) {
      const fd = new FormData()
      fd.append('file', this.fileData)
      fd.append('type', 'TRUCKIMAGE')
      this.service.truckImageForPath(fd).subscribe((res) => {
        if (res['code'] == 200) {
          this.isLoading = false
          this.editTruckImage = res['data'].imagePath
        }
        else window.scrollTo(0, 0)
      })
    }
  }
  get Status() {
    return this.editTrailerForm.controls
  }
  back() {
    window.history.back()
  }

  editTruck() {
    if (this.editTrailerForm.valid) {
      if (this.editTruckImage) this.editTrailerForm.value.image = this.editTruckImage
      else this.editTrailerForm.value.image = this.truckDetails.image
      this.editTrailerForm.value._id = this.id
      this.editTrailerForm.value.vehicleType = this.vehicleType
      this.editTrailerForm.value.createdById = this.userObj.userInfo._id
      this.editTrailerForm.value.planTitle= "TRIPPLAN" 
      this.editTrailerForm.value.constName= "NOOFTRUCKANDTRAILERS"
      this.editTrailerForm.value.companyId= this.roleTitle == 'COMPANY' ? this.userObj.userInfo._id : this.userObj.userInfo.companyId,
      this.editTrailerForm.value.roleTitle= this.roleTitle,
      this.spinner.show()
      this.service.editTruck(this.editTrailerForm.value).subscribe((res) => {
        if (res['code'] == 200) {
          this.toastr.success(res['message'])
          this.router.navigate(['layout/myaccount/manage-truck/view-truck/' + this.id])
        } else this.toastr.warning(res['message'])
        this.spinner.hide()
      })
    }
  }
}
