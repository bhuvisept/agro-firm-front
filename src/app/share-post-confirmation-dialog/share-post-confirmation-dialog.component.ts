import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-share-post-confirmation-dialog',
  templateUrl: './share-post-confirmation-dialog.component.html',
  styleUrls: ['./share-post-confirmation-dialog.component.css'],
  providers: [NgxSpinnerService],
})
export class SharePostConfirmationDialogComponent implements OnInit {
  customOptions: OwlOptions = {
    autoplay: false,
    center: true,
    nav:true,
    dots: false,
    loop:true,
    freeDrag:false,
    autoHeight: false,
    autoWidth: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    navText: ['<', '>'],
    
    responsive: {
      0: {
        items: 1,   

      },
      600: {
        items: 1,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
      },
      1000: {
        items: 1,
      },
      1366: {
        items: 1,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
      }
    }
  }
  sharePostForm: FormGroup
  userId: any
  userInfo: any
  roleName: any
  userObj: any
  post: any
  userName: any
  public postImage_path = environment.URLHOST + '/uploads/post/image/'
  public postVideo_path = environment.URLHOST + '/uploads/post/video/'
  public networkImages = environment.URLHOST+'/uploads/post/image/'
  public logo_url_profile = environment.URLHOST 
  public endUser = environment.URLHOST + '/uploads/enduser/'
 
  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<SharePostConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.userName = this.userObj.userInfo.personName
    this.post = this.data.post
   console.log(this.post,"pppppppppppppp");
   
    this.sharePostForm = this.formbuilder.group({text: ['', [Validators.required]],})
  }
  onNoClick(): void {this.dialogRef.close()}

  onSubmitSharePostForm() {

    
      let data = { userId: this.userObj.userInfo._id,postId: this.post._id,caption: this.sharePostForm.value.text,userName:this.userName}
    if (this.sharePostForm.valid) {
      this.spinner.show()
      this._generalService.addSharePost(data).subscribe(
        (result) => {
          if (result['code'] == 200) {
            this.spinner.hide()
            this.toastr.success('', result['message'])
            this.dialogRef.close({apiHit:true})
          } else {this.toastr.warning(result['message']);this.spinner.hide();}},
        (error) => {this.toastr.warning('server error');this.spinner.hide();}
      )
    } 
  }
}
