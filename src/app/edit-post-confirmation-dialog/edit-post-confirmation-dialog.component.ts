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
  selector: 'app-edit-post-confirmation-dialog',
  templateUrl: './edit-post-confirmation-dialog.component.html',
  styleUrls: ['./edit-post-confirmation-dialog.component.css'],
  providers: [NgxSpinnerService],
})
export class EditPostConfirmationDialogComponent implements OnInit {
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

  postProfileName: any
  filesImg = []
  files = []
  loggedInUser: any
  isLoading: boolean=false
  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<EditPostConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  public ENDuSER = environment.URLHOST + '/uploads/enduser/'
  public networkImages = genralConfig.networkImages.network_image
  public postVideo_path = genralConfig.networkImages.network_video
  editPostForm: FormGroup
  roleName: any
  userObj: any
  // uploadedPostImage: any
  // postImage: any
  // postVideo: any
  // imagesToBeDeleted: any[] = []
  // videosToBeDelete: any[] = []
  // previewUrlLogo: any = null
  // postLogo: string
  // uploadedPostVideo: any
  // fileData: File = null
  // public postProfileImage = environment.URLHOST + '/uploads/company/'
  // public driverPath = environment.URLHOST + '/uploads/driver/'
  groupTypeList: any = [{ name: 'Anyone' }, { name: 'Connections' }]
  viewPostForm: Boolean = false
  updatePostForm: Boolean = true
  postId: any
  filesForS3
  imageUrl = []

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.postId = this.data.postId
    this.loggedInUser = this.userObj.userInfo._id
    this.editPostForm = this.formbuilder.group({ caption: ['', [Validators.required]] })
    this.filesImg.push(...this.data.media)
    this.editPostForm.patchValue({ caption: this.data.caption })
  }

  // View to Edit
  // showEditForm() {
  //   this.viewPostForm = false
  //   this.updatePostForm = true
  // }

  //POST IMAGE
  uploadS3File(event) {
    this.isLoading = true
    this.filesForS3={newS3Files:event.target.files, oldS3Files:this.filesImg}
  }

  showS3FileData(val:any){
    // let urls=[...new Set(val)];
      this.filesImg  = val.filter((item, index, self) => index === self.findIndex(obj => obj.name === item.name ));
  }

  // async uploadPostImage(event) {
  //   if (event.target.files.length + this.filesImg.length <= 5) {
  //     const formData = new FormData()
  //     let isImagesCorrect = true
  //     for (let item of event.target.files) {
  //       let img = new Image()
  //       formData.append('files', item)
  //       img.src = window.URL.createObjectURL(item)
  //       await img.decode()
  //     }

  //     if (isImagesCorrect) {
  //       this._generalService.uploadImagePostPath(formData).subscribe((res) => {
  //         if (res['code'] == 200) {
  //           let response = res['data']
  //           for (let item of response) {
  //             let other = { name: item, type: 'IMAGE', _id: null }
  //             this.filesImg.push(other)
  //           }
  //           this.filesImg.reverse()
  //         } else this.toastr.warning(res['message'])
  //       })
  //     } else this.toastr.warning('width should be greater than 1100 and height must be 658 ')
  //   } else this.toastr.warning('Only 5 images can be uploaded')
  // }

  //POST Video
  // uploadPostVideo(fileInput: any) {
  //   if (fileInput.target.files.length + this.filesImg.length <= 5) {
  //     this.fileData = <File>fileInput.target.files[0]
  //     const formData = new FormData()
  //     formData.append('file', this.fileData)
  //     formData.append('type', 'POSTVIDEO')
  //     this._generalService.uploadVideoPostPath(formData).subscribe(
  //       (res) => {
  //         if (res['code'] == 200) {
  //           this.spinner.hide()
  //           this.uploadedPostVideo = res['data'].imagePath
  //           let data = { type: 'VIDEO', name: this.uploadedPostVideo }
  //           this.filesImg.push(data)
  //           this.filesImg.reverse()
  //         } else {
  //           window.scrollTo(0, 0)
  //           this.toastr.error(res['message'])
  //         }
  //       },
  //       () => this.spinner.hide()
  //     )
  //   } else {
  //     this.previewUrlLogo = ''
  //     this.toastr.warning('Only 5 Video can be uploaded')
  //   }
  // }
  // deletePostFile(index: number) {
  //   this.filesImg.splice(index, 1)
  // }
  
//   deleteS3File(image, index, type){
//   this.s3Bucket.deleteS3File(image, index, type)
//   if(this.s3Bucket.deleteS3FileStatus==true) this.filesImg.splice(index, 1)
// }



  onSubmitEditPostForm() {
    this.spinner.show()
    if (this.editPostForm.valid) {
      let imageUrl=this.filesImg.map((res)=>{ 
        delete res.urlType
        return res
      })
      let data = { caption: this.editPostForm.value.caption, media: imageUrl, type: 'INDIVIDUAL', postId: this.data._id, userId: this.loggedInUser }
      this._generalService.postDetailsUpdate(data).subscribe(
        (result) => {
          if (result['code'] == 200) this.dialogRef.close({ ...data, apiHit: true })
          else this.toastr.warning('', result['message'])
          this.spinner.hide()
        },
        () => this.spinner.hide()
      )
    } else this._generalService.markFormGroupTouched(this.editPostForm)
  }


}
