import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { environment } from 'src/environments/environment'
import { Router } from '@angular/router'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { genralConfig } from 'src/app/constant/genral-config.constant'
@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.css']
})
export class AddBrandComponent implements OnInit {
  fileData: File = null
  eventImg: any
  addForm: FormGroup
  name;
  userObj: any
  userId: any
  isLoadingLogo:boolean = false;
  public brandlogo = environment.URLHOST + '/uploads/brand/'
  constructor(
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private Router: Router,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private formbuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.addForm = this.formbuilder.group({
      brand: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
    })
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  // uploading brand logo
  uploadCompanyLogo(fileInput: any) {
    this.isLoadingLogo = true
    this.fileData = <File>fileInput.target.files[0]
    if (this.fileData != undefined) {
      const formData = new FormData()
      formData.append('file', this.fileData)
      formData.append('type', 'BRANDLOGO1')
      this._generalService.uploadImageForPath(formData).subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.isLoadingLogo = false
            this.spinner.hide()
            this.eventImg = res['data'].imagePath
          } else {
            window.scrollTo(0, 0)
            this.toastr.error(res['message'])
          }
        }),(error) => {
        this.spinner.hide()
        this.toastr.error('server error')
      }
    }
  }


  submit() {
    if (this.addForm.valid) {
      let data = {
        brandLogo: this.eventImg,
        brand: this.addForm.value.brand,
        isActive: "true",
        isDeleted: "false",
        createdById: this.userId,
        isAdminApprove: 'PENDING'
      }
      if(!this.eventImg ){
        this.toastr.warning( 'Brand Image is required.' )
        return false
      }
      this.spinner.show()
      this._generalService.addBrand(data).subscribe((res) => {
        if (res['code'] == 200) {
          this.spinner.hide()
          this.toastr.success(res['message'])        
          this.Router.navigate(['/layout/e-commerce/brand-list'])
        }
        else {
          this.toastr.warning(res['message'])
          this.spinner.hide()
        }
      }),(error) => {
        this.spinner.hide()
        this.toastr.error('server error')
      }
    }
  }
}
