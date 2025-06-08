import { Component,Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
@Component({
  selector: 'app-quries',
  templateUrl: './quries.component.html',
  styleUrls: ['./quries.component.css']
})
export class QuriesComponent implements OnInit {
  userObj: any
  userId: any
  contactToSellerList: any
  totalCount: any
  page: number = 1
  itemsPerPage = genralConfig.pageNationConfig.itemsPerPage
  noRecordFound: boolean = true;
  statusArray = [
    {value:'true', name:"Active"},
    {value:'false', name:"In-Active"}
  ];
  deleteArray = [
    {value:'true', name:"Deleted"},
    {value:'false', name:"Not Deleted"}
  ]
  postCount: any
  search: string;
  constructor(
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2, 
  ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.getProductQuriesList(1)
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  getProductQuriesList(pageNumber){
    this.spinner.show()
    let data = {
      count: genralConfig.paginator.COUNT,
      page: pageNumber, 
      seller_id: this.userId ,
      searchText: this.search ? this.search : '',
    }
    this._generalService.contactToSeller(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.contactToSellerList = response['data']
        this.totalCount = response['totalCount'];
        this.page = pageNumber
        this.postCount=response['count']
        if (this.contactToSellerList.length) {
          this.noRecordFound = false;
        } else {
          this.noRecordFound = true;
        }
        this.spinner.hide()
      } else {
        this.spinner.hide()
        this.toastr.error(response['message'])
      }
    })
  }
  pageChanged(e){}
  currentPage(event) {
    this.page = event
    window.scroll(0, 0);
    this.getProductQuriesList(event);
  }
  reset() {
    this.search = '';
    this.getProductQuriesList(1);
  }
}
