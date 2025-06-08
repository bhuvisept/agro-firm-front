import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { MatDialog } from '@angular/material'
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component'
import moment from 'moment'
// import { BrandDeletConfirmationComponent } from 'src/app/e-commerce/manage-product/brand/brand-delet-confirmation/brand-delet-confirmation.component';
@Component({
  selector: 'app-cancel-plan-dialog',
  templateUrl: './cancel-plan-dialog.component.html',
  styleUrls: ['./cancel-plan-dialog.component.css'],
})
export class CancelPlanDialogComponent implements OnInit {
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
    private dialogRef: MatDialogRef<CancelPlanDialogComponent>,
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
    if (e.checked) {
      this.cancelPlanData.push(val)
    } else {
      this.cancelPlanData = this.cancelPlanData.filter((res) => res.data._id != val.data._id)
    }
  }

  cancelPlan() {
    this.spinner.show()
    let finalPrice = 0
    let currentDate = new Date()
    this.cancelPlanData.forEach((item) => {
      finalPrice += item.data.finalPrice
      this.validity = item.data.validity
    })
    let planPurchasedDate = new Date(this.cancelPlanData[0].startDate)
    this.date1 = new Date(moment.utc(currentDate).format('YYYY-MM-DD'))
    this.date2 = new Date(moment.utc(planPurchasedDate).format('YYYY-MM-DD'))

    let diffTime = this.date1 - this.date2
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 7) {
      this.refundedAmount = finalPrice
    } 
    // else {
    //   let totalDays = this.validity == 'MONTHLY' ? 30 : 365
    //   this.refundedAmount = ((finalPrice / totalDays) * diffDays).toFixed(2)
    // }
   let  dialog
   if(this.refundedAmount != null){
     dialog = this.dialog.open(ConfirmationDialogComponent, {
      data: 'The refund amount of $' + this.refundedAmount + ' will be credited to your account within 15 working days. Would you like to proceed?',
    })
   }else{
     dialog = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Are you sure, you want to cancel this plan ?',
    })
   }
    
    dialog.afterClosed().subscribe((response) => {
      if (response) {
        this.service.cancelSubsPlan({ userId: this.userInfo.userInfo._id, planData: this.cancelPlanData }).subscribe((res) => {
 
          if (res['code'] == 200) {
            this.toastr.success(res['message'])
              this.Close()
              this.service.logout()
              this.spinner.hide()
          } else {
            this.message = res['message']
            this.isFlag = true
            this.spinner.hide()
          }
        })
      }else{
        this.Close()
      }
    })
  }
  Close() {
    this.dialogRef.close()
    this.spinner.hide()
  }
}
