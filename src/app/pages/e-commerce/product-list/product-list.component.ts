import { Component, OnInit} from '@angular/core';
import { genralConfig } from 'src/app/constant/genral-config.constant';
import { GeneralServiceService } from 'src/app/core/general-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {FormControl} from '@angular/forms';
import { Options, LabelType  } from "@angular-slider/ngx-slider";
import {ToastrService} from 'ngx-toastr'
import {ActivatedRoute ,Router} from '@angular/router'
import { MatDialog } from '@angular/material';
import { environment } from 'src/environments/environment';
import {ContactForSellerDialogComponentComponent} from '../contact-for-seller-dialog-component/contact-for-seller-dialog-component.component'

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  operProductFilter: boolean = false;
  input
  totalResult: number;
  allBrands: any;
  brandSearch: any = [];
  page:any=1;
  data: any;
  indexof: any;
  searchText: any;
  CondiSearch:any[] = [];
  allProducts: any []=[];
  minPrice: any;
  maxPrice: any;
  minYear: any;
  maxYear: any;
  itemsPerPage = genralConfig.paginator.COUNT;
  panelOpenState = false;
  public productImgPath = environment.URLHOST + '/uploads/product/image/thumbnail_245X245/'

  uncheck;
  fuleList = [
    'Disel',
    'Petrol'
  ]
  conditionList = [
    { name: 'Used', value: 'Used' ,checked:false},
    { name: 'New', value: 'New' ,checked:false},
  ]
  brand = new FormControl();
  country=new FormControl();
  category=new FormControl();
  subCategory=new FormControl()
  model= new FormControl()

  minValue: number=0
  maxValue: number=0


  //price slider
  options: Options = {
    floor: 0,
    ceil: 100000,
    translate: (value: number, label: LabelType,): string => {
      switch (label) {
        case LabelType.Low:
          this.minPrice=value
          return value+'';
        case LabelType.High:
          this.maxPrice=value
          return value+ '';
         default:
          // this.minPrice=''
          // this.maxPrice=''
          return value +''  ;
      }
    }
  };
  currentYear=new Date().getFullYear()

  minvalue: number=1990
  maxvalue: number=this.currentYear

  Options: Options = {
    floor: 1990,
    ceil: this.currentYear,
    translate: (VALUE: number, LABEL: LabelType,): string => {
      switch (LABEL) {
        case LabelType.Low:
          this.minYear=VALUE
          return "" + VALUE+"Yrs.";
        case LabelType.High:
          this.maxYear=VALUE
          return "" + VALUE+"Yrs.Condition";
         default:
          // this.minPrice=''
          // this.maxPrice=''
          // return "$" + VALUE;
      }
    }
  };
  categoriesList: any;
  subcategoryList: any;
  allModels: any;
  categoryId: any;
  categoryName: any;
  userObj: any;
  userId: any
  roleTitle: any;

 
  constructor(
    private service: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr:ToastrService,
    private route :ActivatedRoute,
    private dialog: MatDialog,
    private router:Router
  ) { }
  ngOnInit() {
    this.route.params.subscribe((res)=>{
      this.categoryId=res.id
      this.categoryDetail(this.categoryId)
    })
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))

    if (userData && userData.userInfo) {
      this.roleTitle = userData.userInfo.roleId.roleTitle
      if(this.roleTitle == 'SELLER'){
       return  this.router.navigate(['/login'])
      }      
    }
    if (userData && userData.userInfo) {
      this.userId = userData.userInfo._id;
    }

    this.subCategoryList()
    this.productlist(this.page)
    this.brandlist()
    this.modelList()

  }


  checkList = [
    "All",
    "Belgium",
    "Czech Republic",
    "Germany",
    "Hungary",
    "NetherLand",
  ]

  brandCheck(event) {
      this.productlist(this.page)
  }

  brandDrop(id){
    this.brandSearch.splice(0,this.brandSearch.length,id)
    this.productlist(this.page)
  }

  conditionCheck(value, event){
    if (event.checked == true && value) {
      this.CondiSearch.push(value)
    }
    if (event.checked === false && this.CondiSearch.length) {
      this.indexof = this.CondiSearch.indexOf(value)
      this.CondiSearch.splice(this.indexof, 1)
    }

  }
  pagechange(event){
    this.page=event
    this.productlist(event);  
}

