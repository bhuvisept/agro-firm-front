import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { FormControl } from '@angular/forms'
import { FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { ApiUrlConstant } from '../constant/api-url.constant'
import { SharedService } from '../service/shared.service'
import { BehaviorSubject, from } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class GeneralServiceService {
  isCompanyForm: boolean
  isUserForm: boolean
  userInfo: any

  constructor(private http: HttpClient, private router: Router, private sharedService: SharedService) {
    this.userInfo = JSON.parse(localStorage.getItem('firmStorage'))

  }


  logout() {
    localStorage.removeItem('userToken')
    localStorage.removeItem('firmStorage')
    localStorage.removeItem('firm_userId')
    this.router.navigate(['/login'])
    this.sharedService.setHeader({})
  }

  //   ;(<any>Object).values(formGroup.controls).forEach((control) => {
  //     control.markAsTouched()
  //     if (control.controls) {
  //       this.markFormGroupTouched(control)
  //     }
  //   })
  // }

  //Auth routes
  userLogin(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.LOGIN, data)
  }

  userLogOut(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.LOGOUT, data)
  }

  //Auth routes
  userSignUp(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.SignUp, data)
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.FORGOTPASSWORD, data)
  }
  verifyResetOtp(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.VERIFYRESETOTP, data)
  }
  resendOTP(data: any) {
    return this.http.post(ApiUrlConstant.RESENDOTP, data)
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.RESETPASSWORD, data)
  }

  checkToken(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CHECKTOKEN, data)
  }



  eventList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETEVENTlIST, data)
  }
  homePageEvents(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETHOMEEVENTlIST, data)
  }

  eventView(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.VIEWEVENT, data)
  }
  verifyOtp(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.VERIFYOTP, data)
  }

  //country list
  getCountryList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.COUNTRYLIST, data)
  }

  // state list
  getStateList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.STATELIST, data)
  }

  getUserDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.USERDETAILS, data)
  }

  sliders(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETSLIDERlIST, data)
  }
  getCityByZipcode(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETCITYBYZIPCODE, data)
  }
  contactUs(data: any) {
    return this.http.post(ApiUrlConstant.CONTACTUS, data)
  }

}
