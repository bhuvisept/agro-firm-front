import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { genralConfig } from "src/app/constant/genral-config.constant";
import { environment } from "src/environments/environment";
import { Router } from '@angular/router'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { LoginDialogComponent } from 'src/app/pages/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  blogList: any;
  public BLOGIMAGE = environment.URLHOST + '/uploads/blog/'
  userData: any;
  checkProfileStatus: any;
  user: any;
  showMore = false;
  year: number;
  constructor(
    private spinner: NgxSpinnerService,
    private _generalService: GeneralServiceService,
    private router : Router,
    private dialog : MatDialog
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('truckStorage'));
    if (this.userData){
      this.user = this.userData.userInfo.roleId.roleTitle
      this.checkProfileStatus = this.userData.userInfo.profileComplete
    }
    this.year = new Date().getFullYear()
    this.getBloglists()
  }
  getBloglists() {
    let obj = { isDeleted: false, isActive: 'true' };
    this.spinner.show();
    this._generalService.homePageBlogs(obj).subscribe((result) => {
      if (result['code'] == genralConfig.statusCode.ok) {
        this.blogList = result['data']
        } else {
        this.spinner.hide();
      }
    });
  }
  compservices =[
    {serTlt:'Event', serLink:'/pages/events'}, 
    {serTlt:'Job', serLink:'/pages/search-job/jobs'}, 
    {serTlt:'Ecommerce', serLink:'/pages/e-commerce'}, 
    {serTlt:'Services', serLink:'/pages/services'},
    {serTlt:'FAQ', serLink:'/pages/faq'}
  ]

  goToTrip(){
    if(this.user && this.userData.userInfo.roleId.roleTitle == 'COMPANY'){
      this.router.navigate(['/layout/myaccount/trip-planner'])
    }else{
      this.router.navigate(['/signup/company-signup'])

      // this.dialog.open(LoginDialogComponent,{
      //   width: '500px',
      //   data: 'SHOWCOMPANY'
      // })
    }
  }

}
