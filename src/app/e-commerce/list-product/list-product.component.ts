import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormControl } from '@angular/forms'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import{BrandDeletConfirmationComponent} from '../manage-product/brand/brand-delet-confirmation/brand-delet-confirmation.component'
import { MatDialog } from '@angular/material'
import {PlanConfirmationDialogComponent} from "src/app/plan-confirmation-dialog/plan-confirmation-dialog.component"
import {UpgradeConfirmationDialogComponent} from "src/app/upgrade-confirmation-dialog/upgrade-confirmation-dialog.component"
@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css'] 
})
export class ListProductComponent implements OnInit {
  userObj: any
  userId: void
  productList: any
  totalCount: any
  page: number = 1
  itemsPerPage = genralConfig.pageNationConfig.itemsPerPage
  noRecordFound: boolean = true;
  postCount: any;
  pagi:boolean = false
  isDeleted: any = "false";  
  search: string;
  public productImgPath = environment.URLHOST + '/uploads/product/image/'
  // public productImgPathMedium = environment.URLHOST + '/uploads/product/image/thumbnail_1100X685/'
  // public productImgPathLarge = environment.URLHOST + '/uploads/product/image/thumbnail_1100X685/'
  public isActive: String = "true";
  categoryList: any
  deleteArray = [
    {value:'true', name:"Archive"},
    {value:'false', name:"Unarchive"}
  ]
  planInfo: any
  planNoOfProduct: any
  ecommerceLength: any
  totalPlan: any
  currentPlan: any
  innerPlanKey: any =[]
  IsExist: any
  constructor(
    private _generalService: GeneralServiceService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2, 
    private dialog: MatDialog,
  ) { }
  category=new FormControl();

  ngOnInit() {
    window.scroll(0, 0);
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.planInfo = this.userObj.userInfo.planData
    this.userId = this.userObj.userInfo._id
    if(this.planInfo.length > 0){
      let ecommercePlanInfo =  this.planInfo.filter((planDtl)=> planDtl.plan == 'ECOMMERCE' ||  planDtl.plan == 'CUSTOM PLAN')
      this.ecommerceLength = ecommercePlanInfo.length
      if(ecommercePlanInfo.length){
        // let ecommerceConstName =  ecommercePlanInfo[0].features.filter(function(data) {return data.constName == "NOOFPRODUCTS";});
        let ecommerceConstName =  ecommercePlanInfo.forEach(element => {
          let featureArray =   element.features
          featureArray.forEach(ele => {
          this.innerPlanKey.push(ele.constName)   
          });
         })
      this.IsExist = this.innerPlanKey.includes("NOOFPRODUCTS")
        if(ecommerceConstName){
          this.planNoOfProduct = ecommerceConstName[0].keyValue
        }
      }
    }
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')

    let manageProduct  = JSON.parse(localStorage.getItem('manageProduct'))
if(manageProduct != null){
  this.category.setValue(manageProduct.categoryId) 
  this.isDeleted = manageProduct?manageProduct.isDeleted:"false";  
  this.search = manageProduct?manageProduct.searchText:"";  
}

    this.getProductList(1)
    this.getCategoryList()
  }
  getCategoryList(){
    let data = {
      parentFlag:'true',
      isActive:'true'
    }
    this._generalService.getCategoryList(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.categoryList = response['data']
      }
    })
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  deleteProduct(id) {
      const dialogRef = this.dialog.open(BrandDeletConfirmationComponent, {
      width: '450px',
      data:'ECOMMERCE'
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show()
        this._generalService.productDelete({ id: id }).subscribe((res: any) => {
          this.spinner.hide()
          if (res['code'] == 200) {
            this.spinner.hide()
            this.getProductList(1)
          } else {
            this.spinner.hide()
            this.toastr.error(res.message)
          }
        })
      }
    }),(error) => {
      this.spinner.hide()
      this.toastr.error('server error')
    }
  }

  searchData(){
    let data = {
      count: this.itemsPerPage,
      page: 1, 
      categoryId:this.category.value,
      searchText: this.search ? this.search : '',
      isDeleted: this.isDeleted ? this.isDeleted : "false",
      isActive: this.isActive ? this.isActive : "true",
    }

    if (this.userObj.userInfo.roleId.roleTitle == 'SELLER') {
      data['companyId']= this.userId
    } else {
      data['companyId'] = this.userObj.userInfo.createdById
    }

     localStorage.setItem('manageProduct', JSON.stringify(data))
     this.getProductList(1)  

  }
  getProductList(pageNumber) {
    
    let manageProducts  = JSON.parse(localStorage.getItem('manageProduct'))

    let data = {
      count: manageProducts ? manageProducts.count : this.itemsPerPage,
      page: manageProducts ? manageProducts.page : pageNumber,
      categoryId: manageProducts ? manageProducts.categoryId : this.category.value,
      searchText: manageProducts ? manageProducts.searchText : this.search ? this.search : '',
      isDeleted: manageProducts ? manageProducts.isDeleted : this.isDeleted ? this.isDeleted : 'false',
      isActive: manageProducts ? manageProducts.isActive : this.isActive ? this.isActive : 'true',
    }

    if (this.userObj.userInfo.roleId.roleTitle == 'SELLER') {
      data['companyId']= manageProducts?manageProducts.companyId :  this.userId
    } else {
      data['companyId'] = manageProducts?manageProducts.companyId:this.userObj.userInfo.createdById
    }
    this.spinner.show()

    
    this._generalService.getProductAdminList(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        console.log(response);
        
        this.spinner.hide()
        this.productList = response['data']
        this.totalCount = response['totalCount'];
        this.postCount=response['count']
        if (this.productList.length) {
          this.noRecordFound = false;
        } else {
          this.noRecordFound = true;
        }
      } 
    }),(error) => {
      this.spinner.hide()
      this.toastr.error('server error')
    }
  }

  createProduct(){
   if(this.userObj.userInfo.accessLevel !='SALESPERSON'){

     if(!this.planInfo || this.planInfo.length == 0 || this.ecommerceLength ==  0 || !this.IsExist){
      const dialogRef = this.dialog.open(PlanConfirmationDialogComponent, {
        width: '550px',
        data:'ECOMMERCE'
      });
    }else if( this.totalCount ===  this.planNoOfProduct ){

      const dialogRef = this.dialog.open(UpgradeConfirmationDialogComponent, {
        width: '550px',
      });
    }else{
      this.router.navigate(['/layout/e-commerce/create-product']);
    }
   }else{

    
    let data ={companyId:this.userObj.userInfo.companyId}
 this._generalService.PlanStatus(data).subscribe(
   (res) => {
     if (res['code'] == 200) {
      
       if(res['data'].ECOM=='OK'){
         this.router.navigate(['/layout/e-commerce/create-product'])
   }else{
     this.dialog.open(PlanConfirmationDialogComponent, { width: '550px', data: res['data'].ECOM })
   }
       
     }
     this.spinner.hide()
   },
   () => this.spinner.hide()
 )
 }
   
  }
  pageChanged(event) {
    this.page = event
    window.scroll(0, 0);
    this.getProductList(this.page);
  }
  searchByCategory(e){
    console.log(e);
    
    this.getProductList(this.page)
  }
  reset() {
    this.search = '';
    this.isActive = 'true';
    this.isDeleted = "false";
    this.category.reset()
    localStorage.removeItem('manageProduct')

    this.getProductList(1);
  }
}
