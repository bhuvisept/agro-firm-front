import { Component, Inject, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router,ActivatedRoute } from '@angular/router'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic'
@Component({
  selector: 'app-add-misce-product',
  templateUrl: './add-misce-product.component.html',
  styleUrls: ['./add-misce-product.component.css'],
  providers: [NgxSpinnerService],
})
export class AddMisceProductComponent implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef
  public editor = ClassicEditor
  formOne: FormGroup
  formTwo: FormGroup
  files: any = [];
  userObj: any
  userId: void
  categoryId: string
  productImages : any = []
  public productImgPath = environment.URLHOST + '/uploads/product/image/'
  formData: any
  subCategoryList: any
  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private route :ActivatedRoute
  ) { }
  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.route.params.subscribe((res)=>{
      this.categoryId =res.id
    })
    this.userId = this.userObj.userInfo._id
    this.formOne = this.formbuilder.group({
      productName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      subCategoryId: [''],
      description: ['', [Validators.required]],
    })
    this.formTwo = this.formbuilder.group({
      image: [''],
    })
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.getSubCategoryList()
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  getSubCategoryList() {
    let data = {
      sortValue: 'category_name',
      sortOrder: 1,
      parentCategoryId: this.categoryId,
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
    if (this.formOne.valid) {
      this.formData = this.formOne.value
      let data = {
        ...this.formData,
        categoryId: this.categoryId,
        createdById: this.userId,
        images:this.productImages
      }
      this.spinner.show()
      this._generalService.createProduct(data).subscribe(
        (result) => {
          if (result['code'] == 200) {
            this.spinner.hide()
            this.router.navigate(['/layout/e-commerce/manage-products-list'])
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
}
