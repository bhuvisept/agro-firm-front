import { Component,Inject, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import {Router} from '@angular/router'
import moment from 'moment'
import { SharedService } from 'src/app/service/shared.service'
@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'], 
  providers: [NgxSpinnerService],
})
export class ViewProfileComponent implements OnInit {
  @ViewChild('search', { static: false }) searchElementRef: ElementRef
  formOne: FormGroup
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
  sellerFrmlength = genralConfig.storage.SELLERFROMFIELDS
  counter: number
  yesSelectOptionDropdown = [
    {"title":"Single - member LLC ( Limited liability company)"},
    {"title":"Cooperation / multi - member LLC"},
    {"title":"Partnership"},
    {"title":"Publicly traded company"},
    {"title":"Non - profit"},
]
   constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2, 
    private router :Router,
    private SharedService: SharedService,
  ) { }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.formOne = this.formbuilder.group({
      legalentity:['',Validators.required],
      legalEntityOption: [''],
    })
    this.formTwo = this.formbuilder.group({
      companyName: [''],
      personName: ['',],
      firstName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      lastName: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      email: ['', [Validators.required, Validators.pattern(genralConfig.pattern.EMAIL)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(genralConfig.pattern.PHONE_NO)]],
      dateOfBirth: ['', [Validators.required]],
      ssn: [''],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required,this._generalService.noWhitespaceValidator, Validators.minLength(genralConfig.pattern.MINLENGTH),]],
      address: ['', [Validators.pattern(genralConfig.pattern.BACKSPACE)]],
  })
  this.formThree = this.formbuilder.group({})
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header-for-seller')
    this.getCountry()
    this.minDateOfBirth = moment(new Date()).format('YYYY-MM-DD')
    this.getSeller()
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header-for-seller')
  }
  formOneCheck(){
    if (!this.formOne.valid) {
      this.formOne.controls['legalentity'].markAsTouched()
    }
  }
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
  nameReq(e){
    if(e =='yes'){
      this.formTwo.controls['companyName'].setValidators([  Validators.required])
      this.formTwo.controls['companyName'].updateValueAndValidity()
    }else{
      this.formTwo.controls['companyName'].reset()
      this.formOne.controls['legalEntityOption'].reset()
      this.formTwo.get('companyName').setValidators([]);
      this.formTwo.controls['companyName'].updateValueAndValidity()
    }
  }

  getSeller() {
    let data = { userId: this.userObj.userInfo._id }
    this.spinner.show()
    this._generalService.getSellerDetails(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.spinner.hide()
          this.formTwo.patchValue(response['data'])
          this.formTwo.patchValue(response['data'].sellerData)
          this.formTwo.patchValue({ssn :response['data'].sellerData.ssnNumber})
          this.formOne.patchValue({legalentity:response['data'].sellerData.legalEntity})
          this.formOne.patchValue({legalEntityOption:response['data'].sellerData.legalEntityOption})
          this.legalentity=response['data'].sellerData.legalEntity
          this.country=response['data'].countryName
          this.state=response['data'].statesName
          if(response['data'].sellerData.legalEntity==='yes'){
            this.legalYes=true
            this.yesSelectOption=true
          }else if(response['data'].sellerData.legalEntity==='no'){
            this.legalNo=true
            this.yesSelectOption=false
          }
          if(response['data'].profileComplete){
            this.router.navigate(['/layout/e-commerce/dashboard'])
          }
          this.getState(response['data'].country)
           this.getState(this.state)
        } else {
          this.spinner.hide()
          this.toastr.warning('', response['message'])
          this.spinner.hide()
        }
      },
      (error) => {
        this.spinner.hide()
        this.toastr.error('server error')
      }
    )
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

  checkData(){
    let data = {
      userId:this.userId,
      legalentity  : this.legalentity,
      ...this.formOne.value,
      ...this.formTwo.value,
      profileComplete:true,
      progressBar:this.counter        
    }
  }
  onSubmit(){
    this.formDataOne = this.formOne.value
    this.formDataTwo = this.formTwo.value
    if(this.formOne.valid && this.formTwo.valid){
    this.counter = ((this.sellerFrmlength)*100)/this.sellerFrmlength;
      let data = {
        userId:this.userId,
        legalentity  : this.legalentity,
        ...this.formDataOne,
        ...this.formDataTwo,
        profileComplete:true,
        progressBar:this.counter        
      }
      this.spinner.show()
      this._generalService.sellerProfile(data).subscribe((res)=>{
        if(res['code']==200){
          let userInfo = {}
          userInfo['userInfo'] = res['data'].userInfo         
          this.SharedService.setHeader(userInfo)
          localStorage.setItem('truckStorage', JSON.stringify(userInfo))
          this.spinner.hide()
          this.toastr.success(res['message'])
          this.router.navigate(['/layout/e-commerce/dashboard'])
        }else{
          this.spinner.hide()
          this.toastr.warning(res['message'])
        }
      })
    }
  }
  getName(name){
    this.countryNameDetails = name
  }
  State(name){
    this.stateName=name
  }
}
