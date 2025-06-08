import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from '../constant/genral-config.constant'
import { GeneralServiceService } from '../core/general-service.service'
// import { SharedService } from '../service/shared.service';
import { CustomValidators } from 'ng2-validation'

@Component({
  selector: 'app-invitation-reset-password',
  templateUrl: './invitation-reset-password.component.html',
  styleUrls: ['./invitation-reset-password.component.css'],
  providers: [NgxSpinnerService],
})
export class InvitationResetPasswordComponent implements OnInit {
  resetForm: FormGroup
  token: any

  textType = 'password'
  textFlag: boolean = true
  eye = 'fa fa-eye'

  textTypeN = 'password'
  textFlagN: boolean = true
  eyeN = 'fa fa-eye'

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    let password = new FormControl('', [
      Validators.required,
      Validators.maxLength(genralConfig.pattern.PASSWORDMAXLENGTH),
      Validators.minLength(genralConfig.pattern.PASSWORDMINLENGTH),
      Validators.pattern(genralConfig.pattern.PASSWORD),
    ])
    let confirmPassword = new FormControl('', [Validators.required, CustomValidators.equalTo(password)])
    this.resetForm = this.formBuilder.group({
      newPassword: password,
      confirmPassword: confirmPassword,
    })

    this.route.params.subscribe((param) => {
      this.token = param.token
      this.resetForm.value.token = this.token
    })
    window.scroll(0, 0)
    this.tokenCheck()
  }

  showType(flag) {
    if (flag) {
      this.textType = 'text'
      this.textFlag = false
      this.eye = 'fa fa-eye-slash'
    } else {
      this.textType = 'password'
      this.textFlag = true
      this.eye = 'fa fa-eye'
    }
  }
  showTypeN(flag) {
    if (flag) {
      this.textTypeN = 'text'
      this.textFlagN = false
      this.eyeN = 'fa fa-eye-slash'
    } else {
      this.textTypeN = 'password'
      this.textFlagN = true
      this.eyeN = 'fa fa-eye'
    }
  }

  submitData() {
    if (this.resetForm.valid) {
      this.resetForm.value.token = this.token
      this.spinner.show()
      this._generalService.groupInviteResetPassword(this.resetForm.value).subscribe(
        (result) => {
       
          if (result['code'] == 200) {
            this.spinner.hide()
            this.toastr.success('Password created successfully')
            this.router.navigate(['/login'])
          } else {
            this.toastr.warning('', result['message'])
            this.spinner.hide()
            this.router.navigate(['/expired-invitation'])
          }
        },
        (error) => {
          this.spinner.hide()
          this.toastr.error('', 'Something went wrong')
        }
      )
    } else {
      this._generalService.markFormGroupTouched(this.resetForm)
    }
  }

  tokenCheck(){
    let data={
      "token": this.token
    }
    
    this._generalService.checkToken(data).subscribe((res)=>{
   
      if(res['code']==200){
       
        // this.toastr.success('You reset your password')
      }else if(res['code']==401){
        this.router.navigate(['/expired-invitation'])
      
      }
    })

  }


}