addToCart(id){
  if(!this.userId){
    const dialogRef = this.dialog.open(ContactForSellerDialogComponentComponent, {
      width: '400px',
    })
    dialogRef.afterClosed().subscribe((response) => {})
    return ;
  }
  let data ={
    productId:id,
    quantity:1,
    userId:this.userId
  }
 this.service.productAddToCart(data).subscribe((res)=>{
  if (res['code'] == 200) {
    this.toastr.success(res['message'])
    this.spinner.hide()
  } else {
    this.spinner.hide()
    this.toastr.warning(res['code'])
  }
 })

}


  productlist(page){
    this.spinner.show()
    let data = {
      isActive: 'true',
      isDeleted: 'false',
      searchText: this.searchText,
      brandId:this.brand.value?this.brand.value:[],
      condition: this.CondiSearch.length ? this.CondiSearch : [],
      minPrice:this.minPrice?this.minPrice:'',
      maxPrice:this.maxPrice?this.maxPrice:'',
      minYear:this.minYear?this.minYear:1990,
      maxYear:this.maxYear?this.maxYear:this.currentYear,
      categoryId:this.categoryId?this.categoryId:'',
      subCategory:this.subCategory.value?this.subCategory.value:'',
      modelId:this.model.value?this.model.value:'',
      page:page,
      count:this.itemsPerPage,
      userId: this.userId
    }

    this.service.productList(data).subscribe((res) => {
      if (res['code'] == genralConfig.statusCode.ok) {
        this.allProducts = res['data']
        this.totalResult=res['totalCount']
        window.scroll(0,0)
        this.spinner.hide()
      } else {
        this.spinner.hide()
      }
    })
  }
  
  
  categoryDetail(id){
    let data={
      _id:id
    }
    this.service.CategoryDetail(data).subscribe((res)=>{
      if(res['code']==genralConfig.statusCode.ok){
        this.categoryName=res['data'].category_name
      }
    })
  }

  brandlist() {
    let data = {
      sortValue: 'brand',
      sortOrder: 1,
      isActive: 'true',
      isDeleted: 'false',
      isAdminApprove:'APPROVED'
      }
    this.service.getBrandList(data).subscribe((res) => {
      if(res['code']=genralConfig.statusCode.ok){
        this.allBrands = res['data']
      }
    })
  }


  addToWishList(id , i) {
   if(!this.userId){
    const dialogRef = this.dialog.open(ContactForSellerDialogComponentComponent, {
      width: '500px',
    })
    dialogRef.afterClosed().subscribe((response) => {
    
    })
    return
   }
    let data = {
      productId: id,
      userId: this.userId
    }
    this.spinner.show()
    this.service.addToWishList(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.allProducts[i].iswishList =true
        this.spinner.hide()
        this.toastr.success(res['message'])
      } else {
        this.spinner.hide()
        this.toastr.warning(res['message'])
      }
    })
  }

  removeFromWishList(id , i){
    let data = {
      productId: id,
      _id: this.userId
     
    }
    this.spinner.show()
    this.service.removeWishList(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.allProducts[i].iswishList =false
        this.spinner.hide()
        this.toastr.success('Product removed from wish list')
      } else {
        this.spinner.hide()
        this.productlist(this.page)
        this.toastr.success(res['message'])
      }
    })
  }

  subCategoryList(){

    let data={
      parentCategoryId:this.categoryId
    } 
    this.spinner.show()
    this.service.getSubCategoryList(data).subscribe((res)=>{ 
      if(res['code']==200){
        this.subcategoryList=res['data']
        this.spinner.hide()
      }else{
        this.spinner.hide()
      }
    })
  }


  modelList(){
    let data={
      isActive:'true',
      isAdminApprove:'APPROVED',
      sortValue: 'model',
      sortOrder: 1,
      isDeleted: 'false',
      count :100

    }
    this.service.getModelList(data).subscribe((res)=>{
      if(res['code']==genralConfig.statusCode.ok){
        this.allModels=res['data']
      }
    })
  }

  reset(){
    this.searchText='', this.brand.reset(),this.CondiSearch=[],this.conditionList,
    this.minPrice=0,this.maxPrice=0,this.minValue=0,
    this.maxValue=0,this.category.reset(),this.subCategory.reset(),this.model.reset(),this.maxvalue=this.currentYear
    this.minvalue=1990 ,this.maxYear= this.currentYear,this.minYear=1990
    this.conditionList.forEach(element => {
    element.checked=false
    });
    this.productlist(this.page)
    this.uncheck=false
  }

  buyNow(){
    if(!this.userId){
      const dialogRef = this.dialog.open(ContactForSellerDialogComponentComponent, {
        width: '400px',
      })
      dialogRef.afterClosed().subscribe((response) => {})
      return ;
    }else{
      // this.router.navigate(["../pages/e-commerce/checkout"])

    }
  }
  productSearch(){
    this.operProductFilter = !this.operProductFilter;       
  }
  closeNav() {  
    this.operProductFilter = !this.operProductFilter; 
  }
}