import { Component,Inject, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import {Router} from '@angular/router'
import moment from 'moment'
import { genralConfig } from 'src/app/constant/genral-config.constant'
@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
  providers: [NgxSpinnerService],
})
export class UpdateProfileComponent implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef
  formTwo: FormGroup
  formThree:FormGroup
  status: String
  countryList: any
  countryId: String
  stateList: any
  yesSelectOption:boolean= true
  formDataOne: any
  formDataTwo: any
  data:any = {}
  legalentity:any
  userObj: any
  userId: any
  countryNameDetails = ''
  stateName: any
  minDateOfBirth: string
  public disabled = false
  public date: moment.Moment
  country: any
  state: any
  legalYes: boolean
  legalNo: boolean
  zipcode: any
  validZipCode : any
  sellerData: any
  viewSSN:boolean=false
  ssnrandom:string = ""
  defaultLanguages = genralConfig.defaultLanguage
  ssnLength: any
   constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2, 
    private router :Router,
  ) { }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.formTwo = this.formbuilder.group({
      companyName: [{ value: '', disabled: true }],
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      mobileNumber: [{ value: '', disabled: true }],
      dateOfBirth: [{ value: '', disabled: true }],
      ssn: [{ value: '', disabled: true }],
      country: [{ value: '', disabled: true }],
      state: [{ value: '', disabled: true }],
      city: [{ value: '', disabled: true }],
      postalCode: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
      defaultLanguage : [{ value : "" , disabled : true }]
  })
  this.formThree = this.formbuilder.group({})
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.getCountry()
    this.minDateOfBirth = moment(new Date()).format('YYYY-MM-DD')
    this.getSeller()

  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  yesSelectOptionDropdown = [
        {"title":"Single - member LLC ( Limited liability company)"},
        {"title":"Cooperation / multi - member LLC"},
        {"title":"Partnership"},
        {"title":"Publicly traded company"},
        {"title":"Non - profit"},
  ]
  getCountry() {
    let data = {
      isActive: this.status ? this.status : 'true',
    }
    this._generalService.getCountryList(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.countryList = res['data']
        }
      }
    ),
    (error) => {
      this.toastr.error('server error')
    }
  }

  showSSN(){
    this.viewSSN = !this.viewSSN
  }

  getselectval(val) {
    this.countryId = val
    if (this.countryId) {
      this.getState(this.countryId)
    }
  }
  getState(countryId) {
    this._generalService.getStateList({ countryId: countryId, isActive: 'true' }).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.stateList = res['data']
        } 
      }
    ),
    (error) => {
      this.toastr.error('server error')
    }
  }
  yesLegalEntity(e) {
    this.yesSelectOption = true
    this.legalentity=e.value
  }
  noLegalEntity(e) {
    this.yesSelectOption = false
    this.legalentity=e.value
    this.formTwo.value.legalEntityOption=''
  }

  getSeller() {
    let data = { userId: this.userObj.userInfo._id }
    this.spinner.show()
    this._generalService.getSellerDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          console.log(response['data'])
          this.formTwo.patchValue(response['data'])
          this.formTwo.patchValue(response['data'].sellerData)
          this.formTwo.patchValue({ssn :response['data'].sellerData.ssnNumber})
          this.ssnLength = this.formTwo.value.ssn.length
          console.log(this.ssnLength)
          this.ssnrandom = new Array(this.ssnLength + 1).join( "*" );
          this.legalentity=response['data'].sellerData.legalEntity
          this.sellerData=response['data'].sellerData
          this.country=response['data'].countryName
          this.state=response['data'].statesName
          if(response['data'].sellerData.legalEntity=='yes'){
            this.legalYes=true
            this.yesSelectOption=true
          }else{
            this.legalNo=true
            this.yesSelectOption=false
          }
          this.getState(response['data'].country)
           this.getState(this.state)
           this.spinner.hide()
        } else {
          this.toastr.warning('', response['message'])
          this.spinner.hide()
        }
      }
    ),
    (error) => {
      this.spinner.hide()
      this.toastr.error('server error')
    }
  }
  getCityByZipcode() {
    this.spinner.show();
    let data = { zipcode: this.zipcode }
    this._generalService.getCityByZipcode(data).subscribe(
      (res) => {
        this.spinner.hide();
        if(res['code']==200){
          this.validZipCode = res['data'].city
          this.formTwo.patchValue({city:res['data'].city , postalCode : res['data'].zip})
          this.formTwo.patchValue({city:res['data'].city,  postalCode : res['data'].zip})  
        }else{
          this.toastr.warning(res['message']);
          this.formTwo.patchValue({city:'' , postalCode:'' })
          this.formTwo.patchValue({city:'' ,postalCode:''  })
          return false
        }
      }
    ),
    (error) => {
      this.toastr.error('server error')
    }
  }
  onSubmit(){
    this.formDataTwo = this.formTwo.value
    if(this.legalentity && this.formTwo.valid){
      let data = {
        userId:this.userId,
        legalentity  : this.legalentity,
        ...this.formDataOne,
        ...this.formDataTwo,
        profileComplete:true
      }
      this.spinner.show()
      this._generalService.sellerProfile(data).subscribe((res)=>{
        if(res['code']=200){
          this.spinner.hide()
          this.toastr.success(res['message'])
          this.router.navigate(['/layout/e-commerce/dashboard'])
        }else{
          this.spinner.hide()
        }
      }),
      (error) => {
        this.toastr.error('server error')
      }
    }
  }
  getName(name){
    this.countryNameDetails = name
  }
  State(name){
    this.stateName=name
  }
}

