import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { MatDialog } from '@angular/material'

import moment from 'moment'

import { BrandDeletConfirmationComponent } from '../manage-product/brand/brand-delet-confirmation/brand-delet-confirmation.component'
@Component({
  selector: 'app-cancel-ecommerce-plan',
  templateUrl: './cancel-ecommerce-plan.component.html',
  styleUrls: ['./cancel-ecommerce-plan.component.css'],
})
export class CancelEcommercePlanComponent implements OnInit {
  planData: any[]
  cancelPlanData: any[] = []
  userInfo: any
  message: any = ''
  isFlag: Boolean = false
  date1: any
  date2: any
  validity: any = ''
  refundedAmount: any
  constructor(
    private service: GeneralServiceService,
    private dialogRef: MatDialogRef<CancelEcommercePlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('truckStorage'))
    this.planData = this.data.group
  }

  checkPlan(e, val) {
    if (e.checked) this.cancelPlanData.push(val)
    else this.cancelPlanData = this.cancelPlanData.filter((res) => res.data._id != val.data._id)
  }

  cancelPlan() {
    this.spinner.show()
    let finalPrice = 0
    let currentDate = new Date()
    this.cancelPlanData.forEach((item) => {
      finalPrice += item.data.finalPrice
      this.validity = item.data.validity
    })
    let planPurchasedDate = new Date('2022-08-10')
    this.date1 = new Date(moment.utc(currentDate).format('YYYY-MM-DD'))
    this.date2 = new Date(moment.utc(planPurchasedDate).format('YYYY-MM-DD'))
    let diffTime = this.date1 - this.date2
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays <= 7) this.refundedAmount = finalPrice
    else {
      let totalDays = this.validity == 'MONTHLY' ? 30 : 365
      this.refundedAmount = ((finalPrice / totalDays) * diffDays).toFixed(2)
    }
    this.dialog
      .open(BrandDeletConfirmationComponent, { data: 'The refund amount of $' + this.refundedAmount + ' will be credited to your account within 15 working days. Would you like to proceed?' })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.service.cancelSubsPlan({ userId: this.userInfo.userInfo._id, planData: this.cancelPlanData }).subscribe((res) => {
            this.spinner.hide()
            if (res['code'] == 200) {
              this.toastr.success(res['message'])
              setTimeout(() => {
                this.Close()
                this.service.logout()
              }, 100)
            } else {
              this.message = res['message']
              this.isFlag = true
            }
          })
        }
      })
  }
  Close() {
    this.dialogRef.close()
  }
}
