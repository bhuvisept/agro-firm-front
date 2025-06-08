import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Console } from 'console';
import { SharedService } from 'src/app/service/shared.service';
@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  showDialog: boolean=false;
  userData: any;
  accessLevel: any;
  showCompany: boolean=false;
  notAccess: boolean=false;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private router:Router,
    private SharedService : SharedService, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if(this.data && this.data == "ISENDUSER"){
      this.showDialog = true
    }else if(this.data && this.data == "SHOWCOMPANY") {
        this.showCompany = true
    }else if( this.data && this.data == "PLANFEATURE") {
      this.notAccess = true
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  login(){
    this.dialogRef.close();
    this.SharedService.setPath('GETBACK')
    this.router.navigate(['/login']);

  }
  
  userRegister(){
    this.dialogRef.close();
    if(this.data == 'ECOMMERCE'){
      this.router.navigate(['/signup/seller-signup']);
    }else{
      this.router.navigate(['/signup/company-signup']);
    }
  }

  companyRegister(){
    this.dialogRef.close();
    this.router.navigate(['/signup/company-signup']);
  }

  close(){
    this.dialogRef.close()
  }

}
