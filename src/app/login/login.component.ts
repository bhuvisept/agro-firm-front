import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from '../constant/genral-config.constant'
import { GeneralServiceService } from '../core/general-service.service'
import { SharedService } from '../service/shared.service'
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
    let gauriStorage = JSON.parse(localStorage.getItem('gauriStorage'))
    if (gauriStorage && gauriStorage.userInfo && gauriStorage.userInfo.roleTitle == 'COMPANY') {
      this.userId = gauriStorage.userInfo.userId
      this.router.navigate(['/layout/myaccount/dashboard'])
    } else if (gauriStorage && gauriStorage.userInfo && gauriStorage.userInfo.roleTitle == 'ENDUSER') {
      this.userId = gauriStorage.userInfo.userId
      this.router.navigate(['/layout/user/dashboard'])
    } else if (gauriStorage && gauriStorage.userInfo && gauriStorage.userInfo.roleTitle == 'DRIVER') {
      this.userId = gauriStorage.userInfo.userId
      this.router.navigate(['/layout/driver/dashboard'])
    } else if (gauriStorage && gauriStorage.userInfo && gauriStorage.userInfo.roleTitle == 'SELLER') {
      this.userId = gauriStorage.userInfo.userId
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
  submitData(event){

  }

}
