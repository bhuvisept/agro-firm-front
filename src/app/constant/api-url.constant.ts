import { environment } from 'src/environments/environment'

export class ApiUrlConstant {
  static GROUPLIST(GROUPLIST: any, data: any): import('rxjs').Observable<any> {
    throw new Error('Method not implemented.')
  }
  private static appUrl = environment.url
  private static ticketUrl = environment.ticketUrl

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
  public static get RESETPASSWORDGROUPINVITEE(): string {
    return this.appUrl + '/api/v1/user/groupInviteResetPassword'
  }

  public static get CHECKTOKEN(): string {
    return this.appUrl + '/api/v1/user/checkToken'
  }
  public static get TOKENDECLINE(): string {
    return this.appUrl + '/api/v1/groupinvite/declineInvitationByToken'
  }

  public static get TOKENDECLINEBYTEAM(): string {
    return this.appUrl + '/api/v1/groupinvite/teamInvitationDeclinedByToken'
  }
  public static get RECOMMENDEDTOKENDECLINE(): string {
    return this.appUrl + '/api/v1/groupinvite/recommendeddeclineInvitationByToken'
  }

  public static get RECOMMENDEDTOKENACCEPT(): string {
    return this.appUrl + '/api/v1/groupinvite/recommendedAcceptInvitationByToken'
  }

  //EVENT API's

  public static get CREATEEVENT(): string {
    return this.appUrl + '/api/v1/event/createEvent'
  }

  public static get UPLOADEVENTIMAGE(): string {
    return this.appUrl + '/api/v1/event/uploads'
  }

  public static get GETEVENTlIST(): string {
    return this.appUrl + '/api/v1/event/allEvents'
  }
  public static get GETHOMEEVENTlIST(): string {
    return this.appUrl + '/api/v1/event/homePageEvents'
  }
  public static get GETCOMPANYEVENTlIST(): string {
    return this.appUrl + '/api/v1/event/eventList'
  }

  public static get VIEWEVENT(): string {
    return this.appUrl + '/api/v1/event/viewEvent'
  }

  public static get VIEWATTENDE(): string {
    return this.appUrl + '/api/v1/event/interestList'
  }

