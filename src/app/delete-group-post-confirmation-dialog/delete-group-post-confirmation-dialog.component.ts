import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'

@Component({
  selector: 'app-delete-group-post-confirmation-dialog',
  templateUrl: './delete-group-post-confirmation-dialog.component.html',
  styleUrls: ['./delete-group-post-confirmation-dialog.component.css'],
})
export class DeleteGroupPostConfirmationDialogComponent implements OnInit {
  roleName: any
  userObj: any
  postId: any
  constructor(
    public dialogRef: MatDialogRef<DeleteGroupPostConfirmationDialogComponent>,
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
    this.spinner.show()
    this._generalService.postDelete(this.data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.toastr.success('', response['message'])
          this.dialogRef.close({ apiHit: true })
        }
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Something went wrong')
      }
    )
  }
}
