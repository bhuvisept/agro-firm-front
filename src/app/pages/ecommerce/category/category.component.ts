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
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  categoriesList: any;
  category_image_url = environment.URLHOST + '/uploads/category/thumbnail/'

  currentLang: string;
  langSub: Subscription;

  constructor(
    private _generalService: GeneralServiceService,
    private formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private languageService: LanguageService
  ) { }

  ngOnInit() {

    this.currentLang = this.languageService.getCurrentLanguage();
    console.log("CURRENT LANGUAGE IS ",this.currentLang);

    this.categoryList(this.currentLang);

    this.langSub = this.languageService.currentLanguage$.subscribe(lang => {
      console.log("SELECTED LANGUAGE IS ,",lang)
      if (lang !== this.currentLang) {   
        this.currentLang = lang;
        this.categoryList(lang);
      }

    });
  }
  categoryList(lang: string) {
    let data = { title: lang }
    this.spinner.show()
    this._generalService.getCategoryList(data).subscribe((res) => {
      if (res['code'] == genralConfig.statusCode.ok) {
        this.spinner.hide()
        this.categoriesList = res['data']
        window.scroll(0, 0)
      } else {
        window.scroll(0, 0)
        this.spinner.hide()
      }
    })
  }

}
