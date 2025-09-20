import { Component, OnInit } from '@angular/core';
import { GeneralServiceService } from 'src/app/core/general-service.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { genralConfig } from 'src/app/constant/genral-config.constant';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  productList: any;
  category_id:any
  noRecordFound = 0;
  product_image_url = environment.URLHOST + '/uploads/product/thumbnail_150X120/'
  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
        private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
     this.route.params.subscribe(param => {
      this.category_id = param.id;
      // console.log(" this.eventId ", this.eventId)
      if (this.category_id) {
        this.products(this.category_id);
      } else {
      }
    })
    // this.products()
  }
  products(category_id){
     let data={
      categoryId:this.category_id
    }
    this.spinner.show()
    this._generalService.getProductList(data).subscribe((res)=>{
       console.log("this.productList ",res)
      if(res['code']==genralConfig.statusCode.ok){
        this.spinner.hide()
        this.productList=res['data']
        this.noRecordFound = this.productList.length;
        console.log("categoriesList ",this.productList)
        window.scroll(0,0)
      }else{
        this.noRecordFound = 0;
        window.scroll(0,0)
        this.spinner.hide()
      }
    })
  }

}
