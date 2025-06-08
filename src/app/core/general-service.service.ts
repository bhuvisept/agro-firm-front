import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { FormControl } from '@angular/forms'
import { FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { ApiUrlConstant } from '../constant/api-url.constant'
import { SharedService } from '../service/shared.service'
import { BehaviorSubject, from } from 'rxjs'
import { Socket } from 'ngx-socket-io'
@Injectable({
  providedIn: 'root',
})
export class GeneralServiceService {
  isCompanyForm: boolean
  isUserForm: boolean
  userInfo: any

  constructor(private http: HttpClient, private router: Router, private sharedService: SharedService, private socket: Socket) {
    this.userInfo = JSON.parse(localStorage.getItem('truckStorage'))
    if (this.userInfo) {
      this.socket.on('connect', () => this.socket.emit('add-user', { user_id: this.userInfo.userInfo._id }))
    }
  }
  yearsExperience() {
    let maxmumYear = 40
    let minmumYear = 0
    let experienceArray = []
    for (var i = minmumYear; i <= maxmumYear; i++) {
      experienceArray.push({ value: i })
    }
    return experienceArray
  }
  monthsExperience() {
    let minexperience = []
    for (var i = 0; i <= 12; i++) {
      minexperience.push({ value: i })
    }
    return minexperience
  }

  tyres() {
    let totalTyres = []
    for (var i = 4; i <= 30; i++) {
      if(i%2==0){
        totalTyres.push({ value:i  })
      }
     
    }
    return totalTyres
  }
  addUser(userId) {
    this.socket.emit('add-user', { user_id: userId })
  }

  removeUser(userId) {
    this.socket.emit('remove-user', { user_id: userId })
  }

  logout() {
    localStorage.removeItem('userToken')
    localStorage.removeItem('truckStorage')
    localStorage.removeItem('truck_userId')
    this.router.navigate(['/login'])
    this.sharedService.setHeader({})
  }
  markFormGroupTouched(formGroup: FormGroup) {
    ;(<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched()
      if (control.controls) {
        this.markFormGroupTouched(control)
      }
    })
  }

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
  groupInviteResetPassword(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.RESETPASSWORDGROUPINVITEE, data)
  }
  checkToken(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CHECKTOKEN, data)
  }
  declineInvitationByToken(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.TOKENDECLINE, data)
  }
  teamInvitationDeclinedByToken(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.TOKENDECLINEBYTEAM, data)
  }
  recommendedDeclineInvitationByToken(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.RECOMMENDEDTOKENDECLINE, data)
  }
  recommendedAcceptInvitationByToken(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.RECOMMENDEDTOKENACCEPT, data)
  }

  //Event routes
  addEvent(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CREATEEVENT, data)
  }

  uploadImageForPath(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.UPLOADEVENTIMAGE, data)
  }
  eventList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETEVENTlIST, data)
  }
  homePageEvents(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETHOMEEVENTlIST, data)
  }

  companyEvents(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETCOMPANYEVENTlIST, data)
  }

  eventView(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.VIEWEVENT, data)
  }

  viewattende(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.VIEWATTENDE, data)
  }

  eventUpdate(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.UPDATEEVENT, data)
  }
  reopenUpdate(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.REOPENEVENT, data)
  }
  verifyOtp(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.VERIFYOTP, data)
  }

  eventDelete(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.DELETEEVENT, data)
  }

  //Interedted Attendee-added by Vaibhav

  addInterestedAttendee(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.ADDINTERESTEDTTENDEE, data)
  }
  removeInterestedAttendee(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.REMOVEINTERESTEDTTENDEE, data)
  }
  wishList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.WISHLIST, data)
  }
  removeWishList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.REMOVEWISHLIST, data)
  }

  // inviteConnectionList(data: any): Observable<any> {
  //   return this.http.post(ApiUrlConstant.INVITEEVENTLIST, data)
  // }

  //Favoirite -added by Vaibhav
  addFavouriteEvent(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.ADDFAVOURITE, data)
  }
  removeFavouriteEvent(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.REMOVEFAVOURITE, data)
  }

  favouriteEvent(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.FAVOURITEEVENTLIST, data)
  }

  blogList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.BLOGLIST, data)
  }

  //Jobs Api

  myPostedJobs(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.MYJOBS, data)
  }

  mySavedJobs(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.SAVEDJOBS, data)
  }

  jobsLists(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.LISTJOBS, data)
  }
  jobLocation(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.JOBLOCATION, data)
  }
  //country list
  getCountryList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.COUNTRYLIST, data)
  }

  // state list
  getStateList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.STATELIST, data)
  }

  //Company profile
  updateCompanyProfile(data): Observable<any> {
    return this.http.post(ApiUrlConstant.COMPANYPROFILE, data)
  }
  sellerToCompany(data): Observable<any> {
    return this.http.post(ApiUrlConstant.SELLERTOCOMPANY, data)
  }

  // uploadComplogoImageForPath(data: any): Observable<any> {
  //   return this.http.post(ApiUrlConstant.UPLOADCOMPANYLOGO, data)
  // }

  getUserDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.USERDETAILS, data)
  }

  getCompanyDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.COMPANYDETAILS, data)
  }
  getSellerDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.SELLERDETAILS, data)
  }
  getAllUserDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.USERESDETAILS, data)
  }

  getDriverDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.DRIVERDETAILS, data)
  }

  updateDriverDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.UPDATEDRIVER, data)
  }

  getDriverByName(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETDRIVERBYNAME, data)
  }
  getAnotherDriverByName(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETANOTHERDRIVERBYNAME, data)
  }

  getDriver(data) {
    return this.http.post(ApiUrlConstant.ONEDRIVER, data)
  }

  getAnotherDriver(data) {
    return this.http.post(ApiUrlConstant.ANOTHERDRIVER, data)
  }

  driverRegister(data: any) {
    return this.http.post(ApiUrlConstant.DRIVERREGISTER, data)
  }
  addEventType(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.ADDEVENTTYPE, data)
  }

  getTimeZoneList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.TIMEZONELIST, data)
  }
  sliders(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETSLIDERlIST, data)
  }

  getIndustryList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETINDUSTRYLIST, data)
  }
  getSalaryType(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.SALARYTYPE, data)
  }

  getFunctionalAreaList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETFUNCTIONALAREALIST, data)
  }

  createJob(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CREATEJOB, data)
  }
  editJob(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.EDITJOB, data)
  }
  reopenJob(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.REOPENJOB, data)
  }
  jobView(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.VIEWJOB, data)
  }

  deleteJob(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.DELETEJOB, data)
  }
  parmanentDeleteJob(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.PERMANENTDELETEJOB, data)
  }
  ChangeJobStatus(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CHANGEJOBSTATUS, data)
  }

  getQualification(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.QUALIFICATIONLIST, data)
  }

  getRoleList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.ROLELIST, data)
  }

  getSkillList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.SKILLLIST, data)
  }

  uploadResume(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.RESUME, data)
  }

  getApplicant(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.APPLICANT, data)
  }

  getApplicantDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.APPLICANTDETAILS, data)
  }

  appliedJobs(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.JOBAPPLIEDLIST, data)
  }
  unSaveJob(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.UNSAVEJOB, data)
  }

  savedJobs(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.SAVEJOB, data)
  }

  bookedEvent(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.BOOKEDEVENT, data)
  }

  savedJobsList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.SAVEJOBLIST, data)
  }

  savedJobsDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.SAVEJOBDETAILS, data)
  }

  applicantList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.APPLICANTLIST, data)
  }
  getServicesList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.SERVICELIST, data)
  }
  getGroupListDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETGROUPLIST, data)
  }
  leaveGroupMember(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.LEAVEGROUPMEMVER, data)
  }

  getEndUserDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.ENDUSERDETAILS, data)
  }

  creatCompanyGroupProfile(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CREATECOMPANYGROUPPROFILE, data)
  }
  updateUserProfile(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.USERUPDATE, data)
  }

  getCompanyGroupDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.COMPANYGROUPDETAILS, data)
  }

  updateCompanyGroup(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.UPDATECOMPANYGROUP, data)
  }
  deleteCompanyGroup(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.DELETECOMPANYGROUP, data)
  }
  sendNewInviteMemberForm(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.SENDNEWINVITEMEMBERFORM, data)
  }
  sendMultipalInvation(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.SENDMULTIPALINVATION, data)
  }

  connect(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CONNECTREQUEST, data)
  }

  getConnectListDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETCONNECTIONLIST, data)
  }
  getInvitedListDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GROUPINVITEDLIST, data)
  }
  getInvitedByMailDetail(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETINVITEDBYMAIDETAIL, data)
  }
  uploadImagePostPath(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.UPLOADPOSTIMAGE, data)
  }
  uploadVideoPostPath(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.UPLOADPOSTVIDEO, data)
  }

  creatpostForm(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CREATEPOSTFORM, data)
  }
  getHomePagePostList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.HOMEPAGEPOSTLIST, data)
  }

  likePostDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.LIKEPOSTDETAILS, data)
  }
  commentPostDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.COMMENTPOSTDETAILS, data)
  }
  getPostCommentListDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETCOMMENTPOSTLIST, data)
  }
  getPostLikeDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETCOMMENTLIKELIST, data)
  }

  ReCommentAdd(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.RECOMMENTADD, data)
  }

  reportPost(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.REPORTPOST, data)
  }

  getgroupPostList(data: any) {
    return this.http.post(ApiUrlConstant.GETGROUPPOSTLIST, data)
  }
  // getLikePostList(data: any): Observable<any> {
  //   return this.http.post(ApiUrlConstant.GETLIKEPOSTLIST, data)
  // }
  getMyInvitationList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETMYINVITATIONLIST, data)
  }
  acceptInvitation(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.ACCEPTINVITATION, data)
  }

  ignoreInvitation(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.IGNOREINVITATION, data)
  }

  joinGroupPublic(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.JOINGRIUPPUBLIC, data)
  }
  connectionDeleteOnList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.DELETECONNECTIONLIST, data)
  }

  // /groupinvite/myInvitationList
  postDelete(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.POSTDELETE, data)
  }

  // add trip planner
  createTrip(data): Observable<any> {
    return this.http.post(ApiUrlConstant.ADDTRIP, data)
  }
  createTripWithoutDriver(data): Observable<any> {
    return this.http.post(ApiUrlConstant.ADDTRIPWITHOUTDRIVER, data)
  }
  getdata(data) {
    return this.http.post(ApiUrlConstant.GETTRIPLIST, data)
  }
  trip(data: any) {
    return this.http.post(ApiUrlConstant.TRIP, data)
  }
  addressByLatLng(data: any) {
    return this.http.post(ApiUrlConstant.ADDLATLON, data)
  }
  getTripDetails(data) {
    return this.http.post(ApiUrlConstant.TRIPDETAILS, data)
  }
  EditDriver(data) {
    return this.http.post(ApiUrlConstant.EDITDRIVER, data)
  }
  AddDriver(data) {
    return this.http.post(ApiUrlConstant.ADDDRIVER, data)
  }
  DeleteMarker(data) {
    return this.http.post(ApiUrlConstant.DELETEMARKER, data)
  }
  addStoppage(data) {
    return this.http.post(ApiUrlConstant.ADDSTOPPAGE, data)
  }
  // end  add trip planner

  getPostDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.POSTDETAILS, data)
  }
  getmyeventList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.MYGETEVENTlIST, data)
  }
  getmyeventBookList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.MYGETBOOKEVENTlIST, data)
  }

  postDetailsUpdate(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.POSTUPDATE, data)
  }

  addSharePost(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.ADDSHAREPOTS, data)
  }
  getMySuggestionLits(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETSUGGESTIONLIST, data)
  }
  getStopages(data) {
    return this.http.post(ApiUrlConstant.GETSTOPPAGE, data)
  }
  deleteMarker(data) {
    return this.http.post(ApiUrlConstant.DELETEICON, data)
  }
  getHosStoppageList(data) {
    return this.http.post(ApiUrlConstant.GETHOSSTOPPAGE, data)
  }
  getSnowDay1(data) {
    return this.http.post(ApiUrlConstant.GETSNOWDAY1, data)
  }
  getSnowDay2(data) {
    return this.http.post(ApiUrlConstant.GETSNOWDAY2, data)
  }
  getSnowDay3(data) {
    return this.http.post(ApiUrlConstant.GETSNOWDAY3, data)
  }
  getRainfallDay1(data) {
    return this.http.post(ApiUrlConstant.GETRAINFALLDAY1, data)
  }
  getRainfallDay2(data) {
    return this.http.post(ApiUrlConstant.GETRAINFALLDAY2, data)
  }
  getRainfallDay3(data) {
    return this.http.post(ApiUrlConstant.GETRAINFALLDAY3, data)
  }
  getfreezeDay1(data) {
    return this.http.post(ApiUrlConstant.GETFREEZEDAY1, data)
  }
  getfreezeDay2(data) {
    return this.http.post(ApiUrlConstant.GETFREEZEDAY2, data)
  }
  getfreezeDay3(data) {
    return this.http.post(ApiUrlConstant.GETFREEZEDAY3, data)
  }
  getthunderDay1(data) {
    return this.http.post(ApiUrlConstant.GETTHUNDERDAY1, data)
  }
  getthunderDay2(data) {
    return this.http.post(ApiUrlConstant.GETTHUNDERDAY2, data)
  }
  getthunderDay3(data) {
    return this.http.post(ApiUrlConstant.GETTHUNDERDAY3, data)
  }
  getPrecipitationDay1(data) {
    return this.http.post(ApiUrlConstant.GETPREPDAY1, data)
  }
  getPrecipitationDay2(data) {
    return this.http.post(ApiUrlConstant.GETPREPDAY2, data)
  }
  getPrecipitationDay3(data) {
    return this.http.post(ApiUrlConstant.GETPREPDAY3, data)
  }

  getTempDay37(data) {
    return this.http.post(ApiUrlConstant.GETTEMPDAY37, data)
  }
  getPrepDay37(data) {
    return this.http.post(ApiUrlConstant.GETPREPDAY37, data)
  }

  getTempDay814(data) {
    return this.http.post(ApiUrlConstant.GETTEMPDAY814, data)
  }
  getPrepDay814(data) {
    return this.http.post(ApiUrlConstant.GETPREPDAY814, data)
  }

  hosStoppage(data) {
    return this.http.post(ApiUrlConstant.HOSHALT, data)
  }
  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = ((control && control.value && control.value.toString()) || '').trim().length === 0
    const isValid = !isWhitespace
    return isValid ? null : { whitespace: true }
  }

  getDrivers(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.DRIVERS, data)
  }
  getSealPersong(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.SELSPERSON, data)
  }

  deteleDriver(data: any) {
    return this.http.post(ApiUrlConstant.DELETEDRIVER, data)
  }

  //truck apis

  truckImageForPath(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.TRUCKEVENTIMAGE, data)
  }

  addTruck(data: any) {
    return this.http.post(ApiUrlConstant.ADDTRUCK, data)
  }
  showDriver(data: any) {
    return this.http.post(ApiUrlConstant.SHOWDRIVER, data)
  }
  getTrucks(data: any) {
    return this.http.post(ApiUrlConstant.GETTRUCKS, data)
  }

  oneTruck(data: any) {
    return this.http.post(ApiUrlConstant.ONETRUCK, data)
  }
  editTruck(data: any) {
    return this.http.post(ApiUrlConstant.EDITTRUCK, data)
  }
  getBrands(data: any) {
    return this.http.post(ApiUrlConstant.GETBRANDS, data)
  }
  deleteTruck(data: any) {
    return this.http.post(ApiUrlConstant.DELETETRUCK, data)
  }
  changeStatus(data: any) {
    return this.http.post(ApiUrlConstant.CHANGESTATUS, data)
  }

  // service api

  addService(data: any) {
    return this.http.post(ApiUrlConstant.ADDSERVICE, data)
  }
  listService(data: any) {
    return this.http.post(ApiUrlConstant.LISTSERVICE, data)
  }
  connectionList(data: any) {
    return this.http.post(ApiUrlConstant.LISTCONNECTION, data)
  }
  messageList(data: any) {
    return this.http.post(ApiUrlConstant.MESSAGELIST, data)
  }
  addChatUser(data: any) {
    return this.http.post(ApiUrlConstant.ADDCHATUSER, data)
  }
  addMessages(data: any) {
    return this.http.post(ApiUrlConstant.ADDCHATMESSAGE, data)
  }

  uploadImagePostservice(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.UPLOADPOSTIMAGESERVICE, data)
  }

  DeleteService(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.DELETESERVICE, data)
  }

  updateService(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.UPDATESERVICE, data)
  }

  GetServiceDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETSERVICEDETAILS, data)
  }

  // GroupList(data: any): Observable<any> {
  //   return this.http.post(ApiUrlConstant.GROUPLISTDETAILS, data)
  // }

  // Get connection details
  getConnectionDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETCONNECTIONDETAILS, data)
  }

  getMyConnectionsList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.MYCONNECTIONLIST, data)
  }

  // getViewPostList(data: any): Observable<any> {
  //   return this.http.post(ApiUrlConstant.VIEWPOSTLIST, data)
  // }

  getSubscriptionPlanList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETSUBSCRIPTIONPLANLIST, data)
  }
  getNotificationsLists(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETNOTIFICATIONSLISTS, data)
  }
  NotificationsRead(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETNOTIFICATIONSREAD, data)
  }
  markAllRead(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.MARKALLREAD, data)
  }
  getNotificationCount(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETNOTIFICATIONSCOUNT, data)
  }

  getBookedLists(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.BOOKEDLIST, data)
  }
  removedmember(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.REMOVEDMEMBER, data)
  }
  removedconnection(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.REMOVEDCOONECTION, data)
  }

  deleteImage(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.DELETIMAGE, data)
  }

  deleteVideo(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.DELETVIDEO, data)
  }
  getCityByZipcode(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETCITYBYZIPCODE, data)
  }
  getTotalCartList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETTOTALCOUNTLIST, data)
  }
  // getVinCode(data: any): Observable<any> {
  //   return this.http.post(ApiUrlConstant.GETVINCODE, data)
  // }

  // E-Commerce
  // productImagesUpload(data:any){
  //   return this.http.post(ApiUrlConstant.PRODUCTIMAGESUPLOAD,data)
  // }
  // addQuestion(data:any){
  //   return this.http.post(ApiUrlConstant.ASKQUESTION,data)
  // }

  // questionList(data:any){
  //   return this.http.post(ApiUrlConstant.QUESTIONANSWERLIST,data)
  // }
  // questionsList(data:any){
  //   return this.http.post(ApiUrlConstant.SELLERQUESTIONLIST,data)
  // }
  // questionsData(data:any){
  //   return this.http.post(ApiUrlConstant.QUESTIONDATA,data)
  // }
  // questionsAnswer(data:any){
  //   return this.http.post(ApiUrlConstant.QUESTIONANSWER,data)
  // }
  // getProductAdminList(data: any): Observable<any> {
  //   return this.http.post(ApiUrlConstant.PRODUCTADMINLIST, data)
  // }
  // getBrandList(data: any): Observable<any> {
  //   return this.http.post(ApiUrlConstant.GETBRANDLIST, data)
  // }
  // productDelete(data:any){
  //   return this.http.post(ApiUrlConstant.PRODUCTDELELE,data)
  // }
  // getManufactureList(data: any): Observable<any> {
  //   return this.http.post(ApiUrlConstant.GETMANUFACTURLLIST, data)
  // }
  // getModelList(data: any): Observable<any> {
  //   return this.http.post(ApiUrlConstant.GETMODELLIST, data)
  // }
  // getSubCategoryList(data:any):Observable<any>{
  //   return this.http.post(ApiUrlConstant.SUBCATEGORYLIST,data)
  // }
  // deletProductImage(data: any): Observable<any> {
  //   return this.http.post(ApiUrlConstant.DELETPRODUCT, data)
  // }
  // createProduct(data: any): Observable<any> {
  //   return this.http.post(ApiUrlConstant.CREATEPRODUCT, data)
  // }
  // productDetail(data:any){
  //   return this.http.post(ApiUrlConstant.PRODUCTDETAIL,data)
  // }
  // productUpdates(data:any){
  //   return this.http.post(ApiUrlConstant.PRODUCTUPDATE,data)
  // }

  // E-Commerce API
  getCategoryList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETCATEGORYLIST, data)
  }
  getSubCategoryList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.SUBCATEGORYLIST, data)
  }
  getManufactureList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETMANUFACTURLLIST, data)
  }
  getModelList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETMODELLIST, data)
  }
  getBrandList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETBRANDLIST, data)
  }
  // getSubCategoryList(data: any): Observable<any> {
  //   return this.http.post(ApiUrlConstant.GETSUBCATEGORYLIST, data)
  // }
  createProduct(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CREATEPRODUCT, data)
  }
  productDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.PRODUCTDETAIL, data)
  }
  addToWishList(data: any) {
    return this.http.post(ApiUrlConstant.ADDTOWISHLIST, data)
  }
  productList(data: any) {
    return this.http.post(ApiUrlConstant.PRODUCTLIST, data)
  }
  productDetail(data: any) {
    return this.http.post(ApiUrlConstant.PRODUCTDETAIL, data)
  }
  productDelete(data: any) {
    return this.http.post(ApiUrlConstant.PRODUCTDELELE, data)
  }
  productUpdates(data: any) {
    return this.http.post(ApiUrlConstant.PRODUCTUPDATE, data)
  }
  addCoupon(data: any) {
    return this.http.post(ApiUrlConstant.ADDCOUPON, data)
  }
  listCoupon(data: any) {
    return this.http.post(ApiUrlConstant.LISTCOUPON, data)
  }
  productAddToCart(data: any) {
    return this.http.post(ApiUrlConstant.ADDTOCART, data)
  }
  contactSeller(data: any) {
    return this.http.post(ApiUrlConstant.CONTACTSELLER, data)
  }
  contactToSeller(data: any) {
    return this.http.post(ApiUrlConstant.CONTACTTOSELLER, data)
  }
  showGraph(data: any) {
    return this.http.post(ApiUrlConstant.SHOWGRAPH, data)
  }
  productImagesUpload(data: any) {
    return this.http.post(ApiUrlConstant.PRODUCTIMAGESUPLOAD, data)
  }
  addQuestion(data: any) {
    return this.http.post(ApiUrlConstant.ASKQUESTION, data)
  }

  questionList(data: any) {
    return this.http.post(ApiUrlConstant.QUESTIONANSWERLIST, data)
  }
  overAllSellerRating(data: any) {
    return this.http.post(ApiUrlConstant.OVERALLSELLERRATING, data)
  }
  questionsList(data: any) {
    return this.http.post(ApiUrlConstant.SELLERQUESTIONLIST, data)
  }
  questionsData(data: any) {
    return this.http.post(ApiUrlConstant.QUESTIONDATA, data)
  }
  questionsAnswer(data: any) {
    return this.http.post(ApiUrlConstant.QUESTIONANSWER, data)
  }
  ratingTokenGererate(data: any) {
    return this.http.post(ApiUrlConstant.RATINGTOKEN, data)
  }
  ratingTokenCheck(data: any) {
    return this.http.post(ApiUrlConstant.RATINGTOKENCHECK, data)
  }
  giveSellerRating(data: any) {
    return this.http.post(ApiUrlConstant.SELLERRATING, data)
  }
  getSellerRating(data: any) {
    return this.http.post(ApiUrlConstant.GETSELLERRATING, data)
  }
  // Brand api

  // Add brand image
  brandImage(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.BRANDIMAGE, data)
  }
  // Add Brand
  addBrand(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.ADDBRAND, data)
  }
  listBrand(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.LISTBRAND, data)
  }
  eventDelet(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.EVENTDELET, data)
  }

  fetchData(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.FETCHDATA, data)
  }

  changeStatusBrand(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CHANGEBRAND, data)
  }
  editBrand(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.EDITBRAND, data)
  }

  // ADD model
  addModel(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.ADDMODEL, data)
  }
  listModel(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.LISTMODEL, data)
  }

  modelDelet(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.MODELDELET, data)
  }

  changeStatusModel(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CHANGEMODEL, data)
  }
  detailModel(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.DETAILMODEL, data)
  }

  editModel(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.EDITMODEL, data)
  }
  getProductList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.PRODUCTLIST, data)
  }
  getProductAdminList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.PRODUCTADMINLIST, data)
  }

  addManufacture(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.ADDMANUFACTURE, data)
  }

  listManufacture(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.LISTMANUFACTURE, data)
  }

  manufactureDelet(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.MANUFACTUREDELET, data)
  }

  changeStatusManufacture(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CHANGEMANUFACTURE, data)
  }
  detailManufacture(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.DETAILMANUFACTURE, data)
  }
  editManufacture(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.EDITMANUFACTURE, data)
  }

  getCategory(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETCATEGORY, data)
  }

  addCategory(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.ADDCATEGORY, data)
  }

  listCategory(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.LISTCATEGORY, data)
  }

  changeStatusList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CHANGELIST, data)
  }

  CategoryDelet(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CATEGORYDELET, data)
  }

  groupRequestList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GROUPREQUESTLIST, data)
  }
  groupRequest(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GROUPREQUEST, data)
  }
  groupRequestAccept(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GROUPACCEPT, data)
  }
  DeleteComment(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.COMMENTDELETE, data)
  }

  editComment(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.EDITCOMMENT, data)
  }

  // /api/v1/category/adminCategoryList

  CategoryDetail(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CATEGORYDETAIL, data)
  }

  updateCategory(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.UPDATECATEGORY, data)
  }

  deletProductImage(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.DELETPRODUCT, data)
  }
  sellerProfile(data: any) {
    return this.http.post(ApiUrlConstant.SELLERPROFILE, data)
  }
  becomeSeller(data: any) {
    return this.http.post(ApiUrlConstant.BECOMESELLER, data)
  }
  questionDelete(data: any) {
    return this.http.post(ApiUrlConstant.QUESTIONDELETE, data)
  }
  sellerReating(data: any) {
    return this.http.post(ApiUrlConstant.SELLERREATING, data)
  }
  getBlogList(data: any) {
    return this.http.post(ApiUrlConstant.GETBLOGLIST, data)
  }
  homePageBlogs(data: any) {
    return this.http.post(ApiUrlConstant.GETHOMEBLOGLIST, data)
  }

  contactUs(data: any) {
    return this.http.post(ApiUrlConstant.CONTACTUS, data)
  }
  getBlogdetails(data: any) {
    return this.http.post(ApiUrlConstant.GETBLOGDETAILS, data)
  }
  getEndUserServicesList(data: any) {
    return this.http.post(ApiUrlConstant.GETENDUSERSERVICESLIST, data)
  }

  report(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.REPORT, data)
  }
  similarproductList(data: any) {
    return this.http.post(ApiUrlConstant.SIMILARPRODUCTLIST, data)
  }
  //role switch
  switchRoles(data: any) {
    return this.http.post(ApiUrlConstant.SWITCHROLES, data)
  }
  changeRole(data: any) {
    return this.http.post(ApiUrlConstant.CHANGEROLE, data)
  }

  // user left company

  leaveCompany(data: any) {
    return this.http.post(ApiUrlConstant.LEAVECOMPANY, data)
  }
  deleteCompany(data: any) {
    return this.http.post(ApiUrlConstant.DELETECOMPANY, data)
  }
  deleteTtrip(data: any) {
    return this.http.post(ApiUrlConstant.DELETETRIP, data)
  }
  completeTrip(data: any) {
    return this.http.post(ApiUrlConstant.COMPLETETRIP, data)
  }
  atulya(data: any) {
    return this.http.post(ApiUrlConstant.ATULYA, data)
  }
  startTrip(data: any) {
    return this.http.post(ApiUrlConstant.STARTTRIP, data)
  }
  reasonList(data): any {
    return this.http.post(ApiUrlConstant.GETREASONS, data)
  }
  cancelReasonList(data): any {
    return this.http.post(ApiUrlConstant.GETTRIPCANCELREASONS, data)
  }
  leftUsersList(data): any {
    return this.http.post(ApiUrlConstant.LEFTUSERS, data)
  }
  getJobInvitations(data): any {
    return this.http.post(ApiUrlConstant.JOBINVITATION, data)
  }

  acceptJobInvitations(data): any {
    return this.http.post(ApiUrlConstant.ACCEPTJOBINVITATION, data)
  }

  rejectJobInvitations(data): any {
    return this.http.post(ApiUrlConstant.REJECTJOBINVITATION, data)
  }
  checkJobToken(data): any {
    return this.http.post(ApiUrlConstant.CHECKJOBTOKEN, data)
  }
  chnagePassword(data): any {
    return this.http.post(ApiUrlConstant.CHANGEPASSWORD, data)
  }

  driverDocs(data): any {
    return this.http.post(ApiUrlConstant.UPDATEDRIVERDOCS, data)
  }

  deleteDriverDocs(data): any {
    return this.http.post(ApiUrlConstant.DELETEDRIVERDOCS, data)
  }

  activityLogs(data) {
    return this.http.post(ApiUrlConstant.ACTIVITYLOGS, data)
  }

  //subscription plan api

  addPlanToCart(data) {
    return this.http.post(ApiUrlConstant.ADDPLANTOCART, data)
  }

  subsPlanList(data) {
    return this.http.post(ApiUrlConstant.SUBPLANLIST, data)
  }
  getSelectedPlan(data) {
    return this.http.post(ApiUrlConstant.GETSELECTEDPLAN, data)
  }
  promoCodesList(data) {
    return this.http.post(ApiUrlConstant.PROMOLIST, data)
  }
  customPlanDetails(data) {
    return this.http.post(ApiUrlConstant.CUSTOMPLAN, data)
  }

  removePlan(data) {
    return this.http.post(ApiUrlConstant.REMOVEPLAN, data)
  }

  promocodeApply(data) {
    return this.http.post(ApiUrlConstant.APPLYPROMOCODE, data)
  }

  promoRemove(data) {
    return this.http.post(ApiUrlConstant.REMOVEPROMO, data)
  }

  paymentSave(data) {
    return this.http.post(ApiUrlConstant.SAVEPAYMENT, data)
  }
  upgradePayment(data) {
    return this.http.post(ApiUrlConstant.UPGRADEPAYMENT, data)
  }
  customPaymentSave(data) {
    return this.http.post(ApiUrlConstant.CUSTOMPAYMENT, data)
  }

  customPaymentForExistinguserSave(data) {
    return this.http.post(ApiUrlConstant.CUSTOMPAYMENTFOREXISTINGUSER, data)
  }

  getMyplan(data: any) {
    return this.http.post(ApiUrlConstant.GETMYPLAN, data)
  }

  getFreeSubsPlan(data: any) {
    return this.http.post(ApiUrlConstant.FREESUBSPLAN, data)
  }

  uploadChatAttachment(data: any) {
    return this.http.post(ApiUrlConstant.CHATATTACMENT, data)
  }

  getConnectListChatDetails(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETCONNECTIONLISTCHAT, data)
  }
  getTruckNews(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.TRUCKNEWS, data)
  }

  deleteChatDocument(data: any) {
    return this.http.post(ApiUrlConstant.DELETECHATDOC, data)
  }

  // Chat
  getTeamMemberForChat(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETTEAMMEMBERFORCHAT, data)
  }
  startNewConversation(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.STARTNEWCONVERSATION, data)
  }
  getChatList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETCHATLIST, data)
  }
  getChatMessages(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETCHATMESSAGES, data)
  }
  getGroupDetailWithMembers(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETGROUPDETAILSWITHMEMBERS, data)
  }
  leaveOrRemoveFromGroup(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.LEAVEORREMOVEGROUP, data)
  }
  updateGroupInfo(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.UPDATEGROUP, data)
  }
  makeOrDismissAdmin(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.MAKEORDISMISSADMIN, data)
  }
  updateGroupSettings(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.UPDATEGROUPSETTINGS, data)
  }
  getMembersToAddinGroup(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.MEMBERSTOADDINGROUP, data)
  }
  addMemberToGroup(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.ADDMEMBERTOGROUP, data)
  }
  deleteMessages(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.DELETEMESSAGE, data)
  }
  blockUser(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.BLOCKUSER, data)
  }

  getSpecificMsgData(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.SPECIFICMSGDATA, data)
  }

  faqList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.FAQLIST, data)
  }

  gpsTruckTrailer(data: any) {
    return this.http.post(ApiUrlConstant.GPSTRUCKTRAILER, data)
  }
  gpsCreateRoute(data: any) {
    return this.http.post(ApiUrlConstant.GPSROUTECREATE, data)
  }

  gpsRecentTrips(data: any) {
    return this.http.post(ApiUrlConstant.GPSRECENTTRIPS, data)
  }

  deleteAccount(data: any) {
    return this.http.post(ApiUrlConstant.DELETEACCOUNT, data)
  }

  getAllPlans(data: any) {
    return this.http.post(ApiUrlConstant.GETALLSUBSPLANS, data)
  }

  cancelSubsPlan(data: any) {
    return this.http.post(ApiUrlConstant.CANCELSUBSPLAN, data)
  }

  PostsList(data: any) {
    return this.http.post(ApiUrlConstant.POSTLIST, data)
  }
  AcceptPolicies(data: any) {
    return this.http.post(ApiUrlConstant.ACCEPTPOLICIES, data)
  }
  ChatSalesPersonList(data: any) {
    return this.http.post(ApiUrlConstant.CHATSALESPERSONLIST, data)
  }
  PlanStatus(data :any) {
    return this.http.post(ApiUrlConstant.PLANSTATUS, data)
  }
  isReadedjob(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.READEDJOBAPPLIED, data)
  }
  jobStatusUpdate(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.JOBSTATUSUPDATE, data)
  }  
  invitationDeleteByCompany(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.INVITATIONDELETEBYCOMPANY, data)
  }
  addCard(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.ADDCARD, data)
  }  
  listCard(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.LISTCARD, data)
  }
  defaultCard(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.DEFAULTCARD, data)
  }
  deleteCard(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.DELETECARD, data)
  }
  allProductList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.ALLPRODUCTLIST, data)
  }
  installmentplanList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.INSTALLMENTPLANLIST, data)
  }  
  installmentpayment(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.INSTALLMENTPLANCREATE, data)
  } 
  installmentMultiplanList(): Observable<any> {
    return this.http.post(ApiUrlConstant.MULTIPLANINSTALLMENTPLAN,{})
  }
  userInstallment(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.USERINSTALLMENT,data)
  }
  
  // ticket apis 
  getTicketList(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.GETTICKETLIST, data)
  }
  addTicket(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.CREATETICKET, data)
  }
  getTicketDetails(data: any): Observable<any> {
    return this.http.get(`${ApiUrlConstant.GETTICKETDETAILS}/${data.id}`, data)
  }
  ticketReply(data: any): Observable<any> {
    return this.http.post(ApiUrlConstant.TICKETREPLY, data)
  }
}
