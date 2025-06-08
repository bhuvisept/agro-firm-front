import { Component, OnInit, Inject, NgZone, ChangeDetectorRef } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Router } from '@angular/router'
import { ThrowStmt } from '@angular/compiler'
import { MatDialog } from '@angular/material'
import { PlanConfirmationDialogComponent } from 'src/app/plan-confirmation-dialog/plan-confirmation-dialog.component'
import { UpgradeConfirmationDialogComponent } from 'src/app/upgrade-confirmation-dialog/upgrade-confirmation-dialog.component'

@Component({
  selector: 'app-new-driver-invite',
  templateUrl: './new-driver-invite.component.html',
  styleUrls: ['./new-driver-invite.component.css'],
  providers: [NgxSpinnerService]
})
export class NewDriverInviteComponent implements OnInit {
  driverForm: FormGroup
  userObj: any
  btn_disabled: boolean = false
  accessID: any
  typeCategorie = [
    { name: 'Dispatcher', value: 'DISPATCHER' },
    { name: 'Driver', value: 'DRIVER' },
    { name: 'HR', value: 'HR' },
  ]
  userId: any
  totalPlan: any
  currentPlan: any

  constructor(
    private fb: FormBuilder,
    private genralService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    public dialogRef: MatDialogRef<NewDriverInviteComponent>,
    @Inject(MAT_DIALOG_DATA) public type: string,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    console.log(this.type,"type");
    
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    if (this.userObj && this.userObj.userInfo) {
      this.userId = this.userObj.userInfo._id
    }

    this.driverForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      lastName: ['', [Validators.required, Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      email: ['', [Validators.required, Validators.pattern(genralConfig.pattern.EMAIL)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(genralConfig.pattern.PHONE_NO)]],
      accessLevel: ['', Validators.required],
    })
  }

  onSubmit() {
    if (this.driverForm.valid) {
      this.btn_disabled = true
      this.driverForm.value.createdById = this.userObj.userInfo._id
      this.driverForm.value.companyId = this.userObj.userInfo.createdById ? this.userObj.userInfo.createdById : this.userObj.userInfo._id

      let constKey
      switch (this.driverForm.value.accessLevel) {
        case 'HR':
          constKey = 'NOOFHR'
          break
        case 'DRIVER':
          constKey = 'NOOFDRIVERS'
          break
        case 'DISPATCHER':
          constKey = 'NOOFDISPATCHER'
          break
      }

      if (this.userObj.userInfo.roleId.roleTitle == 'COMPANY') {
        this.driverForm.value['companyId'] = this.userId
      } else {
        this.driverForm.value['companyId'] = this.userObj.userInfo.companyId
      }

      this.driverForm.value['createdById'] = this.userId
      this.driverForm.value['planTitle'] = 'TRIPPLAN'
      this.driverForm.value['constName'] = constKey
      //  this.driverForm.value['roleTitle'] = this.userObj.userInfo.roleId.roleTitle
      this.driverForm.value['roleTitle'] = this.userObj.userInfo.roleId.roleTitle == 'COMPANY' ? this.userObj.userInfo.roleId.roleTitle : this.userObj.userInfo.accessLevel

      // return
      this.spinner.show()
      this.genralService.driverRegister(this.driverForm.value).subscribe((result) => {
        if (result['code'] == 200) {
          this.toastr.success(result['message'])
          this.spinner.hide()
          this.driverForm.reset()
          this.dialogRef.close()
          this.btn_disabled = false
        } else if (result['code'] == 404) {
          const dialogRef = this.dialog.open(PlanConfirmationDialogComponent, {
            width: '550px',
            data: 'TRIP PLANNER',
          })
          this.dialogRef.close()
          this.spinner.hide()
          this.btn_disabled = false
        } else if (result['code'] == 401) {
          const dialogRef = this.dialog.open(UpgradeConfirmationDialogComponent, {
            width: '550px',
          })
          this.dialogRef.close()
          this.spinner.hide()
          this.btn_disabled = false
        } else {
          this.dialogRef.close()
          this.spinner.hide()
          this.toastr.warning(result['message'])
        }
      })
    }
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
}
