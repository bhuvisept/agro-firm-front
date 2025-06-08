import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'

@Component({
  selector: 'app-delete-connection-confirmation-dialog',
  templateUrl: './delete-connection-confirmation-dialog.component.html',
  styleUrls: ['./delete-connection-confirmation-dialog.component.css'],
})
export class DeleteConnectionConfirmationDialogComponent implements OnInit {
  userObj: any
  roleName: any
  invitationId: any
  constructor(
    public dialogRef: MatDialogRef<DeleteConnectionConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.invitationId = this.data
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  deleteConnectList() {
    let data = { invitationId: this.invitationId, removeType: 'REMOVEFRIEND' }
    this.spinner.show()
    this._generalService.connectionDeleteOnList(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.dialogRef.close({ apiHit: true })
          this.spinner.hide()
        } else {
          this.toastr.warning(response['message'])
          this.spinner.hide()
        }
      },
      (error) => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }
}
