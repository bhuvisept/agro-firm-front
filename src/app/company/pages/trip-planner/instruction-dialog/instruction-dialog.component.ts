import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'
import { FormControl } from '@angular/forms'
@Component({
  selector: 'app-instruction-dialog',
  templateUrl: './instruction-dialog.component.html',
  styleUrls: ['./instruction-dialog.component.css'],
})
export class InstructionDialogComponent implements OnInit {
  reasonsList: any
  reason = new FormControl()
  userId: any

  constructor(
    public dialogRef: MatDialogRef<InstructionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    let data = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = data.userInfo
    this.getResonList()
  }
  cancelTrip() {
    let data = {
      userId: this.userId._id,
      userName: this.userId.personName,
      _id: this.data._id,
      reasonType: this.reason.value,
      cancelledById: this.data.cancelledById,
      runningStatus: 'CANCELLED',
      accessLevel: this.userId.accessLevel,
      roleTitle: this.userId.roleId.roleTitle,
    }
    this.spinner.show()
    this._generalService.deleteTtrip(data).subscribe((res) => {
      if (res['code'] == 200) this.toastr.success(res['message'])
      else this.toastr.warning(res['message'])
      this.spinner.hide()
    })
  }

  getResonList() {
    let data = { reasonType: 'cancelReason' }
    this._generalService.cancelReasonList(data).subscribe((res) => res['code'] == 200 && (this.reasonsList = res['data']))
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
