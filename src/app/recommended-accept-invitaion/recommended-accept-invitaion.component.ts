import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'

import { GeneralServiceService } from '../core/general-service.service'



@Component({
  selector: 'app-recommended-accept-invitaion',
  templateUrl: './recommended-accept-invitaion.component.html',
  styleUrls: ['./recommended-accept-invitaion.component.css'],
  providers: [NgxSpinnerService],
})
export class RecommendedAcceptInvitaionComponent implements OnInit {
  token: any
  message: any
  constructor(
    private router: Router,
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((param) => {
      this.token = param.token
    })
    this.tokenCheck()
  }

  tokenCheck(){
    let data={
      "token": this.token
    }
    this._generalService.checkToken(data).subscribe((res)=>{
      if(res['code']==200){
        let data={"userResetToken":this.token }
        this._generalService.recommendedAcceptInvitationByToken(data).subscribe((res)=>{
          if(res['code']==200){
            this.router.navigate(['/login'])
            //this.message = res['message']
          }else {
            this.message = res['message']
          }
        })

      }else{
        this.toastr.warning(res['message'])
        this.router.navigate(['/expired-invitation'])
      }
    })

  }

}
