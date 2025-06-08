// import { Component, OnInit } from '@angular/core'
import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css'],
  providers: [NgxSpinnerService],
})
export class CreateGroupComponent implements OnInit {
  creatCompanyGroupForm: FormGroup
  roleName: any
  userObj: any
  uploadedEventLogo: any
  uploadedBannerImage: string = ''
  fileData: File = null
  previewUrlLogo: any = null
  eventLogo: any
  bannerImage: string
  textarea: any
  groupType = ['Private', 'Public']
  isLoadingBanner: boolean = false
  isLoadingLogo: boolean = false
  public banner_img_path = environment.URLHOST + '/uploads/group/'
  public companyLogo_path = environment.URLHOST + '/uploads/group/'

  public logo_url_profile = environment.URLHOST + '/uploads/group/'

  public image_url_profile = environment.URLHOST + '/uploads/group/'

  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.creatCompanyGroupForm = this.formbuilder.group({
      name: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.required]],
      description: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.required]],
      type: ['', Validators.required],
      roleTitle: genralConfig.rolename.COMPANY,
    })
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')

    this.textarea = document.querySelector('#autoresizing')
    this.textarea.addEventListener('input', autoResize, false)

    function autoResize() {
      this.style.height = 'auto'
      this.style.height = this.scrollHeight + 'px'
    }
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }
  //COMPANY LOGO
  uploadeventLogo(fileInput: any) {
    this.isLoadingLogo = true
    this.fileData = <File>fileInput.target.files[0]
    if (this.fileData != undefined) {
      const formData = new FormData()
      formData.append('file', this.fileData)
      formData.append('type', 'GROUPIMAGE')
      this._generalService.uploadImageForPath(formData).subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.isLoadingLogo = false
            this.spinner.hide()
            this.uploadedEventLogo = res['data'].imagePath
          } else {
            window.scrollTo(0, 0)
            this.toastr.error(res['message'])
          }
        },
        (err) => {
          this.spinner.hide()
        }
      )
    } else {
      this.previewUrlLogo = ''
    }
  }

  //COMPANY BANNER LOGO

  uploadBannerImage(fileInput: any) {
    this.isLoadingBanner = true
    this.fileData = <File>fileInput.target.files[0]
    if (this.fileData != undefined) {
      const formData = new FormData()
      formData.append('file', this.fileData)
      formData.append('type', 'GROUPIMAGE')
      this._generalService.uploadImageForPath(formData).subscribe(
        (res) => {
          this.spinner.hide()
          if (res['code'] == 200) {
            this.isLoadingBanner = false
            this.spinner.hide()
            this.uploadedBannerImage = res['data'].imagePath
          } else {
            window.scrollTo(0, 0)
            this.toastr.error(res['message'])
          }
        },
        (err) => {
          this.spinner.hide()
        }
      )
    } else {
      this.previewUrlLogo = ''
    }
  }
  onSubmitCompanyGroupForm() {
    if (this.creatCompanyGroupForm.valid) {
      this.creatCompanyGroupForm.value.groupImage = this.uploadedEventLogo
      this.creatCompanyGroupForm.value.coverImage = this.uploadedBannerImage
      this.creatCompanyGroupForm.value.createdById = this.userObj.userInfo._id
      this.spinner.show()

      this._generalService.creatCompanyGroupProfile(this.creatCompanyGroupForm.value).subscribe(
        (result) => {
          if (result['code'] == 200) {
            this.spinner.hide()
            let groupId = result['data']._id
            this.toastr.success('Group Created Successfully')
            this.router.navigate([`/layout/social-media/group-view/${groupId}`])
          } else {
            this.toastr.warning('', result['message'])
            this.spinner.hide()
          }
        },
        (error) => {
          this.spinner.hide()
          this.toastr.error('', error)
        }
      )
    } else {
      this._generalService.markFormGroupTouched(this.creatCompanyGroupForm)
    }
  }
}
