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
@Component({
  selector: 'app-edit-spareparts',
  templateUrl: './edit-spareparts.component.html',
  styleUrls: ['./edit-spareparts.component.css'], 
  providers: [NgxSpinnerService],
})
export class EditSparepartsComponent implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef
  public editor = ClassicEditor

  formOne: FormGroup
  formTwo: FormGroup
  formThree:FormGroup
  files: File[] = [];
  userObj: any
  userId: void
  categoryList: any
  brandList: any
  modelList: any
  colors:any = []
  typeList = genralConfig.typeList
  transmissionTypeList = genralConfig.transmissionType
  fuelTypeList = genralConfig.fuelType
  breaksList = genralConfig.breaksList
  suspensionList = genralConfig.suspensionList
  inStockList = genralConfig.inStockList
  colorList = genralConfig.colorList
  conditionList = genralConfig.conditionList

  //Auto Search Var
  deleteAction = [
    { value: true, name: "Archived" },
    { value: false, name: "Unarchived" }
  ]
  geoCoder: any
  googleaddress: any = {}
  lat: number
  lng: number
  fullAddress: string = ''
  manufactureList: any
  formData: any
  formDataTwo: any
  categoryType: string
  categoryId: string
  productId: any
  productBrand: any
  productBrandId: any
  // color: any
  // getProductPrice: any
  colorsArray: any = []
  ModelId: any
  petchLocation
  timeDuration: any[]
  productImages : any = []
  productColor:any =[];
  subCategoryId: any
  public productImgPath = environment.URLHOST + '/uploads/product/image/'
  subCategoryList: any
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
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = params.Id
    })
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleName = this.userObj.userInfo.roleId.roleTitle

    this.categoryType = (localStorage.getItem('categoryType'))
    this.userId = this.userObj.userInfo._id

  this.getProductDetails()
  this.formOne = this.formbuilder.group({
    productName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
    subCategoryId: [''],
    condition: ['', [Validators.required]],
    OEM:[''],
    brandName: ['', [Validators.required]],
    suitableForModels: ['', [Validators.required]],
    productionYear: ['',],
    price: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
    quantity:  ['', [Validators.required]],
    location: ['', [Validators.required]],
    description: ['', [Validators.required]],
  })
  this.formTwo = this.formbuilder.group({
    width: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
    height: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
    length: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
    isDeleted:['']
  })
  this.formThree = this.formbuilder.group({
    image: [''],
  })
  this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  this.autosearch()
  const currentYear = (new Date()).getFullYear();
  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
  this.timeDuration = range(currentYear, currentYear -31, -1)
  }
  getProductDetails(){
    let data = {
      _id:this.productId,
    }
    this._generalService.productDetail(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.getProductDetails = response['data']
        this.petchLocation = response['data'].location
        this.categoryId = response['data'].categoryId
        this.formOne.patchValue(response['data'])
        this.formTwo.patchValue(response['data'])
        this.formOne.value.brandId = response['data'].brandId
        this.ModelId=response['data'].brandId
        this.subCategoryId = response['data'].categoryId
        this.getSubCategoryList(this.subCategoryId)
        this.formOne.patchValue({
          color:response['data'].color
        })
        let productImagesDetails = response['data'].images
        let result = productImagesDetails.map(({ name }) => name)
        this.productImages.push(...result)
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
      }else{
        
      }
    })
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
 // image upload 
 async onSelect(event) {
  const formData = new FormData()
  let isImagesCorrect = true
  for (let item of event.addedFiles) {
    let img = new Image()
    formData.append('files', item)
    img.src = window.URL.createObjectURL(item)
    await img.decode();
    if (img.width <= 1100 || img.height <= 658) {
      isImagesCorrect = false
    }
  }
  if (isImagesCorrect) {
    this._generalService.productImagesUpload(formData).subscribe((res) => {
      if (res['code'] == 200) {
        this.files = res['data'];
        for(let item of this.files){
          this.productImages.push(item)
        }
        this.toastr.success(res['message'])
      } else {
        this.toastr.warning(res['message'])
      }
    })
  } else {
    this.toastr.warning('width should be greater than 1100 and height must be 658 ')
  }

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
      this.productImages.splice(index, 1);
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
  onSubmit() {
      if (this.formOne.valid && this.formTwo.valid) {
        this.formData =  this.formOne.value
        this.formDataTwo =  this.formTwo.value
        let data = {
           ...this.formData,
          ...this.formDataTwo,
          _id:this.productId,
          categoryId :this.categoryId,
          createdById: this.userId,
          color:this.productColor,
          location : this.fullAddress ? this.fullAddress : this.petchLocation,
          images:this.productImages,
          roleTitle:this.roleName,
          companyId:this.roleName == 'SELLER' ? this.userId : this.userObj.userInfo.companyId,
          constName: "NOOFPRODUCTS",   
          planTitle: "ECOMMERCE"
        } 
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
  
  // GOOGLE AUTOPLACE API
  autosearch() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder()
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {})

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

}
