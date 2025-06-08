import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { environment } from 'src/environments/environment'
import { MapsAPILoader } from '@agm/core'
@Component({
  selector: 'app-list-job',
  templateUrl: './list-job.component.html',
  styleUrls: ['./list-job.component.css'],
})
export class ListJobComponent implements OnInit {
  @ViewChild('location', { static: false },) searchElementRef: ElementRef
  jobsList: any = []
  totalCount: any
  page: number = 1
  itemsPerPage = genralConfig.pageNationConfig.itemsPerPage
  noRecordFound: boolean = false
  jobsLocation: any
  qualificationList: any
  industryList: any
  locationChks: any = []
  educationChks: any = []
  industryChks: any = []
  panelOpenState: any
  Checked: boolean;
  title: any
  location: any
  userData: any
  indexof: any
  forpagi: boolean = false
  geoCoder: any
  public image_enduser_profile = environment.URLHOST + '/uploads/enduser/'
  googleaddress: any = {}
  lat: any
  lng: any
  fullAddress: any
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private _generalService: GeneralServiceService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }
  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("truckStorage"));
    if (this.userData && this.userData.userInfo.roleId.roleTitle == 'COMPANY') {
      this.router.navigate(['/home-page'])
    }
    this.getJobLists(1)
    this.jobLocation()
    this.getQualification()
    this.getIndustry()
    this.autosearch()
  }
  reset() {
    this.location = []
    this.locationChks = []
    this.title = ''
    this.educationChks = []
    this.industryChks = []
    this.lat= 0
    this.lng = 0
    this.fullAddress=''
    this.searchElementRef.nativeElement.value='' 
    this.getJobLists(1)
    this.jobLocation()
    this.getQualification()
    this.getIndustry()
  }
  jobLocation() {
    let data = { count: 100 }
    this._generalService.jobLocation(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.jobsLocation = response['data']
        }
      },
      (error) => { }
    )
  }
  getQualification() {
    let data = {
      isDeleted: "false",
      isActive: "true"
    }
    this._generalService.getQualification(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.qualificationList = res['data']
        } else {
        }
      },
      (error) => {
      }
    )
  }
  getIndustry() {
    let data = {
      isDeleted: "false",
      isActive: "true"
    }
    this._generalService.getIndustryList(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.industryList = res['data']
        } else {
        }
      },
      (error) => {
      }
    )
  }

  checkEducation(id, event) {
    if (event.checked == true) {
      this.educationChks.push(id)
    } else if (event.checked == false) {
      this.indexof = this.educationChks.indexOf(id)
      this.educationChks.splice(this.indexof, 1)
    }
  }
  checkIndustry(id, event) {
    if (event.checked == true) {
      this.industryChks.push(id)
    }
    else if (event.checked == false) {
      this.indexof = this.industryChks.indexOf(id)
      this.industryChks.splice(this.indexof, 1)
    }
  }

  getJobLists(pageNumber) {
    window.scroll(0, 0)
    if (!this.location) {
      this.locationChks.splice(0, 1)
    } else {
      this.locationChks.splice(0, this.location.length, this.location)
    }
    let data = {
      // searchType: event,
      count: genralConfig.paginator.COUNT,
      page: pageNumber,
      educationChks: this.educationChks,
      industryChks: this.industryChks,
      searchKey: this.title ? this.title : null,
      isActive: "true",
      lat: this.lat ? this.lat : null,
      lng: this.lng ? this.lng : null,
      fullAddress: this.fullAddress
    }
    this.spinner.show()
    this._generalService.jobsLists(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          if (this.fullAddress) {
            this.searchElementRef.nativeElement.value = this.fullAddress
          }

          this.jobsList = response['data']
          console.log(this.jobsList,"00000000000000000")
          this.totalCount = response['totalCount']
          this.page = pageNumber
          if (this.jobsList.length > 4) {
            this.forpagi = true
          } else {
            this.forpagi = false
          }
          if (this.jobsList.length > 0) {
            this.noRecordFound = true
          } else {
            this.noRecordFound = false
          }
          this.spinner.hide()
          this.closeNav()
        } else {
          this.spinner.hide()
        }
      },
      (error) => {
        this.toastr.show(error, 'Some error in event list')
        this.spinner.hide()
      }
    )
  }
  pageChanged(event) {
    this.getJobLists(event)
  }
  moveToListJob() {
    this.router.navigateByUrl('pages/jobs/job-list')
  }
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  autosearch() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder()
      var options = {
        componentRestrictions: { country: ["us", "mx", "ca"], }
      };
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, options)
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace()
          if (place.geometry === undefined || place.geometry === null) {
            return
          }
          this.googleaddress.lat = place.geometry.location.lat()
          this.googleaddress.lng = place.geometry.location.lng()
          this.googleaddress.fullAddress = place.formatted_address
          this.lat = this.googleaddress.lat
          this.lng = this.googleaddress.lng
          this.fullAddress = this.googleaddress.fullAddress
          // this.getJobLists(this.page) 
        })
      })
    })
  }
}
