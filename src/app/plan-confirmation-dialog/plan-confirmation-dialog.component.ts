import { Component, OnInit, Inject, NgZone, ChangeDetectorRef } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Router } from '@angular/router'
import { SharedService } from 'src/app/service/shared.service'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast'

@Component({
  selector: 'app-plan-confirmation-dialog',
  templateUrl: './plan-confirmation-dialog.component.html',
  styleUrls: ['./plan-confirmation-dialog.component.css'],
})
export class PlanConfirmationDialogComponent implements OnInit {
  isActive: any
  planImage: any = 'Ecommerce'
  userObj: any
  accessLevel: any
  roleTitle: any
  pName: any = []
  currentPlan: any
  constructor(
    private sharedService: SharedService,
    private _generalService: GeneralServiceService,
    public Router: Router,
    public toaster: ToastrService,
    public dialogRef: MatDialogRef<PlanConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.planImage = this.data
    if (this.userObj) {
      this.accessLevel = this.userObj.userInfo.accessLevel
      this.roleTitle = this.userObj.userInfo.roleId.roleTitle
      this.accessLevel == 'ENDUSER' && this.plans.push({ name: 'GPS', compare: 'GPS', img: 'assets/plan6.jpg' })
    }
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
  plans = [
    { name: 'Ecommerce', compare: 'ECOMMERCE', img: 'assets/plan1.jpg' },
    { name: 'Event', compare: 'EVENT', img: 'assets/plan2.jpg' },
    { name: 'Job', compare: 'JOB', img: 'assets/plan3.jpg' },
    { name: 'Service', compare: 'SERVICE', img: 'assets/plan4.jpg' },
    { name: 'Trip Planner', compare: 'TRIP PLANNER', img: 'assets/plan5.jpg' },
    { name: 'Weather', compare: 'WEATHER', img: 'assets/plan6.jpg' },
  ]

  reDirect(value) {
    let UserData = {
      planSelectKey: value,
    }
    this.sharedService.setpaymentKey(UserData)
    if (this.userObj) {
      this.pName = this.userObj.userInfo.planName ? this.userObj.userInfo.planName : []
      this.currentPlan = this.pName.includes(value.toUpperCase())
    }
    if (this.currentPlan) {
      this.toaster.warning('You have already purchased this plan')
    } else {
      // this.isActive = this.data?this.data:'ECOMMERCE'
      this.isActive = value.toUpperCase()
      let plan = { Name: this.isActive }
      localStorage.setItem('planName', JSON.stringify(plan))
      this.Router.navigate(['/pages/pricing-page'])
      this.dialogRef.close()
    }
  }
  changeText(e) {
    this.planImage = e
  }
}
