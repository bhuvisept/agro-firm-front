import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'

import { LanguageService } from 'src/app/service/language.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  userData: any;
  checkProfileStatus: any;
  user: any;
  showMore = false;
  year: number;
  eventLists: any

  currentLang: string;
  langSub: Subscription;

  constructor(
    private spinner: NgxSpinnerService,
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('gauriStorage'));
    this.year = new Date().getFullYear()

    this.currentLang = this.languageService.getCurrentLanguage();
    this.getEventlists(this.currentLang);
    this.langSub = this.languageService.currentLanguage$.subscribe(lang => {
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        this.getEventlists(this.currentLang)
      }
    });

  }

  getEventlists(lang: string) {
    let data = { isActive: 'true',lang:lang }
    this._generalService.homePageEvents(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.eventLists = response['data']
        }
      },
      (error) => {
        this.toastr.show(error, 'Network Error')
      }
    )
  }
  compservices = [
    { serTlt: 'news_event', serLink: '/pages/news-events' },
    { serTlt: 'gallery', serLink: '/pages/our-gallery' },
    { serTlt: 'our_products', serLink: '/pages/ecommerce' },
  ]

}
