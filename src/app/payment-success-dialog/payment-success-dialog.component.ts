import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'app-payment-success-dialog',
  templateUrl: './payment-success-dialog.component.html',
  styleUrls: ['./payment-success-dialog.component.css']
})
export class PaymentSuccessDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<PaymentSuccessDialogComponent>,) { }

  myArr= [
    {value : 'Invoice Number' ,key : '14326650'},
    {value : 'Transaction ID' ,key : '0133928891'},
    {value : 'Date' , key : '22-10-2022'},
    {value : 'Payment Method' ,key:'Online'},
    {value : 'Billing Details' ,key : 'NO way'},
  ]

  ngOnInit() {

    setTimeout(() => {
      
        this.dialogRef.close({close:true})

    }, 5000);

  }

  close(){
    this.dialogRef.close({close:true})
  }

}
