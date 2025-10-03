import { Component, OnInit } from '@angular/core';
import { GeneralServiceService } from 'src/app/core/general-service.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

import { LanguageService } from 'src/app/service/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-our-service-detail',
  templateUrl: './our-service-detail.component.html',
  styleUrls: ['./our-service-detail.component.css']
})
export class OurServiceDetailComponent implements OnInit {
  serviceId: any;
  serviceData: any;
  service_image_url = environment.URLHOST + '/uploads/services/'

  currentLang: string;
  langSub: Subscription;
  constructor(
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.currentLang = this.languageService.getCurrentLanguage();
    this.langSub = this.languageService.currentLanguage$.subscribe(lang => {
      if (lang !== this.currentLang) {
        this.currentLang = lang;
        this.getServiceDetail(this.serviceId, this.currentLang);
      }
    });

    this.route.params.subscribe(param => {
      this.serviceId = param.id;
      if (this.serviceId) {
        this.getServiceDetail(this.serviceId, this.currentLang);
      } else {
      }
    })
    window.scroll(0, 0);
  }
  getServiceDetail(serviceId, lang: string) {
    this._generalService.serviceView({ serviceId: serviceId, title: lang }).subscribe(result => {
      this.spinner.show()
      if (result['code'] === 200) {
        this.serviceData = result['data'][0];
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
      } else {
        this.spinner.hide();
      }
    });

  }

}
