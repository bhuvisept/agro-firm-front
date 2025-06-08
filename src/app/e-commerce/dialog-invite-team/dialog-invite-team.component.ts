import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Validators, FormGroup, FormBuilder } from '@angular/forms'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
import { MatDialog } from '@angular/material'
import { PlanConfirmationDialogComponent } from 'src/app/plan-confirmation-dialog/plan-confirmation-dialog.component'
import { UpgradeConfirmationDialogComponent } from 'src/app/upgrade-confirmation-dialog/upgrade-confirmation-dialog.component'
@Component({
  selector: 'app-dialog-invite-team',
  templateUrl: './dialog-invite-team.component.html',
  styleUrls: ['./dialog-invite-team.component.css'],
})
export class DialogInviteTeamComponent implements OnInit {
  driverForm: FormGroup
  sellerTypeCategorie = [{ name: 'Salesperson', value: 'SALESPERSON' }]
  btn_disabled: any
  userObj: any
  constructor(
    public dialogRef: MatDialogRef<DialogInviteTeamComponent>,
    private fb: FormBuilder,
    private service: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public type: string,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.driverForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(genralConfig.pattern.EMAIL)]],
      mobileNumber: ['', Validators.required],
      accessLevel: ['', Validators.required],
    })
  }
  onSubmit() {
    if (this.driverForm.valid) {
      this.btn_disabled = true
      this.driverForm.value.companyId = this.userObj.userInfo._id
      this.driverForm.value.companyId = this.userObj.userInfo.createdById ? this.userObj.userInfo.createdById : this.userObj.userInfo._id
      if (this.userObj.userInfo.roleId.roleTitle == 'SELLER') this.driverForm.value['companyId'] = this.userObj.userInfo._id
      else this.driverForm.value['companyId'] = this.userObj.userInfo.companyId
      this.driverForm.value['createdById'] = this.userObj.userInfo._id
      this.driverForm.value['planTitle'] = 'ECOMMERCE'
      this.driverForm.value['constName'] = 'NOOFSALESPERSONS'
      this.driverForm.value['roleTitle'] = this.userObj.userInfo.roleId.roleTitle
      this.spinner.show()
      this.service.driverRegister(this.driverForm.value).subscribe((res) => {
        if (res['code'] == 200) {
          this.toastr.success(res['message'])
          this.dialogRef.close()
        } else if (res['code'] == 404) {
          this.dialog.open(PlanConfirmationDialogComponent, { width: '550px' })
          this.dialogRef.close()
          this.btn_disabled = false
        } else if (res['code'] == 401) {
          this.dialog.open(UpgradeConfirmationDialogComponent, { width: '550px' })
          this.btn_disabled = false
          this.dialogRef.close()
        } else {
          this.btn_disabled = false
          this.dialogRef.close()
          this.toastr.warning(res['message'])
        }
        this.spinner.hide()
      })
    }
  }
  close() {
    this.dialogRef.close()
  }
}
