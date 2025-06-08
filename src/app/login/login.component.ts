import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from '../constant/genral-config.constant'
import { GeneralServiceService } from '../core/general-service.service'
import { SharedService } from '../service/shared.service'
import { ProfileRedirectComponent } from '../profile-redirect/profile-redirect.component'
import { MatDialog } from '@angular/material'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast'

// for browser name
import { UAParser } from 'ua-parser-js'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [NgxSpinnerService],
})
export class LoginComponent implements OnInit {
  parser = new UAParser()
  result = this.parser.getResult()
  ipAddress = ''

  loginForm: FormGroup
  isCompanySelected: boolean
  successMsg: String = ''
  isSuccess: boolean = false
  textType = 'password'
  textFlag: boolean = true
  eye = 'fa fa-eye'
  userId: any
  returnUrl: any
  previousUrl: any
  resetkey: any
  validRecaptcha: boolean = false
  getBack
  roleName: any
  source: any
  lat: number
  lng: number
  module: any

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private http: HttpClient,
    private ip: SharedService,
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
    let truckStorage = JSON.parse(localStorage.getItem('truckStorage'))
    if (truckStorage && truckStorage.userInfo && truckStorage.userInfo.roleTitle == 'COMPANY') {
      this.userId = truckStorage.userInfo.userId
      this.router.navigate(['/layout/myaccount/dashboard'])
    } else if (truckStorage && truckStorage.userInfo && truckStorage.userInfo.roleTitle == 'ENDUSER') {
      this.userId = truckStorage.userInfo.userId
      this.router.navigate(['/layout/user/dashboard'])
    } else if (truckStorage && truckStorage.userInfo && truckStorage.userInfo.roleTitle == 'DRIVER') {
      this.userId = truckStorage.userInfo.userId
      this.router.navigate(['/layout/driver/dashboard'])
    } else if (truckStorage && truckStorage.userInfo && truckStorage.userInfo.roleTitle == 'SELLER') {
      this.userId = truckStorage.userInfo.userId
      this.router.navigate(['/layout/e-commerce'])
    } else {
      this.router.navigate(['/login'])
    }
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.pattern(genralConfig.pattern.EMAIL)]],
      password: ['', Validators.required],
      recaptchaReactive: ['', [Validators.required]],
    })

    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip
    })

    this.source = this.result.browser.name + ' and version ' + this.result.browser.version

    this.sharedService.getPath().subscribe((res) => {
      this.getBack = res
    })
    this.getLocation()
    this.returnUrl = this.route.snapshot.queryParams['returnUrl']
    if (this.returnUrl) {
      this.module = this.route.snapshot.queryParams['returnUrl'].split('/')[2]
    }
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position) {
            this.lat = position.coords.latitude //ger
            this.lng = position.coords.longitude
          }
        },
        // (error) => console.log(error)
      )
    } else {
      alert('Geolocation is not supported by this browser.')
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

  submitData(data: any) {
    
    if (this.loginForm.valid) {
      this.loginForm.value.source = this.source
      this.loginForm.value.lan = this.lng
      this.loginForm.value.lat = this.lat

      this.loginForm.value.clientIp = this.ipAddress
      this.loginForm.value.loginDate = new Date()
    this.spinner.show()
      this._generalService.userLogin(this.loginForm.value).subscribe(
        (result) => {
          this.spinner.hide()

          if (result['code'] == 200) {
            this._generalService.addUser(result['data'].userInfo._id)
            localStorage.removeItem('truckStorage')
            localStorage.removeItem('ipAddress')
            localStorage.removeItem('source')
            localStorage.removeItem('truck_userId')
            localStorage.removeItem('truck_userName')
            localStorage.removeItem('progressBar')
            if (result['data'].companyName) {
              // console.log(result,"222222222222")
              result['data'].userInfo['companyName'] = result['data'].companyName
            }

            if (result['data'].multipleRole.length > 1) {
              // console.log(result,"333333333333")
              this.spinner.hide()
              let loginData = result['data']
              this.dialog.open(ProfileRedirectComponent, {
                width: '450px',
                data: { Data: loginData, returnTo: this.returnUrl, Ip: this.ipAddress, Source: this.source },
                panelClass: 'open-login-dialog',
              })
              return
            }
            // this.spinner.hide()
            this.successMsg = 'Reset password link has been sent to your email address'
            this.isSuccess = true
            // this.spinner.hide()
            let user = result.data.userInfo.roleId.roleTitle
            let userAccess = result.data.userInfo.accessLevel
            let roleTitle = result.data.userInfo.accessLevel
            let UserData = {
              token: result['data'].token,
              firstName: result['data'].userInfo.personName,
              image: result['data'].userInfo.image,
              userId: result['data'].userInfo._id,
              email: result['data'].userInfo.email,
            }

            // return
            // result['data'].userInfo.tripplan = this.TRIPPLAN
            console.log(result['data'])
            
            localStorage.setItem('truckStorage', JSON.stringify(result['data']))
            localStorage.setItem('ipAddress', this.ipAddress)
            localStorage.setItem('source', this.source)

            localStorage.setItem('truck_userId', result['data'].userInfo._id)
            localStorage.setItem('truck_userName', result['data'].userInfo.personName)
            localStorage.setItem('progressBar', result['data'].userInfo.progressBar)
            this.roleName = result['data'].userInfo.roleId.roleTitle

            this.toastr.success('', result['message'])
           
            if (result['data'].userInfo.paymentToken != null && result['data'].userInfo.paymentToken != '' && result['data'].userInfo.profileComplete) {
              this.spinner.hide()
              return this.router.navigate(['/payment'])
            }
            if (this.roleName === 'SELLER') {
              this.spinner.hide()

              if (result['data'].userInfo.profileComplete) {
                this.router.navigate(['/layout/e-commerce/dashboard'])
              } else {
                this.router.navigate(['/layout/e-commerce'])
              }
            } else if (this.returnUrl != undefined && (userAccess == 'ENDUSER' || userAccess == 'DRIVER' || (userAccess == 'COMPANY' && this.module == 'e-commerce'))) {
              this.spinner.hide()
              this.router.navigateByUrl(this.returnUrl)

              // window.history.back();
            } else if (result['data'].userInfo.profileComplete) {
              this.spinner.hide()
              this.router.navigate(['/layout/myaccount/dashboard'])
            } else {
              this.spinner.hide()
              this.router.navigate(['/set-profile'])
            }

            if (user == 'ENDUSER' && roleTitle == 'SALESPERSON') {
              this.spinner.hide()
              if (result['data'].userInfo.profileComplete) {
                this.router.navigate(['/layout/e-commerce/dashboard'])
              } else {
                this.router.navigate(['/set-profile'])
              }
            }

            if (user == 'ENDUSER' && roleTitle == 'DISPATCHER') {
              this.spinner.hide()
              if (result['data'].userInfo.profileComplete) {
                this.router.navigate(['/layout/myaccount/trip-planner'])
              } else {
                this.router.navigate(['/set-profile'])
              }
            }

            // if( user =='ENDUSER' && roleTitle == 'HR'){
            //   if(result['data'].userInfo.profileComplete) {
            //     this.router.navigate(['/layout/myaccount/team-manager'])
            //   }else{
            //     this.router.navigate(['/set-profile'])
            //   }
            // }
            this.sharedService.setUserData(UserData.firstName)
            this.sharedService.setHeader(UserData)
          } else if (result['code'] == 555) {
            this.spinner.hide()
            this.resetkey = result['data'].resetkey
            this.router.navigate(['/verify-otp/' + this.resetkey])
          } else {
            this.spinner.hide()
            this.toastr.warning('', result['message'])
          }
        },
        (error) => {
          this.spinner.hide()
          this.toastr.error('', 'Something went wrong')
        }
      )
    } else {
      if (this.loginForm.value.recaptchaReactive == '') {
      this.spinner.hide()
        this.validRecaptcha = true
      } else {
      this.spinner.hide()
        this.validRecaptcha = false
      }
      this._generalService.markFormGroupTouched(this.loginForm)
      this.spinner.hide()
    }
  }
}
