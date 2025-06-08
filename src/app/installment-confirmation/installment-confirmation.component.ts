import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { AddCardComponent } from '../addCard/addCard.component'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'

@Component({
  selector: 'app-installment-confirmation',
  templateUrl: './installment-confirmation.component.html',
  styleUrls: ['./installment-confirmation.component.css'],
})
export class InstallmentConfirmationComponent implements OnInit {
  userObj: any
  userId: any
  isDisabled: any = false
  constructor(
    public dialogRef: MatDialogRef<InstallmentConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private genralServices: GeneralServiceService
  ) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
  }
  onNoClick(): void {
    this.dialogRef.close()
  }

  payment() {
    this.isDisabled = true
    this.spinner.show()
    this.genralServices.installmentpayment({ plan: this.data.items }).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.toastr.success(res['message'])
          this.dialogRef.close(res['code'])
          this.spinner.hide()
        } else {
          console.log(res['message'],"0000000000000000  ")
          this.toastr.error(res['message'])

          // ! for Add card if card not avail  
          const dialogConfig = new MatDialogConfig()

          dialogConfig.disableClose = true
          dialogConfig.autoFocus = true
          ;(dialogConfig.width = '450px'),
            (dialogConfig.data = {
              id: 1,
              title: 'Angular For Beginners',
            })
       
          const dialogRefs = this.dialog.open(AddCardComponent, dialogConfig)
          dialogRefs.afterClosed().subscribe((result) => {
            if (result == 200) {
              console.log(result,"111111111111111111111111")
            }
          })

          this.dialogRef.close(res['code'])
          this.spinner.hide()
        }
      },
      () => {
        this.toastr.error('Something went wrong')
        this.spinner.hide()
      }
    )
  }
}
