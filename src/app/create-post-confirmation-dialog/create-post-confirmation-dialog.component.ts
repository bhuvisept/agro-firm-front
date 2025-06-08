import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { MatDialog } from '@angular/material/dialog'
import { SharedService } from 'src/app/service/shared.service'
import { OwlOptions } from 'ngx-owl-carousel-o'
import { Subscription, interval } from 'rxjs'

@Component({
  selector: 'app-create-post-confirmation-dialog',
  templateUrl: './create-post-confirmation-dialog.component.html',
  styleUrls: ['./create-post-confirmation-dialog.component.css'],
  providers: [NgxSpinnerService],
})
export class CreatePostConfirmationDialogComponent implements OnInit {
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
  createPostForm: FormGroup
  userObj: any
  groupTypeList: any = [{ name: 'Anyone' }, { name: 'Connections' }]
  ROLETITLE: any
  loading = false
  public profile = environment.URLHOST + '/uploads/enduser/'
  textarea: any
  homePostList: any
  userInfo: any
  userName: any
  groupdetail: any
  isLoading
  // thumbnailUrl: string
  // public postProfileImage = environment.URLHOST + '/uploads/company/'
  // public driverPath = environment.URLHOST + '/uploads/driver/'
  // slider = false
  // previewUrlLogo: any = null
  // roleName: any
  // postLogo: string
  // fileData: File = null
  // uploadedPostVideo: any
  // uploadedPostImage: any
  // public productImgPath = genralConfig.networkImages.network_image
  // public postVideo_path = genralConfig.networkImages.network_video
  // groupLists: any
  // groupName
  // productImages: any = []
  // filesImg: any = []
  // files: any
  // imageObj = []
  imageUrl = []
  filesForS3
  sub: Subscription
  // value = 0
  // ceiling = 100
  // increment = 20
  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    public dialog: MatDialog,
    private SharedService: SharedService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,

    public currentDialogRef: MatDialogRef<CreatePostConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.ROLETITLE = this.userObj.userInfo.roleId.roleTitle
    this.userName = this.userObj.userInfo.personName
    this.createPostForm = this.formbuilder.group({ caption: ['', [Validators.required]] })
    this.textarea = document.querySelector('#autoresizing')
    this.textarea.addEventListener('input', autoResize, false)
    function autoResize() {
      this.style.height = 'auto'
      this.style.height = this.scrollHeight + 'px'
    }

