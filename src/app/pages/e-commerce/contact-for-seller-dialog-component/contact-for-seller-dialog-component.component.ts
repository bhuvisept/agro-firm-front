import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-contact-for-seller-dialog-component',
  templateUrl: './contact-for-seller-dialog-component.component.html',
  styleUrls: ['./contact-for-seller-dialog-component.component.css']
})
export class ContactForSellerDialogComponentComponent implements OnInit {
  userObj: any;
  roleName: any;
  userId: any='';
  returnRoute: string;

  constructor(
    public dialogRef: MatDialogRef<ContactForSellerDialogComponentComponent>,
    private router:Router,
    private SharedService : SharedService

  ) { }

  ngOnInit() {
    let userData= JSON.parse(localStorage.getItem('truckStorage'))
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
  
   if(userData && userData.userInfo){
    this.userId = userData.userInfo._id;
   }
   this.returnRoute = this.router.url;


  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  login(){
    this.dialogRef.close();
    this.router.navigate(['/login'],{ queryParams: { returnUrl: this.returnRoute }});

  }
  
  userRegister(){
    this.dialogRef.close();
    this.router.navigate(['/signup/user-signup']);
  }
}
