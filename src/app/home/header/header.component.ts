import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { SharedService } from 'src/app/service/shared.service'
import { ToastrService } from 'ngx-toastr'
import { MatDialog } from '@angular/material'
import { TranslateService } from '@ngx-translate/core'

/** FOR LANGUAGE  */
import { LanguageService } from 'src/app/service/language.service'
import { HttpClient } from '@angular/common/http';

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
    private _generalService: GeneralServiceService,
    private languageService: LanguageService
  ) {
  }
  ngOnInit() {
    this.currentDate = new Date();

    this.default_language = 'hi';
    this.translate.setDefaultLang(this.default_language);
  }

  useLanguage(langCode) {
     // Notify other components
    this.languageService.changeLanguage(langCode);
    
    this.default_language = langCode;
    this.translate.setDefaultLang(langCode || 'hi');
  }
  navToggle() {
    this.navOpen = !this.navOpen
  }


}
