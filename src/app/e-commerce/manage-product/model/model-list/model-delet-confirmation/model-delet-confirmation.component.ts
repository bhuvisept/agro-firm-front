

import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'app-model-delet-confirmation',
  templateUrl: './model-delet-confirmation.component.html',
  styleUrls: ['./model-delet-confirmation.component.css']
})

export class ModelDeletConfirmationComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ModelDeletConfirmationComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit() {}
  onNoClick(): void {
    this.dialogRef.close()
  }
}
