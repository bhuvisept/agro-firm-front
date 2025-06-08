import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GeneralServiceService } from 'src/app/core/general-service.service';
@Component({
  selector: 'app-savejob-dialog',
  templateUrl: './savejob-dialog.component.html',
  styleUrls: ['./savejob-dialog.component.css']
})
export class SavejobDialogComponent implements OnInit {
  jobId: any;
  userId: String = '';
  constructor(
    private http: HttpClient,
    private router: Router,
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    public dialogRef1: MatDialogRef<SavejobDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  ngOnInit() {
    this.jobId = this.data.jobId
    let userData = JSON.parse(localStorage.getItem("truckStorage"));
    if (userData && userData.userInfo) {
      this.userId = userData.userInfo._id;
    }
  }
  onNoClick(): void {
    this.dialogRef1.close();
  }
  login() {
    this.dialogRef1.close();
    this.router.navigate(['/login']);
  }
  userRegister() {
    this.dialogRef1.close();
    this.router.navigate(['/signup/user-signup']);
  }

}
