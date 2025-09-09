import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'


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
  eventLists:any
  constructor(
    private spinner: NgxSpinnerService,
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('truckStorage'));
    this.year = new Date().getFullYear()
    this.getEventlists()
  }

  getEventlists() {
      let data = {isActive: 'true'}
      this.spinner.show()
      this._generalService.homePageEvents(data).subscribe(
        (response) => {
          if (response['code'] == 200) {
            this.eventLists = response['data']
           
            this.spinner.hide()
          }
        },
        (error) => {
          this.toastr.show(error, 'Network Error')
          this.spinner.hide()
        }
      )
  }
  compservices =[
    {serTlt:'News & Event', serLink:'/pages/events'}, 
    {serTlt:'Gallery', serLink:'/pages/e-commerce'}, 
    {serTlt:'Our Products', serLink:'/pages/services'},
  ]

}
