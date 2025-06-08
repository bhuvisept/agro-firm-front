import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router'
import { FormGroup,FormBuilder,Validators} from '@angular/forms'
import {genralConfig} from 'src/app/constant/genral-config.constant'
@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.css']
})
export class AddModelComponent implements OnInit {
  userObj:any
  userId:any
  addForm:FormGroup
  name:any
  fileData:any
  eventImg:any
  listData: any
  constructor(
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private Router: Router,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private fb:FormBuilder
  ) { }
  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id  
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')

    this.addForm=this.fb.group({
      Model:['',[Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.required, Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      brandId:['',Validators.required]
    })
    this.getBrandList()
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  getBrandList(){
    this.spinner.show()
    let data = {
      createdById : this.userId,
      isActive:'true',
      isDeleted:'false',
      isAdminApprove:'APPROVED'
    }
    this._generalService.listBrand(data).subscribe((res) =>{
      this.listData = res['data']      
      this.spinner.hide()       
    })
  }
  submit(){
    if(this.addForm.valid){
    let data ={
      title:this.addForm.value.Model,
      brandId:this.addForm.value.brandId,
      createdById:this.userId, 
      isAdminApprove:'PENDING'
    }
    this.spinner.show()
    this._generalService.addModel(data).subscribe((res) =>{
      if(res['code'] == 200){
        this.spinner.hide()
        this.toastr.success(res['message'])        
        this.Router.navigate(['/layout/e-commerce/model-list'])
      }
      else{
        this.toastr.warning(res['message'])
        this.spinner.hide()
      }      
    }),(error) => {
      this.toastr.error('server error')
    }
    }
  }




}
