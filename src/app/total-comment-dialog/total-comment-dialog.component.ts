import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-total-comment-dialog',
  templateUrl: './total-comment-dialog.component.html',
  styleUrls: ['./total-comment-dialog.component.css'],
  providers: [NgxSpinnerService],
})
export class TotalCommentDialogComponent implements OnInit {
  userObj: any
  postId: any
  userLikedList = []
  public postProfileImage = environment.URLHOST + '/uploads/company/'
  public endUserProfileImage = environment.URLHOST + '/uploads/enduser/'
  modalScrollDistance = 2
  modalScrollThrottle = 50
  page = 1
  constructor(private _generalService: GeneralServiceService, private toastr: ToastrService, public dialogRef: MatDialogRef<TotalCommentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.postId = this.data.postId
    this.getPostCommentList()
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
  getPostCommentList() {
    let data = { userId: this.userObj.userInfo._id, postId: this.postId, count: 10, page: this.page }
    this._generalService.getPostLikeDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.userLikedList.push(...response['data'])
        } else if (response['code'] == 405) {
          this.dialogRef.close({ routeBack: true })
          this.toastr.warning(response['message'])
        } else {
          this.toastr.warning(response['message'])
          this.dialogRef.close()
        }
      },
      () => {
        this.toastr.warning('Server Error')
      }
    )
  }

  onModalScrollDown() {
    if (this.data.likedCount > this.userLikedList.length) {
      this.page++
      this.getPostCommentList()
    }
  }
}
