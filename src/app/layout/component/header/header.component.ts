import { Component, OnInit, HostListener } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { SharedService } from 'src/app/service/shared.service'
import { environment } from 'src/environments/environment'

import { MatDialog } from '@angular/material'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
import { NgxSpinnerService } from 'ngx-spinner'



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userName: any = ''
  userPlanData: any
  personName: any





  navOpen: boolean = false
  userInfo: any
  ROLETITLE: any
  notificationsLists: any
  notList: any
  loggedIn: any
  receiverImage: any
  // socket:any;

  public endUser = environment.URLHOST + '/uploads/enduser/'
  totalCount: number = 0
  notificationCount: number = 0
  notificationPermission: any
  notificationBox: Notification
  accessLevel: any
  sellerData: string
  firstName:any
  lastName:any
  constructor(
    private translate: TranslateService,
    private toatsr: ToastrService,
    private dialog: MatDialog,
    private router: Router,
    private sharedService: SharedService,
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,

  ) {
    translate.addLangs(['en', 'pa', 'es'])
  }

  ngOnInit() {
    
  }
  useLanguage(language: string) {
    this.translate.setDefaultLang('en')
    this.translate.use(language || 'en')
  }
  navToggle() {
    this.navOpen = !this.navOpen
  }
  reDirect(item){

  }




}
