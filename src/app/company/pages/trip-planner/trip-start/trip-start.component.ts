import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'

@Component({
  selector: 'app-trip-start',
  templateUrl: './trip-start.component.html',
  styleUrls: ['./trip-start.component.css'],
})
export class TripStartComponent implements OnInit {
  userObj: any
  constructor(
    public dialogRef: MatDialogRef<TripStartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
  }

  startTrip() {
    let data = {
      _id: this.data._id,
      cancelledById: this.data.cancelledById,
      runningStatus: 'ACTIVE',
      userId: this.data.cancelledById,
      userName: this.data.userName,
      roleTitle: this.userObj.userInfo.roleId.roleTitle,
      accessLevel: this.userObj.userInfo.accessLevel,
    }
    this.spinner.show()
    this._generalService.completeTrip(data).subscribe((res) => {
      if (res['code'] == 200) this.toastr.success(res['message'])
      else this.toastr.warning(res['message'])
      this.spinner.hide()
    })
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
}
