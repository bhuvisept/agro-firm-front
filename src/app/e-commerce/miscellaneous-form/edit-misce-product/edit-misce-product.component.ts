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
  selector: 'app-edit-misce-product',
  templateUrl: './edit-misce-product.component.html',
  styleUrls: ['./edit-misce-product.component.css'],
  providers: [NgxSpinnerService],
})
export class EditMisceProductComponent implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef
  public editor = ClassicEditor
  files: File[] = [];
  formOne: FormGroup
  formTwo: FormGroup
  userObj: any
  productId: any
  userId: any
  subCategoryId: any
  productImages : any = []
  categoryId: any
  formData: any
  subCategoryList: any
  deleteAction = [
    { value: true, name: "Archived" },
    { value: false, name: "Unarchived" }
  ]
  public productImgPath = environment.URLHOST + '/uploads/product/image/'
  roleName: any
  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2, 
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = params.Id
    })
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.formOne = this.formbuilder.group({
      productName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      subCategoryId: [''],
      description: ['', [Validators.required]],
      isDeleted: ['']
    })
    this.formTwo = this.formbuilder.group({
      image: [''],
    })
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.getProductDetails()
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  getProductDetails(){
    let data = {
      _id:this.productId,
    }
    this._generalService.productDetail(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.getProductDetails = response['data']
        this.categoryId = response['data'].categoryId
        this.formOne.patchValue(response['data'])
        this.formOne.value.categoryId = response['data'].categoryId
        this.subCategoryId = response['data'].categoryId
        this.getSubCategoryList(this.subCategoryId)
        let productImagesDetails = response['data'].images
        let result = productImagesDetails.map(({ name }) => name)
        this.productImages.push(...result)
        } else {
        this.toastr.warning('', response['message'])
        this.spinner.hide()
      }
    }, (error) => {
      this.spinner.hide()
      this.toastr.warning('Something went wrong')
    })
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
  }, err => {
    this.spinner.hide()
  });
}

onSubmit() {
  if (this.formOne.valid) {
    this.formData =  this.formOne.value
    let data = {
       ...this.formData,
      _id:this.productId,
      categoryId :this.categoryId,
      createdById: this.userId,
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
}
