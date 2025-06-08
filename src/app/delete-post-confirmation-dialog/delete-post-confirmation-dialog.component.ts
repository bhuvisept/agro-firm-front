import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
@Component({
  selector: 'app-delete-post-confirmation-dialog',
  templateUrl: './delete-post-confirmation-dialog.component.html',
  styleUrls: ['./delete-post-confirmation-dialog.component.css'],
  providers: [NgxSpinnerService],
})
export class DeletePostConfirmationDialogComponent implements OnInit {
  roleName: any
  userObj: any
  postId: any

  constructor(
    public dialogRef: MatDialogRef<DeletePostConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.postId = this.data.postId
  }
  onNoClick(): void {
    this.dialogRef.close()
  }

  deletePostList() {
    let data = { postId: this.data.postId, userId: this.data.userId }
    this.spinner.show()
    this._generalService.postDelete(data).subscribe(
      (response) => {
        if (response['code'] == 200) this.dialogRef.close({ apiHit: true })
        else this.toastr.warning('', response['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Something went wrong')
      }
    )
  }
}
