
import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
@Component({
  selector: 'app-addCard',
  templateUrl: './addCard.component.html',
  styleUrls: ['./addCard.component.css']
})
export class AddCardComponent implements OnInit {

  userInfo: any
  ROLENAME: string
  patientId: string
  clinicId: string

  cardNumber: string
  cardNumberDisplay: string
  cardHolderName: string
  cvv: string
  expiryYear: string
  expiryMonth: string
  userObj: any
  userId: any
  constructor(public dialogRef: MatDialogRef<AddCardComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  private spinner: NgxSpinnerService,
  private toastr: ToastrService,
  private genralServices: GeneralServiceService,
  
  ) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
  }

  addCard() {
    
    if (!this.cardHolderName) return this.toastr.warning('Please enter card holder name')
    if (!this.cardNumber) return this.toastr.warning('Please enter card number')
    if (!this.expiryMonth) return this.toastr.warning('Please enter expiry month')
    if (!this.expiryYear) return this.toastr.warning('Please enter expiry year')
    if (!this.cvv) return this.toastr.warning('Please enter cvv')

   
    this.spinner.show()

    let data = {
      number: this.cardNumber,
      exp_year: parseInt(this.expiryYear),
      exp_month: parseInt(this.expiryMonth),
      cardHolderName: this.cardHolderName,
      cvc: this.cvv,
      userId:this.userId
    }

    this.genralServices.addCard(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.toastr.success(res['message'])
          this.dialogRef.close(res['code'])
        } else this.toastr.warning(res['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        // this.toastr.error(messages.apiError)
      }
    )
  }

  close() {
    this.dialogRef.close();
}

}
