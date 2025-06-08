import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { genralConfig } from '../constant/genral-config.constant';
import { GeneralServiceService } from '../core/general-service.service';
import moment from 'moment'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [NgxSpinnerService],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassForm: FormGroup;
  forgotOTPForm: FormGroup;
  successMsg: String = '';
  isSuccess: boolean = false;
  isOTPForm: boolean = false;
  message: any
  verifiedData: any;
  interval: number;
  timeLeft: number = 29;
  hideTimer: boolean;
  result: any

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    let currentDate = new Date();
    
    let userData = JSON.parse(localStorage.getItem("truckStorage"));
    if (userData && userData.userInfo && userData.userInfo.email) {
      this.router.navigate(["/layout/company/dashboard"]);
    } else {
      this.router.navigate(["/forgot-password"]);
    }

    this.forgotPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(genralConfig.pattern.EMAIL)]],
    });
    this.forgotOTPForm = this.formBuilder.group({
      otp: ['', [Validators.required]],
    })
    window.scroll(0, 0)

    // this.setTimmer()

  }
  verifyOtpData() {
    if (this.forgotOTPForm.valid) {
      this.spinner.show();
      this.forgotOTPForm.value.resetkey = this.verifiedData.resetkey
      this.forgotOTPForm.value.userId = this.verifiedData.userId
      this._generalService.verifyResetOtp(this.forgotOTPForm.value).subscribe(result => {
        this.spinner.hide();
        if (result['code'] == 200) {
          this.toastr.success('', result['message']);
          this.router.navigate(['/reset-password/' + this.verifiedData.resetkey])
         
        } else {
          this.isSuccess = false;
          this.isOTPForm = true;
         
          this.toastr.warning('', result['message']);
        }
      }, (error) => {
        this.spinner.hide()
        this.toastr.error('', 'Something went wrong');
      })

    } else {
      this._generalService.markFormGroupTouched(this.forgotOTPForm);
    }
  }
  submitData() {
    if (this.forgotPassForm.valid) {
      this.spinner.show();
      this._generalService.forgotPassword(this.forgotPassForm.value).subscribe(result => {
        this.spinner.hide();
        if (result['code'] == 200) {
          this.isSuccess = true;  
          this.isOTPForm = true;
          this.startTimer() 
          this.message = result['message']
          this.verifiedData = result['data']
        
          this.toastr.success('', result['message']);
        } else {
          this.isSuccess = false;
          this.toastr.warning('', result['message']);

        }
      }, (error) => {
        this.spinner.hide()
        this.toastr.error('', 'Something went wrong');
      })

    } else {
      this._generalService.markFormGroupTouched(this.forgotPassForm);
    }
  }
  submitOtpData() {

  }


resendOpt(){
  let data = {
    resetKey:this.verifiedData.resetkey,
    userId:this.verifiedData.userId
    }
    this.spinner.show()
    this._generalService.resendOTP(data).subscribe((res)=>{
      if(res['code']==503){
        this.verifiedData.resetkey = res['data'].resetkey
        this.spinner.hide()
        this.toastr.success(res['message'])
        this.startTimer()
      }else{
        this.toastr.warning(res['message'])
        this.spinner.hide()
      }
    })
    
}
startTimer() {

  this.timeLeft= 29
  this.interval = window.setInterval(() => {
    if(this.timeLeft > 0) { 
      this.timeLeft -=1;
    }else if(this.timeLeft<=0) {
      window.clearInterval(this.interval);
    }


  },1000)
}



}