  public static get UPDATEEVENT(): string {
    return this.appUrl + '/api/v1/event/updateEvent'
  }
  public static get REOPENEVENT(): string {
    return this.appUrl + '/api/v1/event/reOpenEvent'
  }
  public static get DELETEEVENT(): string {
    return this.appUrl + '/api/v1/event/deleteEvent'
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

  public static get COMPANYPROFILE(): string {
    return this.appUrl + '/api/v1/company/update'
  }
  public static get SELLERTOCOMPANY(): string {
    return this.appUrl + '/api/v1/user/becomeACompany'
  }

  // public static get UPLOADCOMPANYLOGO(): string {
  //   return this.appUrl + '/api/v1/company/update'
  // }

  //Company and driver APIs Integrate on 10/03/2021 by Suraj
  public static get USERDETAILS(): string {
    return this.appUrl + '/api/v1/user/details'
  }

  public static get COMPANYDETAILS(): string {
    return this.appUrl + '/api/v1/company/details'
  }
  public static get SELLERDETAILS(): string {
    return this.appUrl + '/api/v1/user/sellerDetails'
  }

  public static get USERESDETAILS(): string {
    return this.appUrl + '/api/v1/user/getProfile'
  }

  public static get DRIVERDETAILS(): string {
    return this.appUrl + '/api/v1/driver/details'
  }

  public static get UPDATEDRIVER(): string {
    return this.appUrl + '/api/v1/driver/update'
  }
  public static get GETDRIVERBYNAME(): string {
    return this.appUrl + '/api/v1/driver/searchDriverByName'
  }
  public static get GETANOTHERDRIVERBYNAME(): string {
    return this.appUrl + '/api/v1/driver/searchAnotherDriverByName'
  }

  public static get DRIVERREGISTER(): string {
    return this.appUrl + '/api/v1/invitation/company'
  }
  public static get ADDEVENTTYPE(): string {
    return this.appUrl + '/api/v1/company/event'
  }

  public static get TIMEZONELIST(): string {
    return this.appUrl + '/api/v1/timezone/list'
  } 

  //Added by vaibhav
  public static get ADDINTERESTEDTTENDEE(): string {
    return this.appUrl + '/api/v1/event/addInterest'
  }
  public static get REMOVEINTERESTEDTTENDEE(): string {
    return this.appUrl + '/api/v1/event/removeInterest'
  }
  public static get WISHLIST(): string {
    return this.appUrl + '/api/v1/wishlist/list'
  }
  public static get REMOVEWISHLIST(): string {
    return this.appUrl + '/api/v1/wishlist/removeWishlist'
  }

  public static get ADDFAVOURITE(): string {
    return this.appUrl + '/api/v1/event/addfavourite'
  }
  public static get REMOVEFAVOURITE(): string {
    return this.appUrl + '/api/v1/event/removeFavourite'
  }
  public static get FAVOURITEEVENTLIST(): string {
    return this.appUrl + '/api/v1/event/favouriteList'
  }
  public static get BLOGLIST(): string {
    return this.appUrl + '/api/v1/blog/getBlogList'
  }
  // public static get FAVOURITEEVENTLIST(): string {
  //     return this.appUrl + '/api/v1/event/inviteList';
  // }

  //  Jobs API's- added by vaibhav

  public static get MYJOBS(): string {
    return this.appUrl + '/api/v1/job/posted'
  }

  public static get SAVEDJOBS(): string {
    return this.appUrl + '/api/v1/savedjob/list'
  }

  public static get LISTJOBS(): string {
    return this.appUrl + '/api/v1/job/list'
  }

  public static get JOBLOCATION(): string {
    return this.appUrl + '/api/v1/job/jobLocation'
  }

  // To be made - No of Attendes by event id

  public static get NOOFATTENDES(): string {
    return this.appUrl + 'api/v1/'
  }
  public static get GETSLIDERlIST(): string {
    return this.appUrl + '/api/v1/sliderImage/homeSlider'
  }

  public static get GETINDUSTRYLIST(): string {
    return this.appUrl + '/api/v1/industry/list'
  }
  public static get SALARYTYPE(): string {
    return this.appUrl + '/api/v1/salarytype/list'
  }

  public static get GETFUNCTIONALAREALIST(): string {
    return this.appUrl + '/api/v1/functionalarea/list'
  }

  public static get ROLELIST(): string {
    return this.appUrl + '/api/v1/roles/list'
  }

  public static get CREATEJOB(): string {
    return this.appUrl + '/api/v1/job/add'
  }
  public static get EDITJOB(): string {
    return this.appUrl + '/api/v1/job/update'
  }
  public static get REOPENJOB(): string {
    return this.appUrl + '/api/v1/job/reopenjob'
  }

  public static get VIEWJOB(): string {
    return this.appUrl + '/api/v1/job/details'
  }

  public static get DELETEJOB(): string {
    return this.appUrl + '/api/v1/job/delete'
  }
  public static get PERMANENTDELETEJOB(): string {
    return this.appUrl + '/api/v1/job/deletePermanently'
  }

  public static get CHANGEJOBSTATUS(): string {
    return this.appUrl + '/api/v1/job/changeStatus'
  }

  public static get QUALIFICATIONLIST(): string {
    return this.appUrl + '/api/v1/qualification/list'
  }

  public static get SKILLLIST(): string {
    return this.appUrl + '/api/v1/skill/list'
  }

  public static get RESUME(): string {
    return this.appUrl + '/api/v1/user/resume'
  }

  public static get APPLICANTDETAILS(): string {
    return this.appUrl + '/api/v1/job/addJobApplicant'
  }

  public static get APPLICANT(): string {
    return this.appUrl + '/api/v1/applicant/add'
  }

  public static get JOBAPPLIEDLIST(): string {
    return this.appUrl + '/api/v1/jobapplied/list'
  }
  public static get UNSAVEJOB(): string {
    return this.appUrl + '/api/v1/savedjob/remove'
  }

  public static get SAVEJOB(): string {
    return this.appUrl + '/api/v1/savedjob/add'
  }
  public static get BOOKEDEVENT(): string {
    return this.appUrl + '/api/v1/event/addBooked'
  }

  public static get SAVEJOBLIST(): string {
    return this.appUrl + '/api/v1/savedjob/list'
  }

  public static get SAVEJOBDETAILS(): string {
    return this.appUrl + '/api/v1/savedjob/details'
  }

  public static get APPLICANTLIST(): string {
    return this.appUrl + '/api/v1/applicant/list'
  }

  public static get SERVICELIST(): string {
    return this.appUrl + '/api/v1/service/list'
  }

  public static get GETGROUPLIST(): string {
    return this.appUrl + '/api/mobile/group/list'
  }

  public static get REPORT(): string {
    return this.appUrl + '/api/mobile/post/report'
  }

  public static get LEAVEGROUPMEMVER(): string {
    return this.appUrl + '/api/mobile/group/removeMember'
  }

  public static get ENDUSERDETAILS(): string {
    return this.appUrl + '/api/v1/endUser/details'
  }
  public static get CREATECOMPANYGROUPPROFILE(): string {
    return this.appUrl + '/api/mobile/group/add'
  }

  public static get USERUPDATE(): string {
    return this.appUrl + '/api/v1/endUser/update'
  }
  public static get COMPANYGROUPDETAILS(): string {
    return this.appUrl + '/api/mobile/group/detailsWithPost'
  }

  public static get UPDATECOMPANYGROUP(): string {
    return this.appUrl + '/api/mobile/group/update'
  }

  public static get DELETECOMPANYGROUP(): string {
    return this.appUrl + '/api/v1/group/delete'
  }
  public static get SENDMULTIPALINVATION(): string {
    return this.appUrl + '/api/mobile/group/sendInvite'
  }
  public static get CONNECTREQUEST(): string {
    return this.appUrl + '/api/mobile/invite/sendInvite'
  }
  public static get SENDNEWINVITEMEMBERFORM(): string {
    return this.appUrl + '/api/mobile/group/sendInvite'
  }
  public static get GETCONNECTIONLIST(): string {
    return this.appUrl + '/api/mobile/invite/myConnectionList'
  }
  public static get GROUPINVITEDLIST(): string {
    return this.appUrl + '/api/mobile/group/memberInvite/list'
  }

  public static get GETINVITEDBYMAIDETAIL(): string {
    return this.appUrl + '/api/v1/groupinvite/groupInvitedList'
  }
  public static get UPLOADPOSTIMAGE(): string {
    return this.appUrl + '/api/v1/post/networkImages'
  }
  public static get UPLOADPOSTVIDEO(): string {
    return this.appUrl + '/api/v1/post/uploadVideo'
  }
  public static get CREATEPOSTFORM(): string {
    return this.appUrl + '/api/mobile/post/add'
  }
  public static get HOMEPAGEPOSTLIST(): string {
    return this.appUrl + '/api/mobile/post/homePagePostList'
  }
  public static get LIKEPOSTDETAILS(): string {
    return this.appUrl + '/api/mobile/like/add'
  }
  public static get COMMENTPOSTDETAILS(): string {
    return this.appUrl + '/api/mobile/comment/add'
  }
  public static get GETCOMMENTPOSTLIST(): string {
    return this.appUrl + '/api/mobile/comment/list'
  }

  public static get GETCOMMENTLIKELIST(): string {
    return this.appUrl + '/api/mobile/like/list'
  }

  public static get RECOMMENTADD(): string {
    return this.appUrl + '/api/mobile/reComment/add'
  }

  // REPORTPOST
  public static get REPORTPOST(): string {
    return this.appUrl + '/api/mobile/post/report'
  }

  public static get POSTDELETE(): string {
    return this.appUrl + '/api/mobile/post/delete'
  }
  public static get GETGROUPPOSTLIST(): string {
    return this.appUrl + '/api/mobile/group/memberList'
  }
  public static get GETMYINVITATIONLIST(): string {
    return this.appUrl + '/api/v1/groupinvite/myInvitationList'
  }
  public static get ACCEPTINVITATION(): string {
    return this.appUrl + '/api/mobile/invite/accept'
  }
  public static get IGNOREINVITATION(): string {
    return this.appUrl + '/api/mobile/invite/decline'
  }
  public static get JOINGRIUPPUBLIC(): string {
    return this.appUrl + '/api/mobile/group/join'
  }
  public static get DELETECONNECTIONLIST(): string {
    return this.appUrl + '/api/mobile/invite/decline'
  }

  public static get DRIVERS(): string {
    return this.appUrl + '/api/v1/endUser/list'
  }
  public static get SELSPERSON(): string {
    return this.appUrl + '/api/v1/endUser/salesPersonlist'
  }

  public static get DELETEDRIVER(): string {
    return this.appUrl + '/api/v1/driver/delete'
  }

  // TRUCK API ROUTESS
  //Added by Adarsh
  public static get TRUCKEVENTIMAGE(): string {
    return this.appUrl + '/api/v1/event/uploads'
  }
  public static get ADDTRUCK(): string {
    return this.appUrl + '/api/v1/truck/add'
  }

  public static get SHOWDRIVER(): string {
    return this.appUrl + '/api/v1/trip/companyDriverList'
  }
  public static get GETTRUCKS(): string {
    return this.appUrl + '/api/v1/truck/list'
  }

  public static get ONETRUCK(): string {
    return this.appUrl + '/api/v1/truck/details'
  }
  public static get EDITTRUCK(): string {
    return this.appUrl + '/api/v1/truck/update'
  }
  public static get GETBRANDS(): string {
    return this.appUrl + '/api/v1/brand/list'
  }
  public static get DELETETRUCK(): string {
    return this.appUrl + '/api/v1/truck/delete'
  }
  public static get CHANGESTATUS(): string {
    return this.appUrl + '/api/v1/truck/status'
  }
  // Trip planner
  // Trip planner Creat list

  public static get ADDTRIP(): string {
    return this.appUrl + '/api/v1/trip/create'
  }
  public static get ADDTRIPWITHOUTDRIVER(): string {
    return this.appUrl + '/api/v1/trip/addUnassignedTrip'
  }
  public static get ONEDRIVER(): string {
    return this.appUrl + '/api/v1/endUser/details'
  }

  public static get ANOTHERDRIVER(): string {
    return this.appUrl + '/api/v1/endUser/details'
  }

  // Trip planner list
  public static get GETTRIPLIST(): string {
    return this.appUrl + '/api/v1/trip/list'
  }
  public static get TRIP(): string {
    return this.appUrl + '/api/v1/driver/trip'
  }
  public static get ADDLATLON(): string {
    return this.appUrl + '/api/v1/trip/addressByLatLng'
  }
  public static get TRIPDETAILS(): string {
    return this.appUrl + '/api/v1/trip/details'
  }

  public static get EDITDRIVER(): string {
    return this.appUrl + '/api/v1/trip/reassignDriver'
  }
  public static get ADDDRIVER(): string {
    return this.appUrl + '/api/v1/trip/addUnassignedTripDriver'
  }

  public static get MYGETEVENTlIST(): string {
    return this.appUrl + '/api/v1/event/interestList'
  }
  public static get MYGETBOOKEVENTlIST(): string {
    return this.appUrl + '/api/v1/event/getBookedEvents'
  }
  public static get ADDSTOPPAGE(): string {
    return this.appUrl + '/api/v1/trip/addStoppage'
  }
  public static get DELETEMARKER(): string {
    return this.appUrl + '/api/v1/trip/removeMarker'
  }

  // Trip planner End

  public static get POSTDETAILS(): string {
    return this.appUrl + '/api/v1/post/details'
  }
  public static get POSTUPDATE(): string {
    return this.appUrl + '/api/mobile/post/update'
  }
  public static get ADDSHAREPOTS(): string {
    return this.appUrl + '/api/mobile/post/share'
  }
  public static get SHAREDPOST(): string {
    return this.appUrl + '/api/v1/shared/post'
  }
  public static get GETSUGGESTIONLIST(): string {
    return this.appUrl + '/api/mobile/user/getSuggestion/getInvites'
  }
  public static get GETSTOPPAGE(): string {
    return this.appUrl + '/api/v1/trip/getStopages'
  }
  public static get DELETEICON(): string {
    return this.appUrl + '/api/v1/trip/removeMarker'
  }
  public static get GETHOSSTOPPAGE(): string {
    return this.appUrl + '/api/v1/trip/getHosStoppageList'
  }
  public static get GETSNOWDAY1(): string {
    return this.appUrl + '/api/v1/forecast/snowDay1'
  }
  public static get GETSNOWDAY2(): string {
    return this.appUrl + '/api/v1/forecast/snowDay2'
  }
  public static get GETSNOWDAY3(): string {
    return this.appUrl + '/api/v1/forecast/snowDay3'
  }
  public static get GETRAINFALLDAY1(): string {
    return this.appUrl + '/api/v1/forecast/rainfallDay1'
  }
  public static get GETRAINFALLDAY2(): string {
    return this.appUrl + '/api/v1/forecast/rainfallDay2'
  }
  public static get GETRAINFALLDAY3(): string {
    return this.appUrl + '/api/v1/forecast/rainfallDay3'
  }
  public static get GETFREEZEDAY1(): string {
    return this.appUrl + '/api/v1/forecast/frzrainDay1'
  }
  public static get GETFREEZEDAY2(): string {
    return this.appUrl + '/api/v1/forecast/frzrainDay2'
  }
  public static get GETFREEZEDAY3(): string {
    return this.appUrl + '/api/v1/forecast/frzrainDay3'
  }
  public static get GETTHUNDERDAY1(): string {
    return this.appUrl + '/api/v1/forecast/thunderDay1'
  }
  public static get GETTHUNDERDAY2(): string {
    return this.appUrl + '/api/v1/forecast/thunderDay2'
  }
  public static get GETTHUNDERDAY3(): string {
    return this.appUrl + '/api/v1/forecast/thunderDay3'
  }

  public static get GETPREPDAY1(): string {
    return this.appUrl + '/api/v1/forecast/qpfDay1'
  }
  public static get GETPREPDAY2(): string {
    return this.appUrl + '/api/v1/forecast/qpfDay2'
  }
  public static get GETPREPDAY3(): string {
    return this.appUrl + '/api/v1/forecast/qpfDay3'
  }
  public static get GETTEMPDAY37(): string {
    return this.appUrl + '/api/v1/forecast/TempDay3_7'
  }
  public static get GETPREPDAY37(): string {
    return this.appUrl + '/api/v1/forecast/precoDay3_7'
  }
  public static get GETTEMPDAY814(): string {
    return this.appUrl + '/api/v1/forecast/TempDay8_14'
  }
  public static get GETPREPDAY814(): string {
    return this.appUrl + '/api/v1/forecast/precoDay8_14'
  }
  public static get HOSHALT(): string {
    return this.appUrl + '/api/v1/trip/hosStoppage'
  }
  // service
  public static get ADDSERVICE(): string {
    return this.appUrl + '/api/v1/service/add'
  }

  public static get LISTSERVICE(): string {
    return this.appUrl + '/api/v1/service/list'
  }
  public static get LISTCONNECTION(): string {
    return this.appUrl + '/api/v1/chat/connectionList1'
  }

  public static get MESSAGELIST(): string {
    return this.appUrl + '/api/v1/chat/getMessagesList'
  }

  public static get ADDCHATUSER(): string {
    return this.appUrl + '/api/v1/chat/addChatUser'
  }

  public static get ADDCHATMESSAGE(): string {
    return this.appUrl + '/api/v1/chat/addMessages'
  }

  public static get UPLOADPOSTIMAGESERVICE(): string {
    return this.appUrl + '/api/v1/event/uploads'
  }

  public static get DELETESERVICE(): string {
    return this.appUrl + '/api/v1/service/delete'
  }

  // public static get EDITSERVICE(): string {
  //   return this.appUrl + '/api/v1/service/update'
  // }

  public static get UPDATESERVICE(): string {
    return this.appUrl + '/api/v1/service/update'
  }

  public static get GETSERVICEDETAILS(): string {
    return this.appUrl + '/api/v1/service/details'
  }

  public static get GETCONNECTIONDETAILS(): string {
    return this.appUrl + '/api/mobile/user/profileWithPost'
  }

  public static get MYCONNECTIONLIST(): string {
    return this.appUrl + '/api/v1/groupinvite/suggestionInviteList'
  }

  // public static get VIEWPOSTLIST(): string {
  //   return this.appUrl + '/api/v1/group/recentGroupList'
  // }
  public static get GETSUBSCRIPTIONPLANLIST(): string {
    return this.appUrl + '/api/v1/subscriptionplan/purchasePlanList'
  }

  public static get GETNOTIFICATIONSLISTS(): string {
    return this.appUrl + '/api/v1/notification/list'
  }
  public static get GETNOTIFICATIONSREAD(): string {
    return this.appUrl + '/api/v1/notification/readSingle'
  }

  public static get MARKALLREAD(): string {
    return this.appUrl + '/api/v1/notification/readAll'
  }
  //

  public static get GETNOTIFICATIONSCOUNT(): string {
    return this.appUrl + '/api/v1/notification/getNotificationCount'
  }
  public static get BOOKEDLIST(): string {
    return this.appUrl + '/api/v1/event/bookedEvent'
  }
  public static get REMOVEDMEMBER(): string {
    return this.appUrl + '/api/mobile/group/removeMember'
  }

  public static get REMOVEDCOONECTION(): string {
    return this.appUrl + '/api/v1/groupinvite/removeGroupInvatation'
  }

  public static get DELETIMAGE(): string {
    return this.appUrl + '/api/v1/post/deleteNetworkImage'
  }
  // DELETVIDEO

  public static get DELETVIDEO(): string {
    return this.appUrl + '/api/v1/user/deleteVideo'
  }

  public static get GETCITYBYZIPCODE(): string {
    return this.appUrl + '/api/v1/user/findCityByZipcode'
  }
  public static get GETTOTALCOUNTLIST(): string {
    return this.appUrl + '/api/v1/subscriptionplan/cartItems'
  }

  public static get DELETECHATDOC(): string {
    return this.appUrl + '/api/v1/chat/deleleDoc'
  }

  // public static get GETVINCODE(): string {
  //   return ''
  // }

  // E-Commerce
  // public static get PRODUCTIMAGESUPLOAD ():string {
  //   return this.appUrl+'/api/v1/product/resizeImages'
  // }
  // public static get ASKQUESTION ():string{
  //   return this.appUrl+'/api/v1/review/addQuestions'
  // }
  // public static get QUESTIONANSWERLIST ():string{
  //   return this.appUrl+'/api/v1/review/questionAnswerlist'
  // }
  // public static get SELLERQUESTIONLIST ():string{
  //   return this.appUrl+'/api/v1/review/questionList'
  // }
  // public static get QUESTIONDATA ():string{
  //   return this.appUrl+'/api/v1/review/questionDetail'
  // }
  // public static get QUESTIONANSWER ():string{
  //   return this.appUrl+'/api/v1/review/AnsweredBySeller'
  // }

  // public static get PRODUCTADMINLIST(): string {
  //   return this.appUrl + '/api/v1/product/productListAdmin'
  // }
  // public static get BRANDLIST(): string {
  //   return this.appUrl+'/api/v1/brand/list'
  // }
  // public static get GETBRANDLIST(): string {
  //   return this.appUrl + '/api/v1/brand/list'
  // }
  // public static get PRODUCTDELELE():string{
  //   return this.appUrl+'/api/v1/product/delete'
  // }
  // public static get GETMODELLIST(): string {
  //   return this.appUrl + '/api/v1/model/list'
  // }
  // public static get GETMANUFACTURLLIST(): string {
  //   return this.appUrl + '/api/v1/manufacture/list'
  // }
  // public static get SUBCATEGORYLIST():string {
  //   return this.appUrl+'/api/v1/category/subCategoryList'
  // }
  // public static get DELETPRODUCT(): string {
  //   return this.appUrl + '/api/v1/product/deleteProductImage'
  // }
  // public static get CREATEPRODUCT(): string {
  //   return this.appUrl + '/api/v1/product/add'
  // }
  // public static get PRODUCTDETAIL(): string {
  //   return this.appUrl + '/api/v1/product/details'
  // }
  // public static get PRODUCTUPDATE(): string {
  //   return this.appUrl + '/api/v1/product/update'
  // }

  public static get GETCATEGORYLIST(): string {
    return this.appUrl + '/api/v1/category/list'
  }
  public static get SUBCATEGORYLIST(): string {
    return this.appUrl + '/api/v1/category/subCategoryList'
  }
  public static get GETMANUFACTURLLIST(): string {
    return this.appUrl + '/api/v1/manufacture/list'
  }
  public static get GETMODELLIST(): string {
    return this.appUrl + '/api/v1/model/list'
  }
  public static get GETBRANDLIST(): string {
    return this.appUrl + '/api/v1/brand/list'
  }
  // public static get GETSUBCATEGORYLIST(): string {
  //   return this.appUrl + '/api/v1/category/subCategoryList'
  // }
  public static get CREATEPRODUCT(): string {
    return this.appUrl + '/api/v1/product/add'
  }
  public static get PRODUCTDETAIL(): string {
    return this.appUrl + '/api/v1/product/details'
  }
  public static get ADDTOWISHLIST(): string {
    return this.appUrl + '/api/v1/wishlist/addWishlist'
  }
  public static get PRODUCTUPDATE(): string {
    return this.appUrl + '/api/v1/product/update'
  }
  public static get ADDCOUPON(): string {
    return this.appUrl + '/api/v1/coupon/addcoupon'
  }
  public static get LISTCOUPON(): string {
    return this.appUrl + '/api/v1/coupon/list'
  }
  public static get ADDTOCART(): string {
    return this.appUrl + '/api/v1/product/addShopingcart'
  }
  public static get CONTACTSELLER(): string {
    return this.appUrl + '/api/v1/contacttosaller/add'
  }
  public static get CONTACTTOSELLER(): string {
    return this.appUrl + '/api/v1/contacttosaller/list'
  }
  public static get SHOWGRAPH(): string {
    return this.appUrl + '/api/v1/review/numberOfQuestion'
  }
  public static get PRODUCTIMAGESUPLOAD(): string {
    return this.appUrl + '/api/v1/product/resizeImages'
  }

  public static get ASKQUESTION(): string {
    return this.appUrl + '/api/v1/review/addQuestions'
  }

  public static get QUESTIONANSWERLIST(): string {
    return this.appUrl + '/api/v1/review/questionAnswerlist'
  }
  public static get OVERALLSELLERRATING(): string {
    return this.appUrl + '/api/v1/product/overAllSellerRating'
  }
  public static get SELLERQUESTIONLIST(): string {
    return this.appUrl + '/api/v1/review/questionList'
  }
  public static get QUESTIONDATA(): string {
    return this.appUrl + '/api/v1/review/questionDetail'
  }
  public static get QUESTIONANSWER(): string {
    return this.appUrl + '/api/v1/review/AnsweredBySeller'
  }
  public static get RATINGTOKEN(): string {
    return this.appUrl + '/api/v1/product/sellerRatingToken'
  }
  public static get RATINGTOKENCHECK(): string {
    return this.appUrl + '/api/v1/product/checkSellerToken'
  }
  public static get SELLERRATING(): string {
    return this.appUrl + '/api/v1/product/sellerRating'
  }
  public static get GETSELLERRATING(): string {
    return this.appUrl + '/api/v1/product/sellerRatingGivenByCustomer'
  }

  public static get PRODUCTADMINLIST(): string {
    return this.appUrl + '/api/v1/product/productListAdmin'
  }
  public static get BRANDLIST(): string {
    return this.appUrl + '/api/v1/brand/list'
  }
  public static get PRODUCTDELELE(): string {
    return this.appUrl + '/api/v1/product/delete'
  }

  public static get BRANDIMAGE(): string {
    return this.appUrl + '/api/v1/event/uploads'
  }
  public static get PRODUCTLIST(): string {
    return this.appUrl + '/api/v1/product/list'
  }

  public static get ADDBRAND(): string {
    return this.appUrl + '/api/v1/brand/add'
  }

  public static get LISTBRAND(): string {
    return this.appUrl + '/api/v1/brand/list'
  }

  public static get EVENTDELET(): string {
    return this.appUrl + '/api/v1/brand/delete'
  }

  public static get FETCHDATA(): string {
    return this.appUrl + '/api/v1/brand/details'
  }

  public static get CHANGEBRAND(): string {
    return this.appUrl + '/api/v1/brand/changeStatus'
  }
  public static get EDITBRAND(): string {
    return this.appUrl + '/api/v1/brand/update'
  }
  public static get ADDMODEL(): string {
    return this.appUrl + '/api/v1/model/add'
  }

  public static get LISTMODEL(): string {
    return this.appUrl + '/api/v1/model/list'
  }
  public static get MODELDELET(): string {
    return this.appUrl + '/api/v1/model/delete'
  }

  public static get CHANGEMODEL(): string {
    return this.appUrl + '/api/v1/model/changeStatus'
  }

  public static get DETAILMODEL(): string {
    return this.appUrl + '/api/v1/model/details'
  }
  // EDITMODEL
  public static get EDITMODEL(): string {
    return this.appUrl + '/api/v1/model/update'
  }
  public static get ADDMANUFACTURE(): string {
    return this.appUrl + '/api/v1/manufacture/add'
  }

  public static get LISTMANUFACTURE(): string {
    return this.appUrl + '/api/v1/manufacture/list'
  }

  public static get MANUFACTUREDELET(): string {
    return this.appUrl + '/api/v1/manufacture/delete'
  }
  public static get CHANGEMANUFACTURE(): string {
    return this.appUrl + '/api/v1/manufacture/changeStatus'
  }

  public static get DETAILMANUFACTURE(): string {
    return this.appUrl + '/api/v1/manufacture/details'
  }

  public static get EDITMANUFACTURE(): string {
    return this.appUrl + '/api/v1/manufacture/update'
  }

  public static get GETCATEGORY(): string {
    return this.appUrl + '/api/v1/category/adminCategoryList'
  }

  public static get ADDCATEGORY(): string {
    return this.appUrl + '/api/v1/category/add'
  }

  public static get LISTCATEGORY(): string {
    return this.appUrl + '/api/v1/category/adminCategoryList'
  }

  public static get CHANGELIST(): string {
    return this.appUrl + '/api/v1/category/changeStatus'
  }
  public static get CATEGORYDELET(): string {
    return this.appUrl + '/api/v1/category/delete'
  }

  public static get GROUPREQUESTLIST(): string {
    return this.appUrl + '/api/mobile/group/requestList'
  }
  public static get GROUPREQUEST(): string {
    return this.appUrl + '/api/mobile/group/requestAdmin'
  }
  // GROUPACCEPT
  public static get GROUPACCEPT(): string {
    return this.appUrl + '/api/mobile/group/requestRespond'
  }
  public static get COMMENTDELETE(): string {
    return this.appUrl + '/api/mobile/comment/delete'
  }
  public static get EDITCOMMENT(): string {
    return this.appUrl + '/api/mobile/comment/edit'
  }
  // EDITDELETE
  public static get CATEGORYDETAIL(): string {
    return this.appUrl + '/api/v1/category/details'
  }

  public static get UPDATECATEGORY(): string {
    return this.appUrl + '/api/v1/category/update'
  }
  // DELETPRODUCT

  public static get DELETPRODUCT(): string {
    return this.appUrl + '/api/v1/product/deleteProductImage'
  }
  public static get SELLERPROFILE(): string {
    return this.appUrl + '/api/v1/user/CreateSellerProfile'
  }
  public static get BECOMESELLER(): string {
    return this.appUrl + '/api/v1/user/becomeASeller'
  }
  public static get QUESTIONDELETE(): string {
    return this.appUrl + '/api/v1/review/questionDelete'
  }
  public static get SELLERREATING(): string {
    return this.appUrl + '/api/v1/'
  }
  public static get GETBLOGLIST(): string {
    return this.appUrl + '/api/v1/blog/getBlogList'
  }
  public static get GETHOMEBLOGLIST(): string {
    return this.appUrl + '/api/v1/blog/homePageBlogs'
  }

  public static get CONTACTUS(): string {
    return this.appUrl + '/api/v1/otherservices/savecontactusdata'
  }
  public static get GETBLOGDETAILS(): string {
    return this.appUrl + '/api/v1/blog/getBlogDetail'
  }
  public static get GETENDUSERSERVICESLIST(): string {
    return this.appUrl + '/api/v1/service/serviceListData'
  }
  public static get SIMILARPRODUCTLIST(): string {
    return this.appUrl + '/api/v1/product/similerProduct'
  }
  //role switch
  public static get SWITCHROLES(): string {
    return this.appUrl + '/api/v1/user/switchUser'
  }
  public static get CHANGEROLE(): string {
    return this.appUrl + '/api/v1/user/switchAccount'
  }
  public static get LEAVECOMPANY(): string {
    return this.appUrl + '/api/v1/userleft/leftUser'
  }
  public static get DELETECOMPANY(): string {
    return this.appUrl + '/api/v1/userleft/deleteUser'
  }
  
  public static get DELETETRIP(): string {
    return this.appUrl + '/api/v1/trip/cancelTrip'
  }

  public static get COMPLETETRIP(): string {
    return this.appUrl + '/api/v1/trip/cancelTrip'
  }
  public static get ATULYA(): string {
    return this.appUrl + '/api/v1/atulya/atulya'
  }

  public static get STARTTRIP(): string {
    return this.appUrl + '/api/v1/trip/cancelTrip'
  }

  public static get GETREASONS(): string {
    return this.appUrl + '/api/v1/leftreason/list'
  }
  public static get GETTRIPCANCELREASONS(): string {
    return this.appUrl + '/api/v1/leftreason/ReasonList'
  }
  public static get LEFTUSERS(): string {
    return this.appUrl + '/api/v1/userleft/leftUserList'
  }
  public static get JOBINVITATION(): string {
    return this.appUrl + '/api/v1/endUser/jobInvite'
  }

  public static get ACCEPTJOBINVITATION(): string {
    return this.appUrl + '/api/v1/endUser/acceptOffer'
  }
  public static get REJECTJOBINVITATION(): string {
    return this.appUrl + '/api/v1/endUser/rejectOffer'
  }
  public static get CHECKJOBTOKEN(): string {
    return this.appUrl + '/api/v1/user/checkOfferToken'
  }

  public static get CHANGEPASSWORD(): string {
    return this.appUrl + '/api/v1/user/changePassword'
  }

  public static get UPDATEDRIVERDOCS(): string {
    return this.appUrl + '/api/v1/endUser/uploadDocs'
  }

  public static get DELETEDRIVERDOCS(): string {
    return this.appUrl + '/api/v1/endUser/deleteDriverDocs'
  }
  public static get ACTIVITYLOGS(): string {
    return this.appUrl + '/api/v1/user/loginHistory'
  }
  public static get ADDPLANTOCART(): string {
    return this.appUrl + '/api/v1/subscriptionplan/planAddToCart'
  }

  public static get SUBPLANLIST(): string {
    return this.appUrl + '/api/v1/subscriptionplan/itemIntoCart'
  }
  public static get GETSELECTEDPLAN(): string {
    return this.appUrl + '/api/v1/subscriptionplan/getSelectedPlan'
  }

  public static get PROMOLIST(): string {
    return this.appUrl + '/api/v1/subscriptionplan/promocodeList'
  }

  public static get CUSTOMPLAN(): string {
    return this.appUrl + '/api/v1/subscriptionplan/getCustomplanData'
  }

  public static get REMOVEPLAN(): string {
    return this.appUrl + '/api/v1/subscriptionplan/removeItemFromCart'
  }
  public static get APPLYPROMOCODE(): string {
    return this.appUrl + '/api/v1/subscriptionplan/applyPromocode'
  }
  public static get REMOVEPROMO(): string {
    return this.appUrl + '/api/v1/subscriptionplan/removePromocode'
  }
  public static get SAVEPAYMENT(): string {
    return this.appUrl + '/api/v1/subscriptionplan/payment'
  }
  public static get UPGRADEPAYMENT(): string {
    return this.appUrl + '/api/v1/subscriptionplan/upgradePayment'
  }

  public static get CUSTOMPAYMENT(): string {
    return this.appUrl + '/api/v1/subscriptionplan/customPlanPayment'
  }
  public static get CUSTOMPAYMENTFOREXISTINGUSER(): string {
    return this.appUrl + '/api/v1/subscriptionplan/updateCustomPlanForExistinguser'
  }

  public static get GETMYPLAN(): string {
    return this.appUrl + '/api/v1/subscriptionplan/myPlan'
  }
  public static get FREESUBSPLAN(): string {
    return this.appUrl + '/api/v1/subscriptionplan/freePayment'
  }

  public static get CHATATTACMENT(): string {
    return this.appUrl + '/api/v1/chat/docUpload'
  }

  public static get GETCONNECTIONLISTCHAT(): string {
    return this.appUrl + '/api/v1/chat/myConnectionList'
  }

  public static get TRUCKNEWS(): string {
    return this.appUrl + '/api/v1/otherservices/news'
  }

  // Chat
  public static get GETTEAMMEMBERFORCHAT(): string {
    return this.appUrl + '/api/v1/chat/getTeamMembers'
  }
  public static get STARTNEWCONVERSATION(): string {
    return this.appUrl + '/api/v1/chat/newConversation'
  }
  public static get GETCHATLIST(): string {
    return this.appUrl + '/api/v1/chat/getMyConversations'
  }
  public static get GETCHATMESSAGES(): string {
    return this.appUrl + '/api/v1/chat/getMessages'
  }
  public static get GETGROUPDETAILSWITHMEMBERS(): string {
    return this.appUrl + '/api/v1/chat/getGroupDetailWithMembers'
  }
  public static get LEAVEORREMOVEGROUP(): string {
    return this.appUrl + '/api/v1/chat/leftOrRemove'
  }
  public static get UPDATEGROUP(): string {
    return this.appUrl + '/api/v1/chat/update'
  }
  public static get MAKEORDISMISSADMIN(): string {
    return this.appUrl + '/api/v1/chat/adminSetting'
  }
  public static get UPDATEGROUPSETTINGS(): string {
    return this.appUrl + '/api/v1/chat/updateSetting'
  }
  public static get MEMBERSTOADDINGROUP(): string {
    return this.appUrl + '/api/v1/chat/teamMemberListForGroup'
  }
  public static get ADDMEMBERTOGROUP(): string {
    return this.appUrl + '/api/v1/chat/addMember'
  }
  public static get DELETEMESSAGE(): string {
    return this.appUrl + '/api/v1/chat/deleteMsg'
  }
  public static get BLOCKUSER(): string {
    return this.appUrl + '/api/v1/chat/blockUser'
  }

  public static get SPECIFICMSGDATA(): string {
    return this.appUrl + '/api/v1/chat/getMyConversationDetails'
  }

  public static get FAQLIST(): string {
    return this.appUrl + '/api/v1/faq/list'
  }

  public static get GPSTRUCKTRAILER(): string {
    return this.appUrl + '/api/v1/truck/driverFleetList'
  }

  public static get GPSROUTECREATE(): string {
    return this.appUrl + '/api/v1/trip/addDriverTrip'
  }
  public static get GPSRECENTTRIPS(): string {
    return this.appUrl + '/api/v1/trip/driverTripHistory'
  }
  public static get DELETEACCOUNT(): string {
    return this.appUrl + '/api/v1/user/deleteUserAccount'
  }

  public static get GETALLSUBSPLANS(): string {
    return this.appUrl + '/api/v1/subscriptionplan/getMyPlans'
  }

  public static get CANCELSUBSPLAN(): string {
    return this.appUrl + '/api/v1/subscriptionplan/cancelPlan'
  }
  public static get POSTLIST(): string {
    return this.appUrl + '/api/mobile/post/details'
  }
  public static get ACCEPTPOLICIES(): string {
    return this.appUrl + '/api/mobile/user/acceptPolicies'
  }
  public static get CHATSALESPERSONLIST(): string {
    return this.appUrl + '/api/v1/chat/salesPersonList'
  }
  public static get PLANSTATUS(): string {
    return this.appUrl + '/api/v1/user/getPlanStatus'
  }
  public static get READEDJOBAPPLIED(): string {
    return this.appUrl + '/api/v1/applicant/isReaded'
  }
  public static get JOBSTATUSUPDATE(): string {
    return this.appUrl + '/api/v1/applicant/updateStatus'
  }
  public static get INVITATIONDELETEBYCOMPANY(): string {
    return this.appUrl + '/api/v1/invitation/invitationDeleteByCompany'
  }
  public static get ADDCARD(): string {
    return this.appUrl + '/api/v1/card/create'
  }
  public static get LISTCARD(): string {
    return this.appUrl + '/api/v1/card/list'
  }
  public static get DEFAULTCARD(): string {
    return this.appUrl + '/api/v1/card/makeCardDefault'
  }
  public static get DELETECARD(): string {
    return this.appUrl + '/api/v1/card/deleteCard'
  }
  public static get ALLPRODUCTLIST(): string {
    return this.appUrl + '/api/v1/product/allProductList'
  }
  public static get INSTALLMENTPLANLIST(): string {
    return this.appUrl + '/api/v1/installment/listInstallmentPlan'
  } 
  public static get INSTALLMENTPLANCREATE(): string {
    return this.appUrl + '/api/v1/installment/payment'
  }
  public static get MULTIPLANINSTALLMENTPLAN(): string {
    return this.appUrl + '/api/v1/multiplanInstallment/list'
  }
  public static get USERINSTALLMENT(): string {
    return this.appUrl + '/api/v1/installment/installmentList'
  }
  
  public static get GETTICKETLIST(): string {
    return this.ticketUrl + '/api/external/ticket/list'
  }
  public static get CREATETICKET(): string {
    return this.ticketUrl + '/api/external/ticket'
  }
  public static get GETTICKETDETAILS(): string {
    return this.ticketUrl + '/api/external/ticket'
  }
  public static get TICKETREPLY(): string {
    return this.ticketUrl + '/api/external/reply'
  }
}  

