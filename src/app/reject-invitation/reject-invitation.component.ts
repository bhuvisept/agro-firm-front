import { Component, OnInit } from '@angular/core';
import {GeneralServiceService} from '../core/general-service.service';
import {Router,ActivatedRoute} from '@angular/router'
@Component({
  selector: 'app-reject-invitation',
  templateUrl: './reject-invitation.component.html',
  styleUrls: ['./reject-invitation.component.css']
})
export class RejectInvitationComponent implements OnInit {
  token: any;
  message : any;

  constructor(
    private sercvice :GeneralServiceService,
    private router : Router,
    private route : ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((res)=>{
      this.token=res.token
    })
    this.teamInvitationDeclinedByToken();
  }

  teamInvitationDeclinedByToken(){
    let data={"userResetToken":this.token }
    
    this.sercvice.teamInvitationDeclinedByToken(data).subscribe((res)=>{
      if(res['code']==200){
        this.message = res['message']
      }else {
        this.message = res['message']
      }
    })
  }
  
  declineInvitationByToken(){
    let data={"userResetToken":this.token }
    
    this.sercvice.declineInvitationByToken(data).subscribe((res)=>{
      if(res['code']==200){
        this.message = res['message']
      }else {
        this.message = res['message']
      }
    })
  }
}
