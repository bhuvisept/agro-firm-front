import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'

@Component({
  selector: 'app-start-trip-dialog',
  templateUrl: './start-trip-dialog.component.html',
  styleUrls: ['./start-trip-dialog.component.css'],
})
export class StartTripDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<StartTripDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  startTrip() {
    let data = { _id: this.data._id, cancelledById: this.data.cancelledById, runningStatus: 'ACTIVE', userId: this.data.cancelledById, userName: this.data.userName }
    this.spinner.show()
    this._generalService.startTrip(data).subscribe((res) => {
      if (res['code'] == 200) this.toastr.success(res['message'])
      else this.toastr.warning(res['message'])
      this.spinner.hide()
    })
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
