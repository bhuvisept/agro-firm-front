import { Component,NgZone, Inject, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core'
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
@Component({
  selector: 'app-add-spareparts',
  templateUrl: './add-spareparts.component.html',
  styleUrls: ['./add-spareparts.component.css'], 
  providers: [NgxSpinnerService],
})
export class AddSparepartsComponent implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef
  public editor = ClassicEditor
  formOne: FormGroup
  formTwo: FormGroup
  formThree: FormGroup
  files: File[] = [];
  userObj: any
  userId: void
  typeList = genralConfig.typeList
  transmissionTypeList = genralConfig.transmissionType
  breaksList = genralConfig.breaksList
  suspensionList = genralConfig.suspensionList
  inStockList = genralConfig.inStockList
  colorList = genralConfig.colorList
  conditionList = genralConfig.conditionList
  //Auto Search Var
  geoCoder: any
  googleaddress: any = {}
  lat: number
  lng: number
  fullAddress: string = ''
  formData: any
  formDataTwo: any
  categoryType: string
  categoryId: string
  subCategoryList: any
  timeDuration: any[]
  productImages : any = []
  suitableForModels : any = []
  public productImgPath = environment.URLHOST + '/uploads/product/image/'
  productColor:any =[]
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
    private route :ActivatedRoute
  ) { }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.route.params.subscribe((res)=>{
      this.categoryId=res.id
    })
    this.userId = this.userObj.userInfo._id
  this.formOne = this.formbuilder.group({
    productName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
    subCategoryId: [''],
    condition: ['', [Validators.required]],
    OEM:[''],
    brandName: ['', [Validators.required]],
    suitableForModels: ['', [Validators.required]],
    productionYear: [''],
    price: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
    quantity:  ['', [Validators.required]],
    location: ['', [Validators.required]],
    description: ['', [Validators.required]],
  })
  this.formTwo = this.formbuilder.group({
    width: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
    height: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
    length: ['', [ Validators.pattern(genralConfig.pattern.PRODUCTLENGTH_SIZ)]],
  })
  this.formThree = this.formbuilder.group({
    image: [''],
  })

  this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  this.getSubCategoryList()
  this.autosearch()
  const currentYear = (new Date()).getFullYear();
    const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
    this.timeDuration = range(currentYear, currentYear -31, -1)
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
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
    })
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
      if (this.formOne.valid && this.formTwo.valid ){
        if(!this.fullAddress){
          this.toastr.warning('', 'Please select location')
        }else{}
        this.formData =  this.formOne.value
        this.formDataTwo =  this.formTwo.value
        let data = {
          ...this.formData,
          ...this.formDataTwo,
          categoryId:this.categoryId,
          createdById: this.userId,
          images:this.productImages,
          location : this.fullAddress,
          color:this.productColor
        }
        if (this.userObj.userInfo.roleId.roleTitle == 'SELLER') {
          data['companyId']= this.userId
        } else {
          data['companyId'] = this.userObj.userInfo.companyId
        }
        data['createdById'] = this.userId
        data['planTitle'] = "ECOMMERCE"
        data['constName']= "NOOFPRODUCTS"
        data['roleTitle'] = this.userObj.userInfo.roleId.roleTitle
          this.spinner.show()
        this._generalService.createProduct(data).subscribe(
          (result) => {
            if (result['code'] == 200) {
              this.spinner.hide()
              this.router.navigate(['/layout/e-commerce/manage-products-list'])
              localStorage.removeItem("categoryType")
              localStorage.removeItem("categoryId")
              this.toastr.success('', result['message'])
            } else {
              this.toastr.warning('', result['message'])
              this.spinner.hide()
            }
          }
        ),(error) => {
          this.spinner.hide()
          this.toastr.error('server error')
        }
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
