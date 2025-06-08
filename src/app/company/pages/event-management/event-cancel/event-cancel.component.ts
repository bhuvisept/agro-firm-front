import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
@Component({
  selector: 'app-event-cancel',
  templateUrl: './event-cancel.component.html',
  styleUrls: ['./event-cancel.component.css']
})
export class EventCancelComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EventCancelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onYesClick(): void {
    this.dialogRef.close({ apiHit: true });
  }
}
