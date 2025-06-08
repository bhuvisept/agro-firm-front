import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms'
import { genralConfig } from '../constant/genral-config.constant'
import { CustomValidators } from 'ng2-validation'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from '../core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { Router } from '@angular/router'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  textType1: string = 'password'
  textType: string = 'password'
  textFlag: boolean = true
  eye: string = 'fa fa-eye'
  changePasswordForm: FormGroup
  userObj: any
  userId: any
  textTypeN = 'password'
  textFlagN: boolean = true
  eyeN = 'fa fa-eye'
  constructor(
    private fb: FormBuilder,
    private service: GeneralServiceService,
    private toatsr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => {
      this.ngZone.run(() => {
        this.changeDetector.detectChanges()
      })
    })
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    let pass = new FormControl('', [Validators.required, Validators.minLength(genralConfig.pattern.PASSWORDMINLENGTH), Validators.pattern(genralConfig.pattern.PASSWORD)])
    let confirmPass = new FormControl('', [Validators.required, CustomValidators.equalTo(pass)])
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: pass,
      confirmPassword: confirmPass,
    })
  }
  showTypeO(flag) {
    if (flag) {
      this.textType1 = 'text'
      this.textFlag = false
      this.eye = 'fa fa-eye-slash'
    } else {
      this.textType1 = 'password'
      this.textFlag = true
      this.eye = 'fa fa-eye'
    }
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
    if (this.changePasswordForm.valid) {
      this.changePasswordForm.value.id = this.userId
      this.spinner.show()
      this.service.chnagePassword(this.changePasswordForm.value).subscribe(
        (res) => {
          if (res['code'] == 200) {
            this.toatsr.success(res['message'])
            this.router.navigate(['/layout/myaccount/dashboard'])
          } else this.toatsr.warning(res['message'])
          this.spinner.hide()
        },
        () => this.spinner.hide()
      )
    }
  }
}
