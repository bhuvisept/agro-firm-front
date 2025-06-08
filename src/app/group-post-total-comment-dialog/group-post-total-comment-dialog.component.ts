import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'

@Component({
  selector: 'app-group-post-total-comment-dialog',
  templateUrl: './group-post-total-comment-dialog.component.html',
  styleUrls: ['./group-post-total-comment-dialog.component.css'], 
  providers: [NgxSpinnerService],
})
export class GroupPostTotalCommentDialogComponent implements OnInit {
  commentPostList: any
  userObj: any
  roleName: any
  postId: any
  textarea: any
  userName: any
  ROLETITLE:any
  public postProfileImage = environment.URLHOST + '/uploads/company/'
  public endUserProfileImage = environment.URLHOST + '/uploads/enduser/'
  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<GroupPostTotalCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.userName = this.userObj.userInfo.personName
    this.postId = this.data.postId
    this.getPostCommentList() 
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
  getPostCommentList() {
    let data = {
      postId: this.postId,
    }
    this.spinner.show()
    this._generalService.getPostCommentListDetails(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.spinner.hide()
        this.commentPostList = response['data']
     
        } 
      },
      (error) => {
        this.spinner.hide()
        // this.toastr.warning('Something went wrong')
      }
    )
  }

}
