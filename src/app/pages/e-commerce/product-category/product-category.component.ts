import { genralConfig } from 'src/app/constant/genral-config.constant';
import { GeneralServiceService } from 'src/app/core/general-service.service';

import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'

import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css'],
  providers: [NgxSpinnerService],
})
export class ProductCategoryComponent implements OnInit {
  public product_catagory_image = environment.URLHOST + '/uploads/category/thumbnail/'

  categoriesList: any;
  getVauledata: any;
  selected: any;
  roleTitle: any;
  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) { }

  ngOnInit() {   
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    if (userData && userData.userInfo) {
      this.roleTitle = userData.userInfo.roleId.roleTitle
      if(this.roleTitle == 'SELLER'){
       return  this.router.navigate(['/login'])
      }      
    }

    this.categoryList()
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  customOptions: OwlOptions = {
    loop: true,
    autoplay:false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin:25,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 4
      },
      940: {
        items: 6
      }
    },
    nav: true
  }
  
  getValue(list){

    this.selected = list._id;
    if(list.constant_name =="ACCESSORIES" || list.constant_name =="SPAREPARTS") {
      return
    }else[
      this.router.navigate(['/pages/e-commerce/products-list/'+this.selected])
    ]
     
  }
  isActive(list) {
      return this.selected === list;
  }
  categoryList(){
    let data={
      parentFlag:'true'
    }
    this.spinner.show()
    this._generalService.getCategoryList(data).subscribe((res)=>{
      if(res['code']==genralConfig.statusCode.ok){
        this.spinner.hide()
        this.categoriesList=res['data']
        window.scroll(0,0)
      }else{
        window.scroll(0,0)
        this.spinner.hide()
      }
    })
  }

}

