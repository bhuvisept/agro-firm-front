import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { Router } from '@angular/router'
import { CustomValidators } from 'ng2-validation'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from '../../constant/genral-config.constant'
import { GeneralServiceService } from '../../core/general-service.service'
@Component({
  selector: 'app-seller-signup',
  templateUrl: './seller-signup.component.html',
  styleUrls: ['./seller-signup.component.css'],
  providers: [NgxSpinnerService],
})
export class SellerSignupComponent implements OnInit {
  signUpUserForm: FormGroup
  textType = 'password'
  textFlag: boolean = true
  eye = 'fa fa-eye'
  textTypeN = 'password'
  textFlagN: boolean = true
  eyeN = 'fa fa-eye'
  RoleArray = ['ENDUSER']
  terms: any
  resetkey: any
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
  validRecaptcha:boolean = false;
  sellerFrmlength = genralConfig.storage.SELLERFROMFIELDS;
  constructor(private formbuilder: FormBuilder, private _generalService: GeneralServiceService, private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router) {}
  ngOnInit() {
    let pass = new FormControl('', [
      Validators.required,
      Validators.minLength(genralConfig.pattern.PASSWORDMINLENGTH),
      Validators.pattern(genralConfig.pattern.PASSWORD),
    ])
    let confirmPass = new FormControl('', [Validators.required, CustomValidators.equalTo(pass)])

    this.signUpUserForm = this.formbuilder.group({
      firstName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE), Validators.pattern(genralConfig.pattern.REPORTNAME)]],
      lastName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE), Validators.pattern(genralConfig.pattern.REPORTNAME)]],
      email: ['', [Validators.required, Validators.pattern(genralConfig.pattern.EMAIL)]],
      mobileNumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern(genralConfig.pattern.MOB_NO)]],
      password: pass,
      confirmPassword: confirmPass,
      acceptTerms: [''],
      roleTitle:genralConfig.rolename.SELLER,
      recaptchaReactive:['',[Validators.required]],
    })
  }
  setAll(event) {
    this.terms = event.checked
  }
  onSubmitUserForm() {
    if (this.signUpUserForm.valid) {
      if (this.signUpUserForm.valid && this.terms == true) {
        let counter = ((this.sellerFrmlength-11)*100)/this.sellerFrmlength;
        this.signUpUserForm.value.progressBar=counter
        this.spinner.show()
        this._generalService.userSignUp(this.signUpUserForm.value).subscribe(
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
        this.toastr.error('', 'Please accept Terms & Conditions')
      }
    } else {
      if(this.signUpUserForm.value.recaptchaReactive==''){
        this.validRecaptcha = true;
      }else{
        this.validRecaptcha = false;
      }
      this._generalService.markFormGroupTouched(this.signUpUserForm)
    }
  }

}
