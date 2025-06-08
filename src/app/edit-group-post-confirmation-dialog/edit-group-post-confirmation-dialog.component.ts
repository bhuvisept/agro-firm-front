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
  selector: 'app-edit-group-post-confirmation-dialog',
  templateUrl: './edit-group-post-confirmation-dialog.component.html',
  styleUrls: ['./edit-group-post-confirmation-dialog.component.css'],
  providers: [NgxSpinnerService],
})
export class EditGroupPostConfirmationDialogComponent implements OnInit {
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

  postImage: any
  postVideo: any
  postProfileName: any
  groupId: any
  getGroupDetails: any
  eventLogo: any
  uploadedEventLogo: any
  textarea: any
  filesImg = []
  files: any
  imagesToBeDeleted: any[] = []
  videosToBeDelete: any[] = []
  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<EditGroupPostConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public group_Image_path = environment.URLHOST + '/uploads/enduser/'
  public networkImages = genralConfig.networkImages.network_image
  public postVideo_path = genralConfig.networkImages.network_video

  editGroupPostForm: FormGroup
  roleName: any
  userObj: any
  uploadedPostImage: any
  previewUrlLogo: any = null
  postLogo: string
  uploadedPostVideo: any
  fileData: File = null
  groupTypeList: any = [{ name: 'Anyone' }, { name: 'Connections' }]

  viewPostForm: Boolean = false
  updatePostForm: Boolean = true
  postId: any
  userImage: string
  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.groupId = this.data.groupId
    this.postId = this.data.postId
    this.userImage = this.userObj.userInfo.image

    this.editGroupPostForm = this.formbuilder.group({
      caption: ['', [Validators.required]],
    })

    this.editGroupPostForm.patchValue({
      caption: this.data.caption,
    })

    this.filesImg.push(...this.data.media)
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
  // View to Edit
  showEditForm() {
    this.viewPostForm = false
    this.updatePostForm = true
  }

  getCompanyGroupDetails() {
    let data = { _id: this.groupId }
    this.spinner.show()
    this._generalService.getCompanyGroupDetails(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.getGroupDetails = response['data']
        this.eventLogo = response['data'].groupImage
        this.spinner.hide()
      } else {
        this.toastr.warning('', response['message'])
        this.spinner.hide()
      }
    })
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
            let response = res['data']
            for (let item of response) {
              let data = { type: 'IMAGE', name: item }
              this.filesImg.push(data)
            }
            this.filesImg.reverse()
          } else {
            this.toastr.warning(res['message'])
          }
        })
      } else {
        this.toastr.warning('width should be greater than 1100 and height must be 658 ')
      }
    } else {
      this.toastr.warning('Only 5 images can be uploaded')
    }
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
            this.spinner.hide()
            let data = {
              type: 'VIDEO',
              name: res['data'].imagePath,
            }
            this.filesImg.push(data)
            this.filesImg.reverse()
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
      this.toastr.warning('Only 5 Video can be uploaded')
    }
  }

  onSubmitEditPostForm() {
    if (this.editGroupPostForm.valid) {
      this.editGroupPostForm.value.postId = this.data._id
      this.editGroupPostForm.value.userId = this.userObj.userInfo._id
      this.editGroupPostForm.value.media = this.filesImg ? [...this.filesImg] : []
      this._generalService.postDetailsUpdate(this.editGroupPostForm.value).subscribe((result) => {
        if (result['code'] == 200) {
          this.dialogRef.close({ ...this.editGroupPostForm.value, apiHit: true })
        } else {
          this.toastr.warning(result['message'])
        }
      })
      ;(error) => {
        this.toastr.warning('Server Error')
      }
    } else {
      this._generalService.markFormGroupTouched(this.editGroupPostForm)
    }
  }

  deletePostFile(index: number) {
    this.filesImg.splice(index, 1)
  }
}
