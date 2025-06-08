import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material'
import { Location } from '@angular/common'
import {HttpClient} from '@angular/common/http';

declare var $:any;

@Component({
  selector: 'app-add-truck',
  templateUrl: './add-truck.component.html',
  styleUrls: ['./add-truck.component.css'],
})
export class AddTruckComponent implements OnInit {
  truckForm: FormGroup
  trailerForm: FormGroup
  file: any
  submit: boolean = false
  fileData: File = null
  userObj: any
  isDisabled = false;
  isDisabledTruck = false
  uploadedTruckImage: any
  data: any
  brandList: any = []
  selectedBrand: any
  vehicleType: any = 'TRUCK'
  imgSrc: any = 'img'
  isOtherTyre = false;
  fuelList = [
    { value: 'gas', showValue: 'Gas' },
    { value: 'electric', showValue: 'Electric' },
    { value: 'diesel', showValue: 'Diesel' },
  ]
  vehicleList = [
    { type: 'TRUCK', show: 'Truck' },
    { type: 'TRAILER', show: 'Trailer' },
  ]

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
  roleTitle: any
  companyId: any
  userId: any
  isOtherSelected: boolean= false
  tyres:any
  brandname= false
  brandId = true
  numOfTyres : any
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private service: GeneralServiceService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    private location: Location,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private http : HttpClient

  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
 this.tyres = this.service.tyres()
this.tyres.push({value:'others'})
console.log(this.tyres);

    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))

    this.roleTitle = JSON.parse(localStorage.getItem('truckStorage')).userInfo.accessLevel
    this.companyId = JSON.parse(localStorage.getItem('truckStorage')).userInfo.companyId
    this.userId = this.userObj.userInfo._id

    this.truckForm = this.fb.group({
      vehicleType: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      brand: [''],
      otherbrand :[''],
      brandName:[''],
      number: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.PRODUCTVIN_MIN_SIZ), Validators.pattern(genralConfig.pattern.PRODUCTIVE_MAX_SIZ)]],
      modelNumber: ['', [Validators.required, Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      weight: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      height: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      width: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      fuelType: ['', [Validators.required, Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      engine: ['', [Validators.required, Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      fuelCapacity: ['', [Validators.required, Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      // numOfTyres: ['', [Validators.required, Validators.pattern(genralConfig.pattern.NUMBERnDECIMAL)]],
      numOfTyres: ['', Validators.required],
      OtherTyre:[''],
      wheelbase: ['', [Validators.required, Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      power: ['', [Validators.required, Validators.pattern(genralConfig.pattern.NUMBERnDECIMAL)]],
      image: [''],
    })
  
    this.trailerForm = this.fb.group({
      vehicleType: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      trailerVinNumber:['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.PRODUCTVIN_MIN_SIZ), Validators.pattern(genralConfig.pattern.PRODUCTIVE_MAX_SIZ)]],
      weight: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      height: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      width: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      length: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      image: [''],
      trailerType: ['', Validators.required],
      loadCapacity: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
    })
    this.getBrands()

  }

vinDetailTruck(event){
  const VIN =  event.target.value
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/`+ VIN + `?format=json`
  this.http.get(url).subscribe(Response => {

console.log(Response['Results'][0])


let fuelTypes
    if( Response['Results'][0].FuelTypePrimary=='Gasoline') {
    fuelTypes = 'gas'
    }else if(Response['Results'][0].FuelTypePrimary=='Diesel'){
      fuelTypes = 'diesel'
    }

    if(Response['Results'][0].Make){
      this.brandname= true
      this.brandId = false
    }else{
      this.brandname= false
      this.truckForm.patchValue({ brandName:''})
    }
  this.truckForm.patchValue({
    modelNumber : Response['Results'][0].Model,
    fuelType : fuelTypes,
    power : Response['Results'][0].EngineHP,
    width:Response['Results'][0].TrackWidth != "" ? Response['Results'][0].TrackWidth : '',
    numOfTyres:Response['Results'][0].Wheels !="" ? parseInt( Response['Results'][0].Wheels ) : "",
    brandName:Response['Results'][0].Make 
  })
  console.log(this.truckForm)
  });
  
}
vinDetailTrailer(event){
  const VIN =  event.target.value
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/`+ VIN + `?format=json`
  this.http.get(url).subscribe(Response => {
  let trailerData =  Response['Results'][0]
console.log(trailerData)
// console.log(trailerData.CurbWeightLB)
// // Response['Results'][0].CurbWeightLB = "200"
Response['Results'][0].VehicleType = "TRAILER"
if(Response['Results'][0].VehicleType === "TRAILER"){
  this.trailerForm.patchValue({
    weight:parseInt(trailerData.CurbWeightLB),
    height: parseInt(Response['Results'][0].CurbWeightLB),
    width: parseInt(Response['Results'][0].CurbWeightLB),
    length:parseInt(Response['Results'][0].TrailerLength)
  }) 

}
  });
  
}

setTyre(event:any){
  console.log(event.value,"00000000000000")
  if(event.value =='others'){
    this.isOtherTyre = true
  }else{
    this.isOtherTyre = false
  }
}


  setWalkInDetails(event:any) {

    console.log(event.value)
    if(event.value == "12345"){
      this.isOtherSelected = true
    }else{
      this.isOtherSelected = false
    }
  }
  get status() {
    return this.truckForm.controls
  }
  get statusTrailer() {
    return this.trailerForm.controls
  }
  getBrands() {
    let data = { isActive: 'true', isDeleted: 'false', sortValue: 'brand', sortOrder: 1, isAdminApprove: 'APPROVED' }
    this.service.getBrands(data).subscribe((res) => {
      this.brandList = res['data']
      this.brandList.push({_id:"12345",brand:"Others"})
   
    })
  }
  back() {
    this.location.back()
  }

  onChange(event: any) {
    if (event.target.files[0].size > 5242880) throw this.toastr.warning('File size must be less then 5 mb')
    this.fileData = <File>event.target.files[0]
    const reader = new FileReader()
    reader.onload = (e: any) => (this.imgSrc = e.target.result)
    reader.readAsDataURL(event.target.files[0])
    if (this.fileData != undefined) {
      const fd = new FormData()
      fd.append('file', this.fileData)
      if(this.vehicleType=='TRUCK'){
        fd.append('type', 'TRUCKIMAGE')
      }else{
        fd.append('type', 'TRAILERIMAGE')
      }
      this.spinner.show()
      this.service.truckImageForPath(fd).subscribe((res) => {
        this.spinner.hide()
        if (res['code'] == 200) this.uploadedTruckImage = res['data'].imagePath
        else window.scrollTo(0, 0)
      })
    }
  }

  onSubmitTruck() {
    this.isDisabledTruck = true
    if (this.isOtherSelected && (this.truckForm.value.otherbrand==""|| !this.truckForm.value.otherbrand)) return this.toastr.warning('Other brand name is required')
    if (this.isOtherTyre && (this.truckForm.value.OtherTyre==""|| !this.truckForm.value.OtherTyre)) return this.toastr.warning('Other number of tyre is required')
    
    if (this.truckForm.valid) {
      this.spinner.show()
      this.submit = true
    this.isDisabledTruck = true

      this.truckForm.value.image = this.uploadedTruckImage
      this.truckForm.value.createdById = this.userId
      this.truckForm.value.companyId = this.userObj.userInfo.createdById ? this.userObj.userInfo.createdById : this.userObj.userInfo._id

      if ((this.userObj.userInfo.accessLevel == 'ENDUSER' || this.userObj.userInfo.accessLevel == 'COMPANY') && this.userObj.userInfo.invitedBy == null) {
        this.truckForm.value.companyId = this.userId
      } else {
        this.truckForm.value.companyId = this.companyId
      }
      if(!this.isOtherTyre){
        this.truckForm.value.OtherTyre =""
      }
      this.truckForm.value.planTitle = 'TRIPPLAN'
      this.truckForm.value.constName = 'NOOFTRUCKANDTRAILERS'
      this.truckForm.value.roleTitle = this.roleTitle

      if (!this.isOtherSelected) {
        this.truckForm.value.otherbrand = ''
      }
     
     
      this.service.addTruck(this.truckForm.value).subscribe((res) => {
        if (res['code'] == 200) {
          this.toastr.success('Vehicle information added successfully')
          this.router.navigate(['/layout/myaccount/manage-truck'])
        } else this.toastr.warning(res['message'])
        this.spinner.hide()
      })
    }
  }

  onSubmitTrailer() {
    if (this.trailerForm.valid) {
      this.spinner.show()
    this.isDisabled = true
      this.submit = true
      this.trailerForm.value.image = this.uploadedTruckImage
      this.trailerForm.value.createdById = this.userObj.userInfo._id
      this.trailerForm.value.companyId = this.userObj.userInfo.createdById ? this.userObj.userInfo.createdById : this.userObj.userInfo._id
      if ((this.userObj.userInfo.accessLevel == 'ENDUSER' || this.userObj.userInfo.accessLevel == 'COMPANY')&& this.userObj.userInfo.invitedBy == null) {
        this.trailerForm.value.companyId = this.userId
      } else {
        this.trailerForm.value.companyId = this.companyId
      }
      this.trailerForm.value.planTitle = 'TRIPPLAN'
      this.trailerForm.value.constName = 'NOOFTRUCKANDTRAILERS'
      this.trailerForm.value.roleTitle = this.roleTitle

      this.service.addTruck(this.trailerForm.value).subscribe((res) => {
        if (res['code'] == 200) {
          this.toastr.success('Vehicle information added successfully')
          this.router.navigate(['/layout/myaccount/manage-truck'])
        } else this.toastr.warning(res['message'])
        this.spinner.hide()
      })
    }
  }
}
