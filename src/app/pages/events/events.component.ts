import { DatePipe } from '@angular/common'
import { Component, OnInit ,NgZone ,ViewChild ,ElementRef} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'
import {EventBookDialogComponent} from '../../event-book-dialog/event-book-dialog.component'
import { MatDialog } from '@angular/material';
import { MapsAPILoader } from '@agm/core'
import * as moment from 'moment';
import 'moment-timezone'; 
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  // @ViewChild('search', { static: false }) searchElementRef: ElementRef
  listing: any
  totalCount: number
  noRecordFound: boolean = true
  eventID: any
  eventType: String = 'all'
  noOfAttendees: String = 'all'
  searchType: String = ''
  fromDate: String = ''
  toDate: String = ''
  book:any
  pagination:boolean = false
  geoCoder: any
  exampleTime: any = []

  // page: number = 1
  count: any
  itemsPerPage: number = 9
  currentPage: number
  page : number = 1

  status: string = 'true'
  deleted: string = 'false'
  statusArray = [
    { value: 'true', name: 'Active' },
    { value: 'false', name: 'In-Active' },
  ]
  deleteArray = [
    { value: 'true', name: 'Deleted' },
    { value: 'false', name: 'Not Deleted' },
  ]
  distanceArray = [
    {value:'80467.2', name:"50 Miles"},
    {value:'160934', name:"100 Miles"},
    {value:'241402', name:"150 Miles"},
    {value:'321869', name:"200 Miles"}
  ]
  key: string = 'id'
  reverse: boolean = false
  listEventForm: FormGroup

  public search: any
  public isAccepted: any = 'accepted'


  //variables for countdowntimer
  demoDate: any = Date
  countDownDate: any
  newDateFormat: any
  x: any

  eventLists: any = []
  interestedAttendeeLists: any = []

  imgLocation: any
  public image_url_truck = environment.URLHOST + '/uploads/event/image/thumbnail/'
  // for countdown timer
  someDate: Date
  // dialog: MatDialog
  filterType: any

  searchTerm: string
  term: string

  id: any
  toggle = true

  userDetail: any
  userId: any
  googleaddress: any = {}
  lat: number
  lng: number
  fullAddress: string = ''
  bntStyle: string
  userInfo: any

  interested = genralConfig.Interested
  userData: any
  userDatause: any
  roleTitle:any
  searchText: String = ''
  isDistance: any; 
  // totalCount: any

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private _generalService: GeneralServiceService,
    private frmbuilder: FormBuilder,
    private route: ActivatedRoute,
    private pipe: DatePipe, 
    private dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {

   let currentTime = moment.utc(new Date()).format();
   let tdate = moment(new Date()).tz('America/New_York').format()
   window.scroll(0,0) 
   window.scroll(0,0) 


    let 
    userData = JSON.parse(localStorage.getItem("truckStorage"));

    if (userData && userData.userInfo) {
      this.userId = userData.userInfo._id;
      this.userData = JSON.parse(localStorage.getItem("truckStorage"));
      this.userDatause = JSON.parse(localStorage.getItem("truckStorage"));
      this.roleTitle = this.userData.userInfo.roleId.roleTitle
      if(this.roleTitle == 'COMPANY'){
       return  this.router.navigate(['/login'])
      }
      
    }
    this.getEventlists(1)  
    this.getLocation();      
    // this.autosearch()
    
    
  }
  resetbutton(){
    if(this.searchText || ( this.lat && this.lng)){      
      this.searchText = '' ;
    }
      this.isDistance ='';
      this.lat=null
      this.lng=null
      this.getEventlists(1);
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        }
      },
        (error) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  getEventlists(page) {

    this.getLocation()

    this.spinner.show();
    let data = {
      searchType: 'UPCOMING',
      visibility: "Public",
      userId:this.userId?this.userId:null,
      roleTitle:this.roleTitle?this.roleTitle:null,
      count:9,
      isActive:'true',
      page:page,
      searchText: this.searchText ? this.searchText : '',
      lat :this.lat ? this.lat : '',
      lng :this.lng ? this.lng : '',
      distance : this.isDistance
      // :this.location.length ? this.location : []
    };
    this._generalService.eventList(data).subscribe(
      (response) => {
        if (response["code"] == 200) {
          this.page = page
          this.eventLists = response["data"];
          this.totalCount =  response['totalCount']
          this.eventLists.forEach((element) => {
            this.exampleTime.push(element.startDate);
          });
          this.setTimer(this.exampleTime);
          this.spinner.hide();
        }
      },
      (error) => {
        this.toastr.warning("Something went wrong");
        this.spinner.hide();
      }
    );
  }
  setTimer(time) {
    setInterval(() => {
      time.forEach((element, index) => {
        let eventSDate = element;
        this.newDateFormat = this.pipe.transform(
          eventSDate,
          "EEEE, MMMM d, y, h: mm: ss a zzzz"
        );
        this.demoDate = new Date(this.newDateFormat).getTime();
        var now = new Date().getTime();
        var distance = this.demoDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        this.countDownDate =
          days +
          " days " +
          hours +
          " hours " +
          minutes +
          " min " +
          seconds +
          " sec ";
          if(this.eventLists[index]){
            this.eventLists[index].countdown = this.countDownDate ? this.countDownDate :0;
          }
        
        if (distance < 0) {
          if (new Date(this.eventLists[index].endDate) > new Date()) {
            this.eventLists[index].countdown = "On-going";
          } else {
            this.eventLists[index].countdown = "Expired !";
          }
        }
      });
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(EventsComponent)
    dialogRef.afterClosed().subscribe((result) => {})
  }



  //order
  sort(key) {
    this.key = key
    this.reverse = !this.reverse
  }
  //reset the filters
  reset() {
    this.search = ''
    this.isAccepted = 'accepted'
  }



  removeInterestedAttendee(eventId: any) {
    if (this.userId != null) {
      this.spinner.show()
      let data = {
        userId: this.userId,
        eventId: eventId,
      };
      this._generalService.removeInterestedAttendee(data).subscribe((res) => {
        if (res['code'] == genralConfig.statusCode.ok) {
          this.getEventlists(this.page);
          this.toastr.success(res['message'])
          this.spinner.hide()
        } else {
          this.spinner.hide()
          this.toastr.warning(res['message'])
        }
      }, (error) => {
        this.toastr.warning('Something went wrong')
        this.spinner.hide()
      });
    } else {
      this.router.navigateByUrl('login');
    }
  }


  addInterestedAttendee(eventId: any) {    
    if (this.userId != null) {
      this.spinner.show()
      let data = {
        userId: this.userId,
        eventId: eventId,
      
      };
      this._generalService.addInterestedAttendee(data).subscribe((res) => {
        if (res['code'] == genralConfig.statusCode.ok) {
          this.toastr.success("Event added to your interest list")
          this.spinner.hide()
          this.getEventlists(this.page);
        } else {
          this.spinner.hide()
          this.toastr.warning(res['message'])
        }
      }, (error) => {
        this.toastr.warning('Something went wrong')
        this.spinner.hide()
      });
    } else {
      this.toastr.warning('You have to log-In first.')
      window.scroll(0,0)
    }
  }

    removeFavourite(eventId: any) {
    if (this.userId != null) {
      this.spinner.show()
      let data = {
        userId: this.userId,
        eventId: eventId,
      };
      this._generalService.removeFavouriteEvent(data).subscribe((res) => {
        if (res['code'] == 200) {
          this.eventLists = res['data']
          this.getEventlists(this.page)      
          this.toastr.success(res['message'])
          this.spinner.hide()
        } else {
          this.spinner.hide()
          this.toastr.warning(res['message'])
        }
      }, (error) => {
        this.toastr.warning('Something went wrong')
        this.spinner.hide()
      });
    } else {
      this.toastr.warning('You have to log-In first.')
      window.scroll(0,0)
    }
  }

  
  addFavourite(eventId: any) {
    if (this.userId != null) {
      this.spinner.show()
      let data = {
        userId: this.userId,
        eventId: eventId,
      };
      this._generalService.addFavouriteEvent(data).subscribe((res) => {
        if (res['code'] == genralConfig.statusCode.ok) {
          this.getEventlists(this.page)      
          this.toastr.success(res['message'])
          this.spinner.hide()
        } else {
          this.spinner.hide()
          this.toastr.warning(res['message'])
        }
      }, (error) => {
        this.toastr.warning('Something went wrong')
        this.spinner.hide()
      });
    } else {
      this.toastr.warning('You have to log-In first.')
      window.scroll(0,0)
    }
  }

    BookEvent(id) {
      const dialogRef1 = this.dialog.open(EventBookDialogComponent, {
        width: '500px',
        data: {jobId: id}
      });
      dialogRef1.afterClosed().subscribe(result => {
        if (result) {
          let data ={
                userId: this.userId,
                eventId : id,
                userName:this.userData.userInfo.personName,
                userImage:this.userData.userInfo.image
              }
          this.spinner.show();
          this._generalService.bookedEvent(data).subscribe((res) =>{
            this.spinner.hide();
            if (res && res.code == genralConfig.statusCode.ok) {
              this.toastr.success("Event successfully booked");
              this.spinner.hide();
              this.getEventlists(this.page)
            }
            else {
              this.toastr.error(res.message);
              this.spinner.hide();
            }
          })
        }
      });
    } 

  savePageChanged(element){
    this.getEventlists(element)
    this.page = element
  }

}
