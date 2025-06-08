import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { GeneralServiceService } from "src/app/core/general-service.service";
import { environment } from "src/environments/environment";


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  getServicesListData: any;
  page: number = 1
  itemsPerPage: number = 10
  searchText: String = ''
  pageNew: any
  newtotalCount: 0
  lat: number
  lng: number
  fullAddress: string = ''
  location: any=[]
  isDistance: any; 
  distanceArray = [
    {value:'80467.2', name:"50 Miles"},
    {value:'160934', name:"100 Miles"},
    {value:'241402', name:"150 Miles"},
    {value:'321869', name:"200 Miles"}
  ]
  public SERVICESIMAGE = environment.URLHOST + '/uploads/service/thumbnail/'
  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _generalService: GeneralServiceService,
  ) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.getServicesList(1)
    this.getLocation();
  }
  resetbutton(){
    if(this.searchText ){      
      this.searchText = '' ;
    }
    this.lat=null
    this.lng=null
    this.isDistance ='';
    this.getServicesList(1);
  
  }
  savePageChanged(element){
    this.getServicesList(element)
    this.page = element
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          this.lat = position.coords.latitude; //ger
          this.lng = position.coords.longitude;
        }
      },
        (error) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  getServicesList(element) {
    this.getLocation()
    let data = {
      searchText: this.searchText ? this.searchText : '',
      page:element, 
      lat : this.lat ,
      lng : this.lng, 
      distance : this.isDistance,
      count:9,
      isActive:'true',
    
    }
    this.spinner.show()
    this._generalService.getEndUserServicesList(data).subscribe((Response) => {
      if (Response['code'] == 200) {
        this.getServicesListData = Response['data']
        this.spinner.hide()
          this.newtotalCount = Response['totalCount']
        this.pageNew = element;
          window.scroll(0, 0);
      } else {
        this.toastr.warning('', Response['message'])
        this.spinner.hide()
      }
    })
  }
}



