import { Component, Inject, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { genralConfig } from 'src/app/constant/genral-config.constant';
import { MatDialog } from '@angular/material';
import {ToastrService} from 'ngx-toastr'
import {QueryFormConfirmationDialogComponent} from '../../../app/query-form-confirmation-dialog/query-form-confirmation-dialog.component'

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  selectOption = [
      {value:'SUBSCRIPTION PLAN', name:"Subscription Plan"},
      {value:'OTHER', name:"Other"}
  ]
  planList = [
    {value:'ECOMMERCE', name:"E-Commerce"},
    {value:'EVENT', name:"Event"},
    {value:'JOB', name:"Job"},
    {value:'SERVICE', name:"Services"},
    {value:'TRIP PLANNER', name:"Trip Planner"},
    {value:'WEATHER', name:"Weather"}
  ]
  selectedsss = []
  contact= new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(genralConfig.pattern.NAME), Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.pattern(genralConfig.pattern.WHITESPACE)]),
    email: new FormControl('', [Validators.required, Validators.pattern(genralConfig.pattern.EMAIL)]),
    phone:new FormControl('',[Validators.pattern(genralConfig.pattern.PHONE_NO)]) ,
    queryType:new FormControl('',[Validators.required]),
    companyName:new FormControl(''),
    planOption:new FormControl(''),
    description:new FormControl('',[Validators.required]),
  })
  isSelectOption: any;
  isSelectPlan: any;
  constructor(
    private spinner: NgxSpinnerService,
    private toastr:ToastrService,
    private service :GeneralServiceService, 
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    window.scroll(0,0);
  }
  nameReq(e){
    if(e =='yes'){
      this.contact.controls['companyName'].setValidators([  Validators.required])
      this.contact.controls['companyName'].updateValueAndValidity()
      this.contact.controls['planOption'].setValidators([  Validators.required])
      this.contact.controls['planOption'].updateValueAndValidity()
    }else{
      this.contact.controls['companyName'].reset()
      this.contact.get('companyName').setValidators([]);
      this.contact.controls['companyName'].updateValueAndValidity()
      this.contact.controls['planOption'].reset()
      this.contact.get('planOption').setValidators([]);
      this.contact.controls['planOption'].updateValueAndValidity()
    }
  }
  radioChange(e){
    this.isSelectOption = e.value
  
  }
  changeClient(e){
    this.isSelectPlan = e.value
  }
  onSubmit(){
    if (!this.contact.valid) {
      this.contact.controls['name'].markAsTouched()
      this.contact.controls['email'].markAsTouched()
      this.contact.controls['phone'].markAsTouched()
      this.contact.controls['companyName'].markAsTouched()
      this.contact.controls['queryType'].markAsTouched()
      this.contact.controls['planOption'].markAsTouched()
      this.contact.controls['description'].markAsTouched()
    }
    if(this.contact.valid){
      this.spinner.show();
      this.service.contactUs(this.contact.value).subscribe((res)=>{
        if(res['code']==200){
          this.contact.reset()
          const dialogRef = this.dialog.open(QueryFormConfirmationDialogComponent, {
            width: '550px',
          });
          this.spinner.hide();
        }else{
          this.spinner.hide()
        }
      })  
    }else{
      this.spinner.hide();
    }
  }
}
