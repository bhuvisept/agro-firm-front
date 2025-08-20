import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { SharedService } from 'src/app/service/shared.service'
import { ToastrService } from 'ngx-toastr'
import { MatDialog } from '@angular/material'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  languages = [
    { "code": "en", "name": "English" },
    { "code": "hi", "name": "Hindi" }
  ]
  default_language = 'hi';
  selectedLanguage: string = this.default_language;
  currentDate: any
  navOpen: boolean = false
  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private router: Router,
    private _generalService: GeneralServiceService
  ) {
    //console.log("Before selected = ",this.default_language)
    // console.log("after selected = ",this.default_language)
    //   translate.setDefaultLang('hi')
    //translate.addLangs(['en', 'hi'])
  }
  ngOnInit() {
    this.currentDate = new Date();

    this.default_language = 'hi';
    this.translate.setDefaultLang(this.default_language);
  }

  useLanguage(langCode) {
    this.default_language = langCode;
    this.translate.setDefaultLang(langCode || 'hi');
  }
  navToggle() {
    this.navOpen = !this.navOpen
  }


}
