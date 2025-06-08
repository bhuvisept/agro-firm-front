import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { environment } from 'src/environments/environment'
import { MatDialog } from '@angular/material'
@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {
  [x: string]: any
  userId:any
  userObj:any
  term:any
  totalCount
  noRecordFound
  itemsPerPage = 10
  Page = 1
  listData
  createdid
  brandLogo =  environment.URLHOST+'/uploads/brand/'
  constructor(
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) { }
  ngOnInit() {    
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id 
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.getBrandList(1)
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  getBrandList(Page){
    this.spinner.show()
    let data = {
      count:this.itemsPerPage,
      page: Page,
      // isAdminApprove:'APPROVED',
      createdById : this.userId,
      searchText:this.term?this.term:null,
    }
    this._generalService.listBrand(data).subscribe((res) =>{
      this.listData = res['data']
      this.totalCount = res['totalCount']
      this.spinner.hide()       
    })
  }
  pageChanged(event){
    this.getBrandList(event);  
    this.Page = event
   }
   reset(){
    this.term = '';
    this.Page = 1
    this.getBrandList(1);
  }
}
