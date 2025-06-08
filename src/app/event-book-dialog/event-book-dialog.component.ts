import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import {Router} from '@angular/router'
import { SharedService } from '../service/shared.service'

@Component({
  selector: 'app-event-book-dialog',
  templateUrl: './event-book-dialog.component.html',
  styleUrls: ['./event-book-dialog.component.css'], 
  providers: [NgxSpinnerService],
})
export class EventBookDialogComponent implements OnInit {
  userId: any
  userData: string
  returnRoute: string

  constructor(
    public dialog: MatDialogRef<EventBookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private SharedService :SharedService,
    private router :Router
    
  ) { }

  ngOnInit() {

    let userData=JSON.parse(localStorage.getItem("truckStorage"));
   
    if(userData && userData.userInfo){
      this.userId=userData.userInfo._id
    }
    this.returnRoute = this.router.url;
  }
  onNoClick(): void {
    this.dialog.close()
   
  }
  login(){
    
    this.dialog.close();
    this.router.navigate(['/login'],{ queryParams: { returnUrl: this.returnRoute }});

  }
  
  
  userRegister(){
    this.dialog.close();
    this.router.navigate(['/signup/user-signup']);
  }
}
