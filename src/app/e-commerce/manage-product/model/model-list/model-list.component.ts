import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})
export class ModelListComponent implements OnInit {
  modelData:any
  userObj:any
  userId:any
  term:string
  totalCount
  itemsPerPage = 10
  Page = 1
  constructor(
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) { }
  ngOnInit() {
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id 
    this.getModelList(1)
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  getModelList(Page){
    let data = {
      createdById : this.userId,
      searchText:this.term?this.term:'',
      page: Page,
      count:this.itemsPerPage,
      // isAdminApprove:'APPROVED'
    }   
    this.spinner.show()
    this._generalService.listModel(data).subscribe((res) =>{
      if(res.code = 200){
        this.spinner.hide()
        this.modelData = res.data
        this.totalCount = res['totalCount']
      }
      else{
        this.spinner.hide()
      }
    })
  }
    reset(){
      this.term = '';
      this.Page = 1
      this.getModelList(1);
    }
    pageChanged(Page){
      this.Page = Page
      this.getModelList(Page);
    }
}
