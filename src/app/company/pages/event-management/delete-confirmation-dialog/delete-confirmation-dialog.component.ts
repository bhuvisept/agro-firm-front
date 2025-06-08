import { Component, OnInit ,Inject} from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  providers: [NgxSpinnerService],
})
export class DeleteConfirmationDialogComponent implements OnInit {
  roleName: any
  userObj: any
  id: any

  constructor(
 public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _generalService: GeneralServiceService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.id = this.data
  }
  onNoClick(): void {
    this.dialogRef.close()
  }

  deleteEvent(id) {
    this._generalService.eventDelete(this.id ).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.toastr.success(res['message'])
          this.router.navigate(['layout/myaccount/event-management'])
        } else {
          window.scrollTo(0, 0)
          this.toastr.success(res['message'])

          this.toastr.error(res['message'])
        }
      },
      (err) => {
        this.toastr.error('error')
        this.spinner.hide()
      }
    )
  }
}
