import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-upgrade-confirmation-dialog',
  templateUrl: './upgrade-confirmation-dialog.component.html',
  styleUrls: ['./upgrade-confirmation-dialog.component.css']
})
export class UpgradeConfirmationDialogComponent implements OnInit {
  userObj: any;
  accessLevel: any;
  roleTitle: any;

  constructor(public dialogRef: MatDialogRef<UpgradeConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string
  ) { }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'));
    if(this.userObj ){
      this.accessLevel = this.userObj.userInfo.accessLevel
      this.roleTitle = this.userObj.userInfo.roleId.roleTitle
     
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
