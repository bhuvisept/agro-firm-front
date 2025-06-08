import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-driver-trip-complete',
  templateUrl: './driver-trip-complete.component.html',
  styleUrls: ['./driver-trip-complete.component.css'],
})
export class DriverTripCompleteComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DriverTripCompleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  completeTrip() {
    let data = { _id: this.data._id, cancelledById: this.data.cancelledById, runningStatus: 'COMPLETED', userId: this.data.cancelledById, userName: this.data.userName }
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
