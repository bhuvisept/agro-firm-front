import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { OwlOptions } from 'ngx-owl-carousel-o'
import { genralConfig } from '../constant/genral-config.constant'

@Component({
  selector: 'app-create-group-post-confirmation-dialog',
  templateUrl: './create-group-post-confirmation-dialog.component.html',
  styleUrls: ['./create-group-post-confirmation-dialog.component.css'],
  providers: [NgxSpinnerService],
})
export class CreateGroupPostConfirmationDialogComponent implements OnInit {
  customOptions: OwlOptions = {
    autoplay: false,
    center: true,
    nav: true,
    dots: false,
    loop: true,
    freeDrag: false,
    autoHeight: false,
    autoWidth: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    navText: ['<', '>'],
    responsive: { 0: { items: 1 }, 600: { items: 1, mouseDrag: true, touchDrag: true, pullDrag: true }, 1000: { items: 1 }, 1366: { items: 1, mouseDrag: false, touchDrag: false, pullDrag: false } },
  }

  createGroupPostForm: FormGroup
  roleName: any
  userObj: any

  fileData: File = null
  uploadedPostImage: any
  uploadedPostVideo: any
  previewUrlLogo: any = null
  postLogo: string
  textarea: any
  groupId: any
  groupPost: any
  eventLogo: any
  getGroupDetails: any
  uploadedEventLogo: any

  userName: any
  loading = false
  filesImg = []
  files = []
  productImages = []

  public companyLogo_path = environment.URLHOST + '/uploads/enduser/'
  public productImgPath = environment.URLHOST + '/uploads/post/image/'
  public banner_img_path = environment.URLHOST + '/uploads/group/'
  public postVideo_path = environment.URLHOST + '/uploads/post/video/'

  userId: any

  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<CreateGroupPostConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.userName = this.userObj.userInfo.personName
    this.userId = this.userObj.userInfo._id
    this.groupId = this.data.groupId
    this.uploadedEventLogo = this.userObj.userInfo.image
    this.createGroupPostForm = this.formbuilder.group({ caption: ['', [Validators.required]] })
    this.textarea = document.querySelector('#autoresizing')
    this.textarea.addEventListener('input', autoResize, false)
    function autoResize() {
      this.style.height = 'auto'
      this.style.height = this.scrollHeight + 'px'
    }
  }
  getCompanyGroupDetails() {
    let data = { _id: this.groupId, userId: this.userObj.userInfo._id }
    this._generalService.getCompanyGroupDetails(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.getGroupDetails = response['data']
        this.eventLogo = response['data'].groupImage
      } else this.toastr.warning('', response['message'])
      this.spinner.hide()
    })
  }

  space() {
    if (this.createGroupPostForm.invalid) return false
  }
  onSubmitGroupPostForm() {
    if (this.createGroupPostForm.valid) {
      console.log('addd')
      this.loading = true
      this.createGroupPostForm.value.createdById = this.userObj.userInfo._id
      this.createGroupPostForm.value.groupId = this.groupId
      this.createGroupPostForm.value.postType = 'groupPost'
      let data = {}
      if (this.data.type == 'share') data = { caption: this.createGroupPostForm.value.caption, groupId: this.groupId, postedById: this.userObj.userInfo._id, type: 'JOIN_GROUP' }
      else data = { type: 'GROUP', caption: this.createGroupPostForm.value.caption, media: this.filesImg, postedById: this.userObj.userInfo._id, groupId: this.groupId }
      this.spinner.show()
      this._generalService.creatpostForm(data).subscribe(
        (result) => {
          if (result['code'] == 200) {
            this.dialogRef.close({ apiHit: true })
            this.loading = false
          } else {
            this.toastr.warning('', result['message'])
            this.loading = false
          }
          this.spinner.hide()
        },
        () => {
          this.loading = false
          this.spinner.hide()
          this.toastr.warning('server error')
        }
      )
    } else this._generalService.markFormGroupTouched(this.createGroupPostForm)
  }

  onNoClick() {
    console.log('close')

    this.dialogRef.close({ apiHit: false })
  }

  async uploadPostImage(event) {
    if (event.target.files.length + this.filesImg.length <= 5) {
      const formData = new FormData()
      let isImagesCorrect = true
      for (let item of event.target.files) {
        let img = new Image()
        formData.append('files', item)
        img.src = window.URL.createObjectURL(item)
        await img.decode()
      }

      if (isImagesCorrect) {
        this._generalService.uploadImagePostPath(formData).subscribe((res) => {
          if (res['code'] == 200) {
            this.files = res['data']
            for (let item of this.files) {
              let data = { type: 'IMAGE', name: item }
              this.productImages.push(item)
              this.filesImg.push(data)
            }
            this.filesImg.reverse()
          } else this.toastr.warning(res['message'])
        })
      } else this.toastr.warning('width should be greater than 1100 and height must be 658 ')
    } else this.toastr.warning('Only 5 images can be uploaded')
  }

  //POST Video
  uploadPostVideo(fileInput: any) {
    if (fileInput.target.files.length + this.filesImg.length <= 5) {
      this.fileData = <File>fileInput.target.files[0]
      const formData = new FormData()
      formData.append('file', this.fileData)
      formData.append('type', 'POSTVIDEO')
      this._generalService.uploadVideoPostPath(formData).subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.uploadedPostVideo = res['data'].imagePath
            let data = { type: 'VIDEO', name: this.uploadedPostVideo }
            this.filesImg.push(data)
            this.filesImg.reverse()
          } else {
            window.scrollTo(0, 0)
            this.toastr.error(res['message'])
          }
          this.spinner.hide()
        },
        () => this.spinner.hide()
      )
    } else {
      this.previewUrlLogo = ''
      this.toastr.warning('Only 5 Video can be uploaded')
    }
  }

  deleteImageFile(img) {
    this.spinner.show()
    this._generalService.deleteImage({ filePath: '../truck-backend/uploads/post/image/', file: [img] }).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.uploadedPostImage = null
          let index = this.filesImg.indexOf(img)
          this.filesImg.splice(index, 1)
        } else this.toastr.warning(res.message)
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  deleteVideoFile(img) {
    this.spinner.show()
    this._generalService.deleteVideo({ filePath: '../truck-backend/uploads/post/video/', file: img.name }).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.uploadedPostVideo = null
          let index = this.filesImg.indexOf(img)
          this.filesImg.splice(index, 1)
        } else this.toastr.warning(res.message)
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }
}
