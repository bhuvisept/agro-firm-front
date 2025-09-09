import { environment } from 'src/environments/environment'

export class ApiUrlConstant {
  static GROUPLIST(GROUPLIST: any, data: any): import('rxjs').Observable<any> {
    throw new Error('Method not implemented.')
  }
  private static appUrl = environment.url

  //Authentication API
  public static get LOGIN(): string {
    return this.appUrl + '/api/v1/user/login'
  }

  public static get LOGOUT(): string {
    return this.appUrl + '/api/v1/user/logout'
  }

  public static get SignUp(): string {
    return this.appUrl + '/api/v1/user/register'
  }

  public static get FORGOTPASSWORD(): string {
    return this.appUrl + '/api/v1/user/forgotPassword'
  }

  public static get VERIFYRESETOTP(): string {
    return this.appUrl + '/api/v1/user/verifyResetOtp'
  }

  public static get RESENDOTP(): string {
    return this.appUrl + '/api/v1/user/resendOTP'
  }

  public static get RESETPASSWORD(): string {
    return this.appUrl + '/api/v1/user/resetPassword'
  }

  public static get CHECKTOKEN(): string {
    return this.appUrl + '/api/v1/user/checkToken'
  }

  public static get GETEVENTlIST(): string {
    return this.appUrl + '/api/v1/event/allEvents'
  }
  public static get GETHOMEEVENTlIST(): string {
    return this.appUrl + '/api/v1/event/homePageEvents'
  }

  public static get VIEWEVENT(): string {
    return this.appUrl + '/api/v1/event/viewEventDetail'
  }


  public static get VERIFYOTP(): string {
    return this.appUrl + '/api/v1/user/verify_otp'
  }
  //Country and state APIs Integrate on 10/03/2021 by Suraj

  public static get COUNTRYLIST(): string {
    return this.appUrl + '/api/v1/country/list'
  }

  public static get STATELIST(): string {
    return this.appUrl + '/api/v1/state/listData'
  }

  public static get USERDETAILS(): string {
    return this.appUrl + '/api/v1/user/details'
  }

  public static get GETSLIDERlIST(): string {
    return this.appUrl + '/api/v1/sliderImage/homeSlider'
  }

  public static get GETCITYBYZIPCODE(): string {
    return this.appUrl + '/api/v1/user/findCityByZipcode'
  }

  public static get CONTACTUS(): string {
    return this.appUrl + '/api/v1/otherservices/savecontactusdata'
  }
   public static get GETCATEGORYLIST(): string {
    return this.appUrl + '/api/v1/category/list'
  }

}

