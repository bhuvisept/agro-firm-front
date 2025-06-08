import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { environment } from 'src/environments/environment'
import { ToastrService } from 'ngx-toastr'
import { ActivatedRoute } from '@angular/router'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { NgxSpinnerService } from 'ngx-spinner'
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-edit-truck',
  templateUrl: './edit-truck.component.html',
  styleUrls: ['./edit-truck.component.css'],
})
export class EditTruckComponent implements OnInit {
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
  img: boolean = false
  brandname= false
  brandIds = true
  isOtherTyre = false;

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
  // fuelList = [
  //   { value: 'petrol', showValue: 'Petrol' },
  //   { value: 'diesel', showValue: 'Diesel' },
  // ]

  fuelList = [
    { value: 'gas', showValue: 'Gas' },
    { value: 'electric', showValue: 'Electric' },
    { value: 'diesel', showValue: 'Diesel' },
  ]
  vehicleType: any
  image: any
  userObj: any
  tyres:any
  isOtherSelected:boolean= false
  isLoading: boolean = false
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
    private location: Location,
    private http : HttpClient
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.tyres = this.service.tyres()
    this.tyres.push({value:'other'})
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleTitle = this.userObj.userInfo.roleId.roleTitle
    this.route.params.subscribe((res) => (this.id = res.id))
    this.editTruckForm = this.fb.group({
      vehicleType: [''],
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
      fuelCapacity: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      numOfTyres: ['', Validators.required],
      OtherTyre:[''],
      wheelbase: ['', [Validators.required, Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      power: ['', [Validators.required, Validators.pattern(genralConfig.pattern.NUMBERnDECIMAL)]],
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
      console.log(this.truckDetails,"000000000000000")
      if (res['data'].image == null) this.img = true
      this.vehicleType = this.truckDetails.vechicleType
      this.selectedA = this.truckDetails.fuelType
      this.image = this.truckDetails.image
     this.editTruckForm.patchValue(this.truckDetails)
     if(this.truckDetails.otherbrand != null &&  this.truckDetails.otherbrand != '' ){
      this.isOtherSelected= true
      this.editTruckForm.patchValue({ brand:'12345' })
    }else if(this.truckDetails.brandName == null ||  this.truckDetails.brandName == ''){
      this.editTruckForm.patchValue({ brand:this.truckDetails.brand._id })
    }
    if(this.truckDetails.OtherTyre != null &&  this.truckDetails.OtherTyre != '' ){
     this.isOtherTyre = true
     this.editTruckForm.patchValue({ numOfTyres:'others' })
     this.editTruckForm.patchValue({ OtherTyre:this.truckDetails.OtherTyre })
    }
   // else if(this.truckDetails.brandName == null ||  this.truckDetails.brandName == ''){
    //   this.editTruckForm.patchValue({ brand:this.truckDetails.brand._id })
    // }
    if(this.truckDetails.brandName != null){
      this.brandname= true
      this.brandIds = false
    }
     console.log(this.editTruckForm.value)
      this.selected = this.truckDetails.brand.name
      this.spinner.hide()
    })
  }

  setWalkInDetails(event:any) {
    console.log(event.value)
    if(event.value == "12345"){
      this.isOtherSelected = true
    }else{
      this.isOtherSelected = false
    }
  }

  setTyre(event:any){
    if(event.value =='other'){
      this.isOtherTyre = true
    }else{
      this.isOtherTyre = false
    }
  }
  vinDetailTruck(event){
    const VIN =  event.target.value
    console.log(VIN)
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
        this.brandIds = false
        this.editTruckForm.patchValue({brand:'',otherbrand:''})
      }else{
        this.brandIds = true
        this.brandname= false
        this.editTruckForm.patchValue({brandName:''})

      }
      if(Response['Results'][0].Make && Response['Results'][0].Make != ''){this.isOtherSelected = false}
    this.editTruckForm.patchValue({
      modelNumber : Response['Results'][0].Model,
      fuelType : fuelTypes,
      power : Response['Results'][0].EngineHP,
      width:Response['Results'][0].TrackWidth != "" ? Response['Results'][0].TrackWidth : '',
      numOfTyres:Response['Results'][0].Wheels !="" ? parseInt( Response['Results'][0].Wheels ) : "",
      brandName:Response['Results'][0].Make 
    })
    
    });
    
  }


  getBrands() {

    
    let data = { isActive: 'true', isDeleted: 'false', sortValue: 'brand', sortOrder: 1, isAdminApprove: 'APPROVED' }
    this.service.getBrands(data).subscribe((res) =>{
      this.brandList = res['data']
      this.brandList.push({_id:"12345",brand:"Others"})
      console.log(this.brandList)
    })
   
  
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
          this.editTruckImage = res['data'].imagePath
           this.isLoading = false
        }
        else window.scrollTo(0, 0)
      })
    }
  }
  get Status() {
    return this.editTruckForm.controls
  }
  back() {
    window.history.back()
  }

  editTruck() {
    console.log(this.isOtherSelected,this.editTruckForm.value.otherbrand)
    if(this.editTruckForm.value.otherbrand == null)  this.editTruckForm.value.otherbrand = ''
    if (this.isOtherSelected && !this.editTruckForm.value.otherbrand.trim()) return this.toastr.warning('Other brand name is required')
    if (this.isOtherTyre && !this.editTruckForm.value.OtherTyre) return this.toastr.warning('Other numbe of tyre is required')

    if(!this.isOtherTyre){
       this.editTruckForm.value.OtherTyre =""
    }
    if (this.editTruckForm.valid) {
      if (this.editTruckImage) this.editTruckForm.value.image = this.editTruckImage
      else this.editTruckForm.value.image = this.truckDetails.image
      this.editTruckForm.value._id = this.id
      this.editTruckForm.value.vehicleType = this.vehicleType
      this.editTruckForm.value.createdById = this.userObj.userInfo._id
      if (!this.isOtherSelected) {
        this.editTruckForm.value.otherbrand = ''
      }
      this.editTruckForm.value.planTitle= "TRIPPLAN" 
      this.editTruckForm.value.constName= "NOOFTRUCKANDTRAILERS"
      this.editTruckForm.value.companyId= this.roleTitle == 'COMPANY' ? this.userObj.userInfo._id : this.userObj.userInfo.companyId,
      this.editTruckForm.value.roleTitle= this.roleTitle,
      this.spinner.show()
      this.service.editTruck(this.editTruckForm.value).subscribe((res) => {
        if (res['code'] == 200) {
          this.toastr.success(res['message'])
          this.router.navigate(['layout/myaccount/manage-truck/view-truck/' + this.id])
        }
        this.spinner.hide()
      })
    }
  }
}
