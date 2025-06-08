import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'
import { FormControl } from '@angular/forms'
@Component({
  selector: 'app-trip-complete',
  templateUrl: './trip-complete.component.html',
  styleUrls: ['./trip-complete.component.css'],
})
export class TripCompleteComponent implements OnInit {
  userData: any

  constructor(
    public dialogRef: MatDialogRef<TripCompleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('truckStorage'))
  }
  completeTrip() {
    let data = {
      _id: this.data._id,
      cancelledById: this.data.cancelledById,
      runningStatus: 'COMPLETED',
      userId: this.data.cancelledById,
      userName: this.data.userName,
      roleTitle: this.userData.userInfo.roleId.roleTitle,
      accessLevel: this.userData.userInfo.accessLevel,
    }
    this.spinner.show()
    this._generalService.completeTrip(data).subscribe(
      (res) => {
        if (res['code'] == 200) this.toastr.success(res['message'])
        else this.toastr.warning(res['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
}