    this.SharedService.getSelectedGroup().subscribe((res) => {
      this.groupdetail = res
      this.createPostForm.patchValue({ type: this.groupdetail.groupId })
    })
  }

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
  //           this.uploadedPostVideo = res['data'].imagePath
  //           let data = { type: 'VIDEO', name: this.uploadedPostVideo }
  //           this.filesImg.push(data)
  //           this.filesImg.reverse()
  //         } else {
  //           window.scrollTo(0, 0)
  //           this.toastr.error(res['message'])
  //         }
  //         this.spinner.hide()
  //       },
  //       (err) => this.spinner.hide()
  //     )
  //   } else {
  //     this.previewUrlLogo = ''
  //     this.toastr.warning('Only 5 Video can be uploaded')
  //   }
  // }

  // image upload on s3 bucket without backend

  uploadS3File(event) {
    
    this.isLoading = true
    // this.filesForS3 = event.target.files
    // this.percentagevalue=(event.target.files.length * 100)/ 10;
    // this.percentagevalue=Math.round((100 / event.target.files.length) * event.target.files.length)
    this.filesForS3 = { newS3Files: event.target.files, afterDeleteImg: this.imageUrl }
  }
    

  showS3FileData(val: any) {
    // let imgUrl = val.split('/').shift()
    // let imgName = val.split('/').pop()
    // this.imageUrl.push(imgUrl+'/thumbnail_500x300/'+imgName)

    this.imageUrl = val
    this.isLoading = false
   

  }
  // deleteS3File(image, index: number, type: any) {
  //   this.spinner.show()
  //   let filename = image.substring(image.lastIndexOf('/') + 1).split('?')[0]
  //   let filePath
  //   if (type == 'IMAGE') filePath = { filePath: '../truck-backend/uploads/post/image/', file: [{ name: filename, type: type }] }
  //   else if (type == 'VIDEO') filePath = { filePath: '../truck-backend/uploads/post/video/', file: [{ name: filename, type: type }] }
  //   this._generalService.deleteImage(filePath).subscribe(
  //     (res) => {
  //       if (res['code'] == 200) {
  //         this.imageUrl.splice(index, 1)
  //       } else this.toastr.warning(res.message)
  //       this.spinner.hide()
  //     },
  //     () => {
  //       this.spinner.hide()
  //       this.toastr.warning('Server Error')
  //     }
  //   )
  // }

  // deleteS3File(image, index, type) {
  //   this.spinner.show()
  //   this.s3Bucket.deleteS3File(image, index, type)
  //   if (this.s3Bucket.deleteS3FileStatus == true) this.imageUrl.splice(index, 1)
  //   this.isLoading = false
  //   this.spinner.hide()
  // }

  onSubmitCreatePostForm() {
    this.spinner.show()

    let imageUrl = this.imageUrl.map((res) => {
      delete res.urlType
      res.name = res.name.split('/').pop()
      return res
    })

    
    if (this.createPostForm.value.caption) {
      this.loading = true
      this.createPostForm.value.postedById = this.userObj.userInfo._id
      this.createPostForm.value.type = 'INDIVIDUAL'
      this.createPostForm.value.media = imageUrl ? imageUrl : []
      this._generalService.creatpostForm(this.createPostForm.value).subscribe(
        (result) => {
          if (result['code'] == 200) {
            this.createPostForm.reset()
            this.currentDialogRef.close({ apiHit: true })
            this.loading = false
          } else {
            this.toastr.warning(result['message'])
            this.loading = false
          }
          this.spinner.hide()
        },
        () => {
          this.spinner.hide()
          this.loading = false
        }
      )
    } else {
      this._generalService.markFormGroupTouched(this.createPostForm)
      this.loading = false
    }
  }
}


// uploadS3File(event) {
//   console.log(event)
//   this.isLoading = true
 
//     const inputElement = event.srcElement
//     console.log(inputElement)
//     let options = FilePond.setOptions({
//       allowDrop: false,
//       allowReplace: false,
//       dropOnPage:false,
//       labelIdle:'',
//       dropOnElement:false,
//       iconRemove:'',
//       labelButtonAbortItemLoad:"abort"
//     });
//   const pond = FilePond.create(inputElement, {
//     imageCropAspectRatio: 1,
//     imageResizeTargetWidth: 1100,
//     imageResizeTargetHeight: 685,
//     imageResizeMode: 'contain',
//     imageTransformVariants: {
//       thumb_medium_: transforms => {
//         transforms.resize.size.width = 800;
//         transforms.resize.size.height = 500;
//         // transforms.crop.aspectRatio = .5;
//         return transforms;
//       },
//       // thumb_small_: transforms => {
//       //   transforms.resize.size.width = 245;
//       //   transforms.resize.size.height = 245;
//       //   return transforms;
//       // }
//     },
//     onaddfile: (err, fileItem) => {
//     },
//     onpreparefile: (fileItem, outputFiles) => {
//        let thumbnailFiles=outputFiles.map((res)=> {
//         console.log(res.file)
//         return res.file
//        })
//      outputFiles.forEach(output => {
//         const img = new Image();
//          let thumbnailUrls = URL.createObjectURL(output.file);
//          this.filesForS3 = { newS3Files: thumbnailFiles, thumbnails:thumbnailUrls}
        
//         // document.body.appendChild(img);
//       })
//     }
//   }); 
//   // return
//   // this.filesForS3 = event.target.files
//   // this.percentagevalue=(event.target.files.length * 100)/ 10;
//   // this.percentagevalue=Math.round((100 / event.target.files.length) * event.target.files.length)
//   // this.filesForS3 = { newS3Files: event.target.files, afterDeleteImg: this.imageUrl }
//   this.sub = interval(500).subscribe((x) => {
//     this.progressBar()
//   })
// }
