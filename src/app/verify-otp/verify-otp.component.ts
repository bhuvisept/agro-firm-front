import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'

import { GeneralServiceService } from '../core/general-service.service'

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css'],

  providers: [NgxSpinnerService],
})
export class VerifyOtpComponent implements OnInit {
  loginForm: FormGroup
  timeLeft: number = 29;
  userId: any
  verifyNo: any
  tokenExpired:boolean = false;
  interval: number
  hideTimer: boolean
  constructor(private formbuilder: FormBuilder,
    private router: Router,
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.verifyNo = params.token
    })
    this.loginForm = this.formbuilder.group({
      otp: ['', [Validators.required]],
     
    })
    this.tokenCheck()
    this.startTimer()
  }
  tokenCheck(){
    let data={"token": this.verifyNo}
    this._generalService.checkToken(data).subscribe((res)=>{    
      if(res['code']==401){
        this.toastr.warning('', 'token expired')
        this.tokenExpired = true;
      }else{

      }
    })

  }
  submitData(){
    this.spinner.show()
    if (this.loginForm.valid) {
      this.loginForm.value.resetkey = this.verifyNo;
      this._generalService.verifyOtp(this.loginForm.value).subscribe(
        (res) => {
          this.spinner.hide()
          if (res['code'] == 200) {
            this.spinner.hide()
            this.toastr.success(res['message'])
            this.router.navigateByUrl('/login')
          } else {
            window.scrollTo(0, 0)
            this.toastr.error(res['message'])
          }
        },
        (err) => {
          this.spinner.hide()
        }
      )
    }else{
      this._generalService.markFormGroupTouched(this.loginForm)
      this.spinner.hide()
    }  
    
  }

  startTimer() {
    this.timeLeft=29
    this.interval = window.setInterval(() => {
      if(this.timeLeft > 0) { 
        this.timeLeft -=1;
      }else if(this.timeLeft<=0) {
        this.hideTimer=true
        window.clearInterval(this.interval);
      }

    },1000)

  }
}
