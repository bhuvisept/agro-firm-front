import { Component,NgZone, Inject, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { MapsAPILoader } from '@agm/core'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { ImageCroppedEvent } from 'ngx-image-cropper';
import {HttpClient} from '@angular/common/http';
import { MatStepper } from '@angular/material';
// import { EcomS3BucketComponent } from '../../s3Bucket/ecomS3Bucket.component'

@Component({
  selector: 'app-edit-truck-units',
  templateUrl: './edit-truck-units.component.html',
  styleUrls: ['./edit-truck-units.component.css'],
  providers: [NgxSpinnerService],
})
export class EditTruckUnitsComponent implements OnInit {

  @ViewChild('search', { static: false }) searchElementRef: ElementRef
  @ViewChild('stepper', { static: false }) private myStepper: MatStepper;
  public editor = ClassicEditor
  formOne: FormGroup
  formTwo: FormGroup
  formThree: FormGroup
  formFour: FormGroup
  formFive: FormGroup
  vincode:any;
  // getVinCode:any;
  files: File[] = [];
  userObj: any
  userId: void
  categoryList: any
  brandList: any
  modelList: any
  kilometersDriven:boolean= false
  typeList = genralConfig.typeList
  transmissionTypeList = genralConfig.transmissionType
  fuelTypeList = genralConfig.fuelType
  breaksList = genralConfig.breaksList
  suspensionList = genralConfig.suspensionList
  inStockList = genralConfig.inStockList
  colorList = genralConfig.colorList
  conditionList = genralConfig.conditionList
  currency = genralConfig.currency
  colors:any = []
  //Auto Search Var
  geoCoder: any
  googleaddress: any = {}
  lat: number
  lng: number
  fullAddress: string = ''
  addProduct:any = []
  manufactureList: any
  categoryType: string
  categoryId: string
  formData:any
  formDataTwo: any
  productId: any
  colorsArray: any = []
  ModelId: any
  petchLocation: any
  timeDuration: any[]
  productImages : any = []
  deleteAction = [
  { value: true, name: "Archived" },
  { value: false, name: "Unarchived" }
  ]
  subCategoryId: any
  subCategoryList: any
  public productImgPath = environment.URLHOST + '/uploads/product/image/'
  formDataThree: any
  fieldValue: any
  formDataFour: any
  truckParameter: any
  isReadonlyVin:boolean = true;
  isReadonlyBrandName:boolean = false;
  isReadonlyModelName:boolean = false;
  isReadonlyProYear:boolean = false;
  isReadonly:boolean = false;
  isReadonlyBreaks:boolean = false;
  isReadonlyFuelType:boolean = false;
  isReadonlyEnginePowerOutput:boolean = false;
  isReadonlyEngineDisplacement:boolean = false;
  // crop images with upload
  display = 'none';
  ulpoadedFiles: any = [];
  productColor:any =[];
  imgId: any=0;
  target: any = {};
  event: any = {};
  imageChangedEvent: any = '';
  croppedImage: any = '';
  currentProcessingImg: any = 0;
  finalCroppedBanner: File
  isUploadImages:boolean = true
  isMultiUploadImages:boolean = false
  url: string
  VinDetails: any
  roleName: any
  
  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private http : HttpClient,
    // private ecomS3Bucket:EcomS3BucketComponent
  ) { }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = params.Id
    })
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.roleName = this.userObj.userInfo.roleId.roleTitle

    const currentYear = (new Date()).getFullYear();
    const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
    this.timeDuration = range(currentYear, currentYear -31, -1)
  this.getProductDetails()
  this.getBrandList()
  this.autosearch()
  this.formOne = this.formbuilder.group({
    vin: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.PRODUCTVIN_MIN_SIZ),Validators.pattern(genralConfig.pattern.PRODUCTIVE_MAX_SIZ)]],
  })
  this.formTwo = this.formbuilder.group({
    brandId: ['', [Validators.required]],
    brandName: [''],
    modelId: ['', [Validators.required]],
    modelName: [''],
    engineBrand:['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
    productionYear: ['', [Validators.required]],
    fuelType: ['', [Validators.required]],
    breaks: ['', [Validators.required]],
    enginePoweroutput: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
    engineDisplacement: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
  })
  this.formThree = this.formbuilder.group({
    productName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
    subCategoryId: [''],
    productType: ['', [Validators.required]],
    condition: ['', [Validators.required]],
    noOfMiles: [''],
    engineHours: [''],
    location: ['', [Validators.required]],
    currency: ['', [Validators.required]],
    price: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
    quantity: ['', [Validators.required]],
    description: ['', [Validators.required]],
})
this.formFour = this.formbuilder.group({
  color: [''],
  width: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
  height: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
  mileage: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ),]],
  suspension: ['', [Validators.required]],
  transmissionType: ['', [Validators.required]],
  fuelCapacity: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
  wheelBase: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
  netWeight: ['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
  grossWeight:['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
  loadCapacity:['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
  isDeleted: ['']
  })
  this.formFive = this.formbuilder.group({
    image: [''],
  })
  this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
}
  async getVinCode(vincode){
    if(vincode){
    this.url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vincode}?format=json`
    await this.http.get(this.url)
    .subscribe(Response => {
      if(Response['Results'][0].VehicleType == "TRUCK "){
        if(Response['Results'][0].VIN){this.isReadonlyVin = true}
        if(Response['Results'][0].Make){this.isReadonlyBrandName = true}
        if(Response['Results'][0].Model){this.isReadonlyModelName = true}
        if(Response['Results'][0].ModelYear){this.isReadonlyProYear = true}
        if(Response['Results'][0].EngineManufacturer){this.isReadonly = true}
        if(Response['Results'][0].BrakeSystemType){this.isReadonlyBreaks = true}
        if(Response['Results'][0].FuelTypePrimary){this.isReadonlyFuelType = true}
        if(Response['Results'][0].EngineHP_to){this.isReadonlyEnginePowerOutput = true}
        if(Response['Results'][0].DisplacementCC.length >= 0){this.isReadonlyEngineDisplacement = true}

        this.formTwo.patchValue({
            brandName : Response['Results'][0].Make ,
            modelName : Response['Results'][0].Model,
            engineBrand : Response['Results'][0].EngineManufacturer,
            fuelType : Response['Results'][0].FuelTypePrimary, 
            productionYear : parseInt(Response['Results'][0].ModelYear), 
            breaks : Response['Results'][0].BrakeSystemType, 
            enginePoweroutput : Response['Results'][0].EngineHP_to,
            engineDisplacement : Response['Results'][0].DisplacementCC
          })
        this.formTwo.patchValue(this.VinDetails)
      }else{
        this.getModelList(this.VinDetails.brandId)
        this.formTwo.patchValue(this.VinDetails)
      }
    });
    }
  }
  getProductDetails(){
    let data = {
      _id:this.productId,
    }
    this._generalService.productDetail(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.VinDetails = response['data']
        this.fullAddress = this.VinDetails.location
        if(response['data'].vin){
          this.formOne.patchValue({vin:this.VinDetails.vin})
          this.getVinCode(response['data'].vin)
        }else{
          this.formTwo.patchValue(this.VinDetails)
          this.ModelId=response['data'].brandId
          this.getModelList(this.ModelId)
        }
        this.getProductDetails = response['data']
        this.petchLocation = response['data'].location
        this.formOne.value.categoryId = response['data'].categoryId
        this.categoryId = response['data'].categoryId
        this.subCategoryId = response['data'].categoryId
        this.getSubCategoryList(this.subCategoryId)
        this.formThree.patchValue(response['data'])
        this.formFour.patchValue(response['data'])
        if(response['data'].images){
          let productImagesDetails = response['data'].images
          let result = productImagesDetails.map(({ name }) => name)
          this.productImages.push(...result)
        }
        function lastWord(words) {
          let n = words.replace(/[\[\]?.,\/#!$%\^&\*;:{}=\\|_~()]/g, "").split(" ");
          return n[n.length - 1];
        }
        let value = lastWord(this.petchLocation)
        this.fieldValue = value
          switch(value){
            case 'Canada':
            this.formThree.patchValue({
              currency:"CAD"
            });
            break;
            case 'USA':
            this.formThree.patchValue({
              currency:"USD"
            });
            break;
            case 'Mexico':
            this.formThree.patchValue({
              currency:"MXN"
            });
            break;
          }
          this.formThree.patchValue(
            {currency : response['data'].currency }
          )
      } else {
        this.toastr.warning('', response['message'])
        this.spinner.hide()
      }
    }), (error) => {
      this.spinner.hide()
      this.toastr.error('server error')
    }
  }
  getSubCategoryList(id){
    let data = {
      sortValue:'category_name',
      sortOrder:1,
      parentCategoryId:id,
    }
    this._generalService.getSubCategoryList(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.subCategoryList = response['data']
      }
    }), (error) => {
      this.spinner.hide()
      this.toastr.error('server error')
    }
  }
  checkFormData(){
      if(this.isReadonlyVin){
        if(this.formTwo.value.brandId == null){
          this.formTwo.controls['brandId'].setValidators([ ])
          this.formTwo.controls['brandId'].updateValueAndValidity()
        }
        if(this.formTwo.value.modelId == null){
          this.formTwo.controls['modelId'].setValidators([])
          this.formTwo.controls['modelId'].updateValueAndValidity()
        }
        
      }else{
        if(this.formTwo.value.brandId == null){
            this.formTwo.controls['brandId'].setValidators([  Validators.required])
            this.formTwo.controls['brandId'].updateValueAndValidity()
          }else{
            this.formTwo.get('brandId').setValidators([]);
            this.formTwo.controls['brandId'].updateValueAndValidity()
          }
          if(this.formTwo.value.modelId == null){
            this.formTwo.controls['modelId'].setValidators([  Validators.required])
            this.formTwo.controls['modelId'].updateValueAndValidity()
          }else{
            this.formTwo.get('modelId').setValidators([]);
            this.formTwo.controls['modelId'].updateValueAndValidity()
          }
      }
  }
  nextData(){
    if(this.formThree.valid && this.fullAddress){
      this.myStepper.next()
    }
    else{
      if(!this.fullAddress){
        this.toastr.warning('Select location from dropdown')
        return
      }
    }
    
  }
  getDataOther(e){
    if(e.target.innerText === 'Listing Details'){
      this.checkFormData()
        this.myStepper.next()
    }
  }
   removeData(e){
    this.formTwo.reset()
  }
  onRemoveLocal(i){
    this.ulpoadedFiles.splice(i,1);
  }
  onRemove(fileName, i) {
    let obj = {
      filePath: '../truck-backend/uploads/product/image/',
      file: fileName
    }
    this.spinner.show()
    this._generalService.deletProductImage(obj).subscribe(res => {
      if (res['code'] == genralConfig.statusCode.ok) {
        let index = this.productImages.indexOf(fileName)
        this.productImages.splice(i, 1);
        this.spinner.hide()
      } else {
        this.toastr.warning(res.message);
        this.spinner.hide()
      }
    }), err => {
      this.spinner.hide()
      this.toastr.error('server error')
    };
  }
  // onRemove(fileName, i){
  //   this.ecomS3Bucket.deleteS3File(fileName, i)
  //   if(this.ecomS3Bucket.deleteS3FileStatus==true) this.productImages.splice(i, 1)
  // }
  getBrandList(){
    let data = {
      sortValue:'brand',
      sortOrder:1
    }
    this._generalService.getBrandList(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.brandList = response['data']
      }
    }), err => {
      this.spinner.hide()
      this.toastr.error('server error')
    }
  }
  getModelList(id){
    let data = {
      brandName:id,
      sortValue:'title',
      sortOrder:1
    }
    this.spinner.show()
    this._generalService.getModelList(data).subscribe((response) => {
      this.spinner.hide()
      if (response['code'] == genralConfig.statusCode.ok) {
        this.modelList = response['data']
      }
    }), err => {
      this.spinner.hide()
      this.toastr.error('server error')
    }
  }
  changedCondition(e) {
    if(e === 'Used'){
      this.kilometersDriven = true
    }else{
      this.kilometersDriven = false
    }
  }
  changeCurrency(e){
    this.truckParameter = e
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  autosearch() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder()
      var options = {
        componentRestrictions: {country: ["us","mx","ca"], }
       };
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
          function lastWord(words) {
            let n = words.replace(/[\[\]?.,\/#!$%\^&\*;:{}=\\|_~()]/g, "").split(" ");
            return n[n.length - 1];
          }
          let value = lastWord(this.fullAddress)
          this.fieldValue = value
          switch(value){
            case 'Canada':
            this.formThree.patchValue({
              currency:"CAD"
            });
            break;
            case 'USA':
            this.formThree.patchValue({
              currency:"USD"
            });
            break;
            case 'Mexico':
            this.formThree.patchValue({
              currency:"MXN"
            });
            break;
          }
        })
      })
    })
  }
  // image upload with crop
  openModal() {
    this.display = 'block';
  }
  onCloseHandled() {
    this.imageChangedEvent = null;
    this.display = 'none';
  }
  fileChangeEvent(event: any): void {
    for (var i = 0; i < event.addedFiles.length; i++) {
      // if (event.addedFiles[i].size > 10485760) this.toastr.warning('File size must be less then 10 mb')
       this.imageProcess(event, event.addedFiles[i]);
    }
    if(i++){
      this.isMultiUploadImages = true
      this.isUploadImages = false
    }else{
      this.isMultiUploadImages = false
      this.isUploadImages = true
    }
  }
  imageProcess(event: any, file: any) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      this.imgId = this.imgId + 1;
      this.ulpoadedFiles.push(
        {
          imgId: this.imgId,
          imgBase64: reader.result,
          imgFile: file
        }
      );
    };
  }
  //get a Image using Image Id to crop cropping process done here
  cropImage(imgId) {
    this.currentProcessingImg = imgId;
    var imgObj = this.ulpoadedFiles.find(x => x.imgId === imgId);
    var event = {
      target: {
        files: [imgObj.imgFile]
      }
    };
    this.imageChangedEvent = event;
    this.openModal();
  }
  //Save Cropped Image locally
  SaveCropedImage() {
    var imgObj = this.ulpoadedFiles.find(x => x.imgId === this.currentProcessingImg);
    imgObj.imgBase64 = this.croppedImage;
    this.onCloseHandled();
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    for(let items of this.ulpoadedFiles){
      const blob = new Blob([int8Array], { type: items.imgFile.type });
      return blob;
    }
  }
  
  async onSelect(event) {
    const formData = new FormData()
    for (let item of this.ulpoadedFiles) {
      const imageName = item.imgFile.name;
      const imageBlob = this.dataURItoBlob(item.imgBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''));
      this.finalCroppedBanner= new File([imageBlob], imageName, { type: item.imgFile.type });
      formData.append('files', this.finalCroppedBanner)
    }
    this.spinner.show();
      this._generalService.productImagesUpload(formData).subscribe((res) => {
        if (res['code'] == 200) {
          this.files = res['data'];
          this.spinner.hide();
          for(let item of this.files){
            this.productImages.push(item)
            this.ulpoadedFiles = [];
            this.isMultiUploadImages = false
            this.isUploadImages = true
          }
          this.toastr.success(res['message'])
        } else {
          this.spinner.hide();
          this.toastr.warning(res['message'])
        }
      })
  }


  // uploadS3File(event) {
  //   this.isLoading = true
  //   // for (let item of this.ulpoadedFiles) {
  //   //   this.filesForS3 = [item.imgFile]
  //   // }
  //   let imageUrls= this.ulpoadedFiles.map(res=>{
  //     return res.imgFile
  //     })
  //   // this.filesForS3 = imageUrls
  //   this.filesForS3={newS3Files:imageUrls, afterDeleteImg:this.productImages}
  //   this.ulpoadedFiles=[]
  //   this.isMultiUploadImages = false
  //   this.isUploadImages = true
  //   this.sub = interval(600).subscribe((x) => {
  //     this.progressBar()
  //   })
  // }
  // progressBar() {
  //   if (this.value < this.ceiling) {
  //     this.value += this.increment
  //     return
  //   }
  //   if(this.value !=100) this.isLoading=true
  //   if(this.value==100) this.isLoading = false
  // }
  // showS3FileData(val:any){
  //   // this.productImages = imageUrlsArry
  //   this.spinner.show()
  //   // let imageUrlsArry =  val.map(res => res.name.split('/').pop())
  //   // this.productImages.push(...imageUrlsArry)
  //   // this.productImages = [...new Set(this.productImages)];
  //   this.productImages = val
  //   this.spinner.hide()
  // }

    // show cropper
    imageLoaded() {}
    // cropper ready
    cropperReady() {}
    // show message
    loadImageFailed() {}
  onSubmit() {
    if (this.formOne.valid || this.formTwo.valid || this.formThree.valid || this.formFour.valid) {
      this.formData =  this.formOne.value
      this.formDataTwo =  this.formTwo.value
      this.formDataThree =  this.formThree.value
      this.formDataFour =  this.formFour.value
      let data = {
         ...this.formData,
        ...this.formDataTwo,
        ...this.formDataThree,
        ...this.formDataFour,
        _id:this.productId,
        categoryId :this.categoryId,
        createdById: this.userId,
        images:this.productImages,
        color:this.productColor,
        location : this.fullAddress ? this.fullAddress : this.petchLocation,
        roleTitle:this.roleName,
        companyId:this.roleName == 'SELLER' ? this.userId : this.userObj.userInfo.companyId,
        constName: "NOOFPRODUCTS",   
        planTitle: "ECOMMERCE"
      }
      if (!data.location) {
        this.toastr.warning('Please select location')
        return false
      } else { }
      this.spinner.show()
      this._generalService.productUpdates(data).subscribe(
        (result) => {
          if (result['code'] == 200) {
            this.spinner.hide()
            this.router.navigate(['/layout/e-commerce/manage-products-list'])
            this.toastr.success('', result['message'])
          } else {
            this.toastr.warning('', result['message'])
            this.spinner.hide()
          }
        },
        (error) => {
          this.spinner.hide()
          this.toastr.error('', 'Something went wrong')
          this.toastr.warning('Please upload logo & banner image')
        }
      )
    }
  }

}
