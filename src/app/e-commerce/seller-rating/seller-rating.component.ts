import { Component, OnInit ,Inject ,Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-seller-rating',
  templateUrl: './seller-rating.component.html',
  styleUrls: ['./seller-rating.component.css']
})
export class SellerRatingComponent implements OnInit {
  selectedValue: number;
  ratings:any
  userObj: any;
  userId: any;
  noRecordFound:any
  itemsPerPage = genralConfig.pageNationConfig.itemsPerPage
  createdById:any
  ratingType: any = "PRODUCT"
  currentRating: any = "PRODUCT"
  totalCount: any
  page = 1
  pageNumber=1
  search:''
  ratingTypes = [
    {value:'PRODUCT', name:"Product"},
    {value:'SELLER', name:"Seller"}
  ]
 
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    private service :GeneralServiceService
  ) { }
  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))

    // changes by shivam kashyap 07/12/2022   (&& this.userObj.userInfo.accessLevel != 'SALESPERSON' and else condition )
    if (this.userObj.userInfo && this.userObj.userInfo._id && this.userObj.userInfo.accessLevel != 'SALESPERSON') {
      this.userId = this.userObj.userInfo._id
    }
    else {
      this.createdById = this.userObj.userInfo.createdById
    }
    this.sellerRating(1)
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header-for-seller')
  }
  sellerRating(pageNumber:any){
    
    // changes by shivam kashyap 07/12/2022

    let data ={
      count:  this.itemsPerPage,
      page:  pageNumber,
      searchText:this.search,
      sellerId:this.userId ? this.userId : this.createdById,
      ratingType:this.ratingType
    }
  
    this.service.getSellerRating(data).subscribe((res)=>{
      this.ratings=res['data']
      this.totalCount = res['totalCount']
      this.noRecordFound =res['data'].length
    })
  }
  savePageChanged(e) {
    this.page = e
    this.sellerRating(this.page)
  }
  searchData(){

    this.currentRating = this.ratingType
    this.sellerRating(1)

  }

  pageChanged(event){
    this.page = event
    this.sellerRating(this.page)

   }
  reset(){
    this.ratingType='PRODUCT'
    this.search= ''
    this.sellerRating(1)
  }
  productView(id){
    this.router.navigate(['/layout/e-commerce/product-view/'+id ])
  }
}
