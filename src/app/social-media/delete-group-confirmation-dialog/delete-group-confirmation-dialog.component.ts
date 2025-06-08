import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'app-delete-group-confirmation-dialog',
  templateUrl: './delete-group-confirmation-dialog.component.html',
  styleUrls: ['./delete-group-confirmation-dialog.component.css'],
})
export class DeleteGroupConfirmationDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DeleteGroupConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {}
  onNoClick(): void {
    this.dialogRef.close()
  }
}
