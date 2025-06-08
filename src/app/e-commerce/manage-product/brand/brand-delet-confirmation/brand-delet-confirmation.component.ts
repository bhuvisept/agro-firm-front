import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
@Component({
  selector: 'app-brand-delet-confirmation',
  templateUrl: './brand-delet-confirmation.component.html',
  styleUrls: ['./brand-delet-confirmation.component.css'],
})
export class BrandDeletConfirmationComponent implements OnInit {
  userObj:any
  constructor(public dialogRef: MatDialogRef<BrandDeletConfirmationComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit(
  ) {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
console.log(this.userObj)
  }
  onNoClick(): void {
    this.dialogRef.close()
  }
}
