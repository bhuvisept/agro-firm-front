import { Component, OnInit } from '@angular/core';
import { GeneralServiceService } from 'src/app/core/general-service.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { genralConfig } from 'src/app/constant/genral-config.constant';

import { LanguageService } from 'src/app/service/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  productList: any;
  category_id: any
  noRecordFound = 0;
  product_image_url = environment.URLHOST + '/uploads/product/thumbnail_150X120/'
  category_name : any;
  currentLang: string;
  langSub: Subscription;
  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.currentLang = this.languageService.getCurrentLanguage();

    this.langSub = this.languageService.currentLanguage$.subscribe(lang => {
      console.log("SELECTED LANGUAGE IS ,",lang)
      if (lang !== this.currentLang) {   
        this.currentLang = lang;
       this.products(this.category_id,lang);
      }
    });

    this.route.params.subscribe(param => {
      this.category_id = param.id;
      // console.log(" this.eventId ", this.eventId)
      if (this.category_id) {
        this.products(this.category_id,this.currentLang);
      } else {
      }
    })
  }
  products(category_id,lang: string) {
    let data = {categoryId: category_id,title: lang}
    this.spinner.show()
    this._generalService.getProductList(data).subscribe((res) => {
      if (res['code'] == genralConfig.statusCode.ok) {
        this.productList = res['data']
        this.category_name = this.productList[0].category_name;
        console.log("category_name ",this.category_name)
        console.log("this.productList ",this.productList)
        this.noRecordFound = this.productList.length;
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
        window.scroll(0, 0)
      } else {
        this.noRecordFound = 0;
        window.scroll(0, 0)
        this.spinner.hide()
      }
    })
  }

}
