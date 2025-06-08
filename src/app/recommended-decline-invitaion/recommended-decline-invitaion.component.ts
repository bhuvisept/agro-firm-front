import { Component, OnInit } from '@angular/core';
import {GeneralServiceService} from '../core/general-service.service';
import {Router,ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-recommended-decline-invitaion',
  templateUrl: './recommended-decline-invitaion.component.html',
  styleUrls: ['./recommended-decline-invitaion.component.css']
})
export class RecommendedDeclineInvitaionComponent implements OnInit {
  token: any;
  message : any;
  constructor(
    private sercvice :GeneralServiceService,
    private router : Router,
    private route : ActivatedRoute
  ) { }

  ngOnInit() {("dsfcs")

    this.route.params.subscribe((res)=>{
      this.token=res.token
    })
    this.recommendedDeclineInvitationByToken();
  }
  recommendedDeclineInvitationByToken(){
    let data={"userResetToken":this.token }
    this.sercvice.recommendedDeclineInvitationByToken(data).subscribe((res)=>{
      if(res['code']==200){
        this.message = res['message']
      }else {
        this.message = res['message']
      }
    })
  }

}
