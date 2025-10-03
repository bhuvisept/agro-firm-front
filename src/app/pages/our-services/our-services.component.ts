import { Component, OnInit } from '@angular/core';
import { GeneralServiceService } from 'src/app/core/general-service.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'

import { LanguageService } from 'src/app/service/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-our-services',
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.css']
})
export class OurServicesComponent implements OnInit {
  service_image_url = environment.URLHOST + '/uploads/services/thumbnail/'
  userId: any;
  results: any;
  totalCount: number
  itemsPerPage: number = 10
  currentPage: number
  page: number = 1
  count: 10

  currentLang: string;
  langSub: Subscription;
  constructor(
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private pipe: DatePipe,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.currentLang = this.languageService.getCurrentLanguage();
    this.getServicesList(1, this.currentLang);
    this.langSub = this.languageService.currentLanguage$.subscribe(lang => {
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        this.getServicesList(1, this.currentLang);
      }
    });
    window.scroll(0, 0);

  }
  limitWords(text: string, limit: number = 20): string {
    if (!text) return '';
    const plain = text.replace(/<[^>]+>/g, ''); // strip HTML
    const words = plain.split(/\s+/);
    return words.length > limit ? words.slice(0, limit).join(' ') + ' ' : plain;
  }
   getServicesList(page,lang: string) {
    let data = {isActive: 'true', page: page,title:lang}
    this.spinner.show()
    this._generalService.serviceList(data).subscribe(
      (response) => {
        console.log("RES ", response);
        if (response['code'] == 200) {
          this.results = response['data']
        
          this.totalCount = response['totalCount']
          setTimeout(() => {
            this.spinner.hide();
          }, 2000);
        }
      },
      (error) => {
        this.toastr.show(error, 'Network Error')
        this.spinner.hide()
      }
    )
  }
  savePageChanged(element) {
     this.getServicesList(element,this.currentLang);
    this.page = element
  }

}
