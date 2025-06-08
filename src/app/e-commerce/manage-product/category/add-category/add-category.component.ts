import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router'
import { FormGroup,FormBuilder,Validators} from '@angular/forms'
import {genralConfig} from 'src/app/constant/genral-config.constant'
@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  userId:any
  userObj:any
  addForm:FormGroup
  catergoryListData: any
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
    this.addForm = this.fb.group({
      Category:['',[Validators.pattern(genralConfig.pattern.BACKSPACE), Validators.required, Validators.pattern(genralConfig.pattern.WHITESPACE)]],
      parentCategoryId: ['', [Validators.required]],
    })
    this.catergoryList()
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  catergoryList(){
    let data = {
      parentFlag: "true"
    }
    this._generalService.getCategory(data).subscribe((res) =>{
      this.catergoryListData = res.data      
    })
  }
  submit(){
   if(this.addForm.valid){
    let data ={
      createdById:this.userId,
      category_name :this.addForm.value.Category,
      parentCategoryId:this.addForm.value.parentCategoryId, 
      isAdminApprove:'PENDING'
    }
    this._generalService.addCategory(data).subscribe((res) =>{
      if(res['code'] == 200){
        this.spinner.hide()
        this.toastr.success(res['message'])        
        this.Router.navigate(['/layout/e-commerce/category-list'])
      }
      else{
        this.toastr.warning(res['message'])
        this.spinner.hide()
      }  
    })
   }
  }



}
