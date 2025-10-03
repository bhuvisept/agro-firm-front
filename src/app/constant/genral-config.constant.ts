import { Subscription } from 'rxjs'
import { environment } from 'src/environments/environment'

export const genralConfig = {
  ticket_config: {
    projectId: "651fdbba94ecdb4a29d37094",
  },
  messages: {
    apiError: 'Something went wrong!',
    startDate: 'Please select start Date',
    formInvalid: 'Please enter mandatory fields',
    imageFormat: 'Only jpeg, png file format are allowed',
    deleteMessage: 'Are you sure you want to delete this information?',
  },

  serverImageUrl: {
    profile: '/upload/profiles/thumbnail/',
  },

  networkImages: {
    network_image: environment.URLHOST + '/uploads/post/image/',
    network_video: environment.URLHOST + '/uploads/post/video/',
  },
  commentCount: 5,

  pattern: {
    NAME: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
    NAMENumber: /^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9]*)*$/,
    CLAIMNUMBER: /^[ A-Za-z0-9]*$/,
    REPORTNAME: /^[ A-Za-z]*$/,
    CODE: /^[ A-Za-z_@./#&+-/'/"]*$/,
    DURATION: /^[0-9]{0,3}$/,
    PRICING: /^[0-9.]{0,30}$/,
    CITY: /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/,
    EMAIL: /^(([^<>()\[\]\\.,,:\s@"]+(\.[^<>()\[\]\\.,,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    POSTAL_CODE: /^\d{5}-\d{4}|\d{4}|[A-Z]\d[A-Z] \d[A-Z]\d$/,
    PHONE_NO: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,4}$/,
    FIRM_NUMBER: /^[a-z0-9\-]+$/,
    ALPHANUM: /^[a-zA-Z0-9]+$/,
    MOB_NO: /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$#!%*?&])[A-Za-z\d$@#$!%*?&]{6,}/,
    DESCRIPTION: /^[ !@#$%^&*()~:;{}?'"=<>A-Za-z0-9_@./#&+-,-]*$/,
    REFNO: /^[ 0-9_@./#&+-,-]*$/,
    TASK_CODE: /^[0-9999]{1,4}$/,
    SUB_DOMAIN: /^[/a-z/A-Z][a-zA-Z0-9-]*[^/-/./0-9]$/,
    PHONE_NO_MASK: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    IVR_ACTION_KEY: /^[0-9]*$/,
    IVR_NUMBER: /^[1-9]*$/,
    RADIUS: /^[0-9]*(?:.)([0-9])+$/,
    LATLONG: /^\s*(\-?\d+(\.\d+)?)$/,
    SSN: /^((\d{3}-?\d{2}-?\d{4})|(X{3}-?X{2}-?X{4}))$/,
    SSN_MASK: [/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    PRACTICE_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
    USERNAME: /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){1,14}[a-zA-Z0-9]$/,
    USERNAME_MIN_SIZ: /^[a-zA-Z0-9_](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9_]){4,18}[a-zA-Z0-9_]$/,
    WICARE_USERNAME: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{1,}/,
    YEAR_MASK: /d{4}/,
    PRODUCTVIN_MIN_SIZ: /^[a-zA-Z0-9_](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9_]){1,17}[a-zA-Z0-9_]$/,
    PRODUCTIVE_MAX_SIZ: /^[a-zA-Z0-9]{17,}$/,
    PRODUCTMILEAGEMIN_SIZ: /^[0-9](?![\s-])[\w\s-]+$/,
    PRODUCTPRICE_SIZ: /^[1-9.]{0,30}(?![\s-])[\w\s-]+$/,
    PRODUCTLENGTH_SIZ: /^[1-9.]{0,30}(?![\s-,s+])[\w]+$/,
    DECIMAL: /\d+(\.\d{1,2})?/,
    NUMBERnDECIMAL: '^\\d+(\\.\\d+)?$',
    WHITESPACE: /^(?![\s-])[\w\s-]+$/,
    FIRSTSPACE: /^(?=\S+)(?=[a-zA-ZàáâäãåèéêëìíîïòóôöõøùúûüÿýñçčšžÀÁÂÄÃÅÈÉÊËÌÍÎÏÒÓÔÖÕØÙÚÛÜŸÝÑßÇŒÆČŠŽ∂ð ,.'-]*$).*(?=\S).$/,
    MAXLENGTH: /^.{1,10226}$/,
    MINLENGTH: 3,
    PASSWORDMINLENGTH: 6,
    PASSWORDMAXLENGTH: 15,
    MINIMUMVACANCY: 1,
    MAXIMUMVACANCY: 2,
    BACKSPACE: /^((?!\s{2,}).)*$/,
    // BACKSPACE:.*\\S.*[a-zA-z0-9 ],
    URL:
      '^(https?:\\/\\/)?' + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + '((\\d{1,3}\\.){3}\\d{1,3}))' + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + '(\\?[;&a-z\\d%_.~+=-]*)?' + '(\\#[-a-z\\d_]*)?$',
  },

  eventPaginator: {
    COUNT: 4,
    PAGE: 1,
  },
  enevtPageNationConfig: {
    itemsPerPage: 4,
    currentPage: 1,
  },
  paginator: {
    COUNT: 10,
    PAGE: 1,
  },


  pageNationConfig: {
    itemsPerPage: 10,
    currentPage: 1,
  },

  rolename: {
    USER: 'USER',
    ENDUSER: 'ENDUSER',
    SELLER: 'SELLER',
  },

  statusCode: {
    ok: 200,
    unauth: 401,
    warning: 404,
    validation: 400,
    failed: 1002,
    invalidURL: 1001,
    paymentReq: 402,
    internalError: 1004,
    forbidden: 403,
    internalservererror: 500,
    alreadyExist: 409, //conflict
    Completed: 'Completed',
    Cancelled: 'Cancelled',
  },

  gender: [{ gender: 'Male' }, { gender: 'Female' }, { gender: 'Others' }],

  maritalStatus: [{ maritalStatus: 'Married' }, { maritalStatus: 'Single' }, { maritalStatus: 'Others' }],
  inStockList: [{ name: 'No' }, { name: 'Yes' }],
  document_extension_array: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],

  passwordCreatedmessage: 'Password created sucessfully',
  Interested: 'Interested',
  statusList: [
    { value: 'true', name: 'Active' },
    { value: 'false', name: 'In-active' },
  ],
  deleteArray: [
    { value: 'true', name: 'Archived' },
    { value: 'false', name: 'Unarchived' },
  ],

  subscriptionPlan: {
    planExpireIn: 7,
  },

}
