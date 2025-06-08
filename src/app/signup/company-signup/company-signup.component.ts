import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { Router } from '@angular/router'
import { CustomValidators } from 'ng2-validation'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from '../../constant/genral-config.constant'
import { GeneralServiceService } from '../../core/general-service.service'
@Component({
  selector: 'app-company-signup',
  templateUrl: './company-signup.component.html',
  styleUrls: ['./company-signup.component.css'],
  providers: [NgxSpinnerService],
})
export class CompanySignupComponent implements OnInit {
  signUpCompanyForm: FormGroup
  textType = 'password'
  textFlag: boolean = true
  eye = 'fa fa-eye'
  companyFrmlength = genralConfig.storage.COMPANYFROMFIELDS;
  textTypeN = 'password'
  textFlagN: boolean = true
  eyeN = 'fa fa-eye'
  terms: any
  resetkey: any
  validRecaptcha:boolean = false;
  constructor(private formbuilder: FormBuilder, private _generalService: GeneralServiceService, private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router) {}

  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    if (userData && userData.userInfo && userData.userInfo.email) {
      this.router.navigate(['/layout/company/dashboard'])
    } else {
      this.router.navigate(['/signup/company-signup'])
    }
    let pass = new FormControl('', [
      Validators.required,
      Validators.minLength(genralConfig.pattern.PASSWORDMINLENGTH),
      Validators.pattern(genralConfig.pattern.PASSWORD),
    ])
    let confirmPass = new FormControl('', [Validators.required, CustomValidators.equalTo(pass)])
    this.signUpCompanyForm = this.formbuilder.group({
      companyName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.NAMENumber), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      firstName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.NAMENumber), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      lastName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.NAMENumber), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      mobileNumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern(genralConfig.pattern.MOB_NO)]],
      email: ['', [Validators.required, Validators.pattern(genralConfig.pattern.EMAIL)]],
      password: pass,
      confirmPassword: confirmPass,
      acceptTerms: [''],
      roleTitle: genralConfig.rolename.COMPANY,
      recaptchaReactive:['',[Validators.required]],
    })
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
  setAll(event) {
    this.terms = event.checked
  }
  onSubmitCompanyForm() {

    if (this.signUpCompanyForm.valid) {
      this.spinner.show()
      if (this.signUpCompanyForm.valid && this.terms == true) {
        let counter = ((this.companyFrmlength-11)*100)/this.companyFrmlength;
        this.signUpCompanyForm.value.progressBar=counter
        this._generalService.userSignUp(this.signUpCompanyForm.value).subscribe(
          (result) => {
            if (result['code'] == 200) {
              this.spinner.hide()
              this.toastr.success('', result['message'])
              this.resetkey = result['data'].resetkey
              this.router.navigate(['/verify-otp/' + this.resetkey])
            } else {
              this.toastr.warning('', result['message'])
              this.spinner.hide()
            }
          },
          (error) => {
            this.spinner.hide()
            this.toastr.error('', 'Something went wrong')
          }
        )
      } else {
        this.spinner.hide()
        this.toastr.error('', 'Please accept Terms & Conditions')
      }
    } else {
      if(this.signUpCompanyForm.value.recaptchaReactive==''){
        this.validRecaptcha = true;
      }else{
        this.validRecaptcha = false;

      }
      this.spinner.hide()
      this._generalService.markFormGroupTouched(this.signUpCompanyForm)
    }
  }

}
