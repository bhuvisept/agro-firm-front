import { Component,NgZone, Inject, OnInit, Renderer2, ElementRef, ViewChild  } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router ,ActivatedRoute} from '@angular/router'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { MapsAPILoader } from '@agm/core'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {HttpClient} from '@angular/common/http';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatStepper } from '@angular/material';


@Component({
  selector: 'app-add-trailer',
  templateUrl: './add-trailer.component.html',
  styleUrls: ['./add-trailer.component.css'],
  providers: [NgxSpinnerService],
})
export class AddTrailerComponent implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef
  @ViewChild('stepper', { static: false }) private myStepper: MatStepper;
  public editor = ClassicEditor
  formOne: FormGroup
  formTwo: FormGroup
  formThree: FormGroup
  formFour: FormGroup
  formFive: FormGroup
  files: any = [];
  userObj: any
  userId: void
  brandList: any
  modelList: any
  formData:any
  formDataTwo: any
  typeList = genralConfig.typeList
  transmissionTypeList = genralConfig.transmissionType
  wheelTypeList = genralConfig.wheelType
  fuelTypeList = genralConfig.fuelType
  breaksList = genralConfig.breaksList
  suspensionList = genralConfig.suspensionList
  inStockList = genralConfig.inStockList
  colorList = genralConfig.colorList
  conditionList = genralConfig.conditionList
  currency = genralConfig.currency
  //Auto Search Var
  geoCoder: any
  googleaddress: any = {}
  lat: number
  lng: number
  fullAddress: string = ''
  categoryType: string
  categoryId: string
  subCategoryList: any
  productImages : any = []
  timeDuration: any
  public productImgPath = environment.URLHOST + '/uploads/product/image/'
  vincode: any;
  formDataThree: any
  isReadonlyVin:boolean = false;
  isReadonlyBrandName:boolean = false;
  isReadonlyModelName:boolean = false;
  isReadonlyProYear:boolean = false;
  isReadonlyLength:boolean = false;
  isReadonlyAxles:boolean = false;
  formDataFour: any
  fieldValue: any
  truckParameter: any
  // crop images with upload
  display = 'none';
  ulpoadedFiles: any = [];
  imgId: any=0;
  target: any = {};
  event: any = {};
  developer: any = {};
  imageChangedEvent: any = '';
  croppedImage: any = '';
  currentProcessingImg: any = 0;
  finalImageList: any = [];
  finalCroppedBanner: File
  isUploadImages:boolean = true
  isMultiUploadImages:boolean = false
  getVinDataDetail: any
  productColor:any =[]
  brandId: any
  // filesForS3: any
  // value = 0
  // sub: Subscription
  // isLoading
  // ceiling = 100
  // increment = 20
  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private mapsAPILoader: MapsAPILoader,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private route :ActivatedRoute,
    private http : HttpClient,
    // private ecomS3Bucket:EcomS3BucketComponent
  ) { }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.route.params.subscribe((res)=>{
      this.categoryId =res.id
    })
    this.userId = this.userObj.userInfo._id
    this.formOne = this.formbuilder.group({
      vin: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.PRODUCTVIN_MIN_SIZ),Validators.pattern(genralConfig.pattern.PRODUCTIVE_MAX_SIZ)]],
    })
    this.formTwo = this.formbuilder.group({
      brandId: ['', [Validators.required]],
      brandName: [''],
      modelId: ['', [Validators.required]],
      modelName: [''],
      productionYear: ['', [Validators.required]],
      length:['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      axles: [''],
    })
    this.formThree = this.formbuilder.group({
      productName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      subCategoryId: ['', [Validators.required]],
      productType: ['', [Validators.required]],
      condition: ['', [Validators.required]],
      location: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      price: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      description: ['', [Validators.required]],
    })
    this.formFour = this.formbuilder.group({
      width: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      height: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      suspension: ['', [Validators.required]],
      wheels: ['', [Validators.required]],
      netWeight: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      grossWeight: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
      loadCapacity:['', [Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
    })
    this.formFive = this.formbuilder.group({
      image: [''],
    })
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.getSubCategoryList()
    this.getBrandList()
    this.autosearch()
    const currentYear = (new Date()).getFullYear();
    const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
    this.timeDuration = range(currentYear, currentYear -31, -1)
  }
  // Event fired after view is initialized
  getVinCode(vincode){
    if(vincode){
      let url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vincode}?format=json`
      this.http.get(url).subscribe(Response => {
        this.getVinDataDetail = Response['data']
        if(Response['Results'][0].VehicleType === "TRAILER"){
          if(Response['Results'][0].VIN){this.isReadonlyVin = true}
          if(Response['Results'][0].Make){this.isReadonlyBrandName = true}
          if(Response['Results'][0].Model){this.isReadonlyModelName = true}
          if(Response['Results'][0].ModelYear){this.isReadonlyProYear = true}
          if(Response['Results'][0].Axles){this.isReadonlyAxles = true}
          if(Response['Results'][0].TrailerLength){this.isReadonlyLength = true}
          this.formTwo.patchValue({
            modelName : Response['Results'][0].Model,
            axles : Response['Results'][0].Axles,
            brandName : Response['Results'][0].Make,
            productionYear : parseInt(Response['Results'][0].ModelYear),
            length : Response['Results'][0].TrailerLength
          })
          this.checkFormData()
        }else{this.toastr.warning('Please enter correct VIN')}
      });
    }
  }
  nextTab(stepper: MatStepper) {
    stepper.next();
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
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  // GOOGLE AUTOPLACE API
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
  getBrandList(){
    let data = {
      sortValue:'brand',
      isAdminApprove:'APPROVED',
      sortOrder:1
    }
    this._generalService.getBrandList(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.brandList = response['data']
      }else{

      }
    })
  }
  getselectval(val) {
    this.brandId = val
    if (this.brandId) {
      this.getModelList(this.brandId)
    } else {
    }
  }
  getModelList(id){
    let data = {
      brandId:id,
      sortValue:'title',
      sortOrder:1,
      isAdminApprove:'APPROVED',
    }
    this.spinner.show()
    this._generalService.getModelList(data).subscribe((response) => {
      this.spinner.hide()
      if (response['code'] == genralConfig.statusCode.ok) {
        this.modelList = response['data']
      }else{

      }
    })
  }
  getSubCategoryList(){
    let data = {
      sortValue:'category_name',
      sortOrder:1,
      parentCategoryId:this.categoryId,
    }
    this._generalService.getSubCategoryList(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.subCategoryList = response['data']
      }
    }),(error) => {
      this.toastr.error('server error')
    }
  }
  chnageCurrency(e){
    this.truckParameter = e
  }

  onRemoveLocal(fileName, i) {
    this.ulpoadedFiles.splice(i,1);
  }

  removeData(e){
    this.formTwo.reset()
    this.isReadonlyVin = false
    this.isReadonlyLength = false
    this.isReadonlyProYear = false
    this.isReadonlyAxles = false
    this.isReadonlyProYear = false
    this.checkFormData()
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
      if (event.addedFiles[i].size > 10485760) this.toastr.warning('File size must be less then 5 mb')
     else this.imageProcess(event, event.addedFiles[i]);
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
      this.ulpoadedFiles.push({ imgId: this.imgId, imgBase64: reader.result, imgFile: file });
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
    let isImagesCorrect = true
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
  //   this.isLoading=true
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
  //   // if(this.value !=100) this.isLoading=true
  //   if(this.value==100) this.isLoading = false
  // }
  // showS3FileData(val:any){
  //   // let imageUrlsArry =  val.map(res => res.name.split('/').pop())
  //   // this.productImages = imageUrlsArry
  // this.productImages = val
  // }
  onRemove(fileName, i) {
    let obj = {
      filePath: '../truck-backend/uploads/product/image/',
      file: fileName,
    }
    this.spinner.show()
    // this.ulpoadedFiles=[]
    this.productImages.splice(i, 1)
    this._generalService.deletProductImage(obj).subscribe((res) => {
      if (res['code'] == genralConfig.statusCode.ok) {
        
        this.spinner.hide()
      } else {
        this.toastr.warning(res.message)
        this.spinner.hide()
      }
    }),
      (err) => {
        this.spinner.hide()
        this.toastr.error('server error')
      }
  }
  // onRemove(fileName, i){
  //   // this.value=0;
  //   this.ecomS3Bucket.deleteS3File(fileName, i)
  //   if(this.ecomS3Bucket.deleteS3FileStatus==true) this.productImages.splice(i, 1)
  //   // this.isLoading=false
  // }
  // show cropper
  imageLoaded() {}
  // cropper ready
  cropperReady() {}
  // show message
  loadImageFailed() {}
  
  onSubmit() {
      // this.onSelect(event);
        if (this.formOne.valid && this.formTwo.valid && this.formThree.valid ){
          this.formData =  this.formOne.value
          this.formDataTwo =  this.formTwo.value
          this.formDataThree =  this.formThree.value
          this.formDataFour =  this.formFour.value
          // let imageUrl = this.productImages.map((res) => {
          //   delete res.urlType
          //   // delete res.type
          //   return res.name.split('/').pop()
          // })
          // let imageUrlsArry = imageUrl.map((res) => res)
          let data = {
            ...this.formData,
            ...this.formDataTwo,
            ...this.formDataThree,
            ...this.formDataFour,
            categoryId:this.categoryId,
            createdById: this.userId,
            location : this.fullAddress,
            images:this.productImages, 
            color:this.productColor
          }

          if (this.userObj.userInfo.roleId.roleTitle == 'SELLER') {
            data['companyId']= this.userId
          } else {
            data['companyId'] = this.userObj.userInfo.companyId
          }
          // data['createdById'] = this.userObj.userInfo.companyId // changes by shivam kashyap 07/12/22
          data['createdById'] = this.userObj.userInfo._id // changes by shivam kashyap 07/12/22
          data['planTitle'] = "ECOMMERCE"
          data['constName']= "NOOFPRODUCTS"
          data['roleTitle'] = this.userObj.userInfo.roleId.roleTitle
          if (!this.fullAddress) {
            this.toastr.warning('Please select location')
            return false
          }
          
          this.spinner.show()
          this._generalService.createProduct(data).subscribe(
            (result) => {
              if (result['code'] == 200) {
                this.spinner.hide()
                this.router.navigate(['/layout/e-commerce/manage-products-list'])
                this.toastr.success('', result['message'])
              } else{
                this.toastr.warning('', result['message'])
              }
            }),(error) => {
            this.spinner.hide()
            this.toastr.error('server error')
          }
        } 
    }
  }
