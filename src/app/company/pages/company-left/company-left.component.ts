import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { FormControl } from '@angular/forms'
import { Router } from '@angular/router'
@Component({
  selector: 'app-company-left',
  templateUrl: './company-left.component.html',
  styleUrls: ['./company-left.component.css'],
})
export class CompanyLeftComponent implements OnInit {
  reasonsList: any
  reason = new FormControl()
  constructor(
    public dialogRef: MatDialogRef<CompanyLeftComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private _generalService: GeneralServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getResonList()
  }

  leaveCompany() {
    let data = {
      companyId: this.data.companyId,
      userId: this.data.userId,
      reason: this.reason.value,
      accessLevel: this.data.accessLevel,
      userName: this.data.userName,
    }
    this.spinner.show()
    this._generalService.leaveCompany(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.spinner.hide()
        this.toastr.success(res['message'])
        localStorage.clear()
        this.router.navigate(['/login'])
      } else {
        this.spinner.hide()
        this.toastr.warning(res['message'])
      }
    })
  }

  getResonList() {
    this._generalService.reasonList({ isActive: 'true', isDeleted: 'false', reasonType: 'leaveReason' }).subscribe((res) => res['code'] == 200 && (this.reasonsList = res['data']))
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  function(e) {}
}
