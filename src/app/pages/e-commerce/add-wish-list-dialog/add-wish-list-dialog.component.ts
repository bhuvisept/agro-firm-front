import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Router} from '@angular/router'
@Component({
  selector: 'app-add-wish-list-dialog',
  templateUrl: './add-wish-list-dialog.component.html',
  styleUrls: ['./add-wish-list-dialog.component.css']
})
export class AddWishListDialogComponent implements OnInit {
  userObj: any;
  roleName: any;
  userId: any='';
  constructor(
    public dialogRef: MatDialogRef<AddWishListDialogComponent>,
    private router:Router
  ) { }
  ngOnInit() {
    let userData= JSON.parse(localStorage.getItem('truckStorage'))
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
   if(userData && userData.userInfo){
    this.userId = userData.userInfo._id;
   }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  login(){
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }
  userRegister(){
    this.dialogRef.close();
    this.router.navigate(['/signup/user-signup']);
  }
}
