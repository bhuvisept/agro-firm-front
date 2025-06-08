import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-query-form-confirmation-dialog',
  templateUrl: './query-form-confirmation-dialog.component.html',
  styleUrls: ['./query-form-confirmation-dialog.component.css']
})
export class QueryFormConfirmationDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<QueryFormConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string
  ) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
