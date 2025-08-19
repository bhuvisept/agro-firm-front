import { Component, HostListener, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { SharedService } from 'src/app/service/shared.service'
import { ToastrService } from 'ngx-toastr'
import { MatDialog } from '@angular/material'
import { TranslateService } from '@ngx-translate/core'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  languages = [
    { "code":"en","name":"English" },
    { "code":"hi","name":"Hindi" }
]
  selectedLanguage = 'en';
  currentDate : any
  navOpen: boolean = false
  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private sharedService: SharedService,
    private router: Router,
    private _generalService: GeneralServiceService
  ) {
    translate.setDefaultLang('hi')
    translate.addLangs(['en', 'hi'])
  }
  ngOnInit() {
    this.currentDate = new Date();
  }

  useLanguage(lang) {
    this.translate.setDefaultLang(lang || 'en')
  }
 

}
