import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { MatDialog } from '@angular/material'
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  userId:any
  userObj:any
  term:any
  totalCount
  itemsPerPage = 10
  page = 1
  listcategory: any
  constructor(
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) { }
  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id 
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.getCategoriesList(1)
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  getCategoriesList(page){
    let data ={
      _id:this.userId,
      count:this.itemsPerPage,
      searchText:this.term?this.term:null,
      page:page,
      isAdminApprove:'APPROVED'
    }
    this.spinner.show()
    this._generalService.listCategory(data).subscribe((res) =>{
   if(res.code == 200 ){
    this.spinner.hide()
    this.listcategory = res.data
    this.totalCount = res['totalCount']
   }
  }),(error) => {
    this.spinner.hide()
    this.toastr.error('server error')
  }
  }
    reset(){
      this.term = '';
      this.page = 1
      this.getCategoriesList(1);
    }
  pageChanged(event){
    this.page = event
    this.getCategoriesList(event);  
   
   }
}
