import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
@Component({
  selector: 'app-booknow-event-confirmation-dialog',
  templateUrl: './booknow-event-confirmation-dialog.component.html',
  styleUrls: ['./booknow-event-confirmation-dialog.component.css']
})
export class BooknowEventConfirmationDialogComponent implements OnInit {
constructor(public dialogRef: MatDialogRef<BooknowEventConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router,) {}
ngOnInit() {}
onNoClick(): void {
  this.dialogRef.close()
}
userRegister(){
  this.dialogRef.close();
  this.router.navigate(['/signup/user-signup']);
}
}
