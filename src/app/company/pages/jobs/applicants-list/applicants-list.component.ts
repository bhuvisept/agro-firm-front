import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-applicants-list',
  templateUrl: './applicants-list.component.html',
  styleUrls: ['./applicants-list.component.css'],
})
export class ApplicantsListComponent implements OnInit {
  userId: any
  searchText: any
  searchDate: any
  userData: any = []
  totalCount: any
  dataMain: any
  userDetail:any
  resumeData: any
  page: number = 1
  // itemsPerPage = genralConfig.pageNationConfig.itemsPerPage
  itemsPerPage =3
  noRecordFound: boolean = true
  statusList = [
    { value: '', name: 'All' },
    { value: 'accept', name: 'Accepted' },
    { value: 'reject', name: 'Rejected' },
    { value: 'onHold', name: 'On hold' },
  ]
  isStatus: any = ''
  readArray = [
    { value: '', name: 'All' },
    { value: true, name: 'Read' },
    { value: false, name: 'Un-Read' },
  ]
  isRead: any = ''

  search: string
  docs_url = environment.URLHOST + '/uploads/resume/'
  public driverDocs = environment.URLHOST + '/uploads/docs/'
  jobId: any
  renderer: any
  jobstatus:any
  status: boolean = false
  statusType : any;
  pagi: boolean = false
  key: string ='id';
  reverse:boolean = false;
  Email: any
  createdAt: any
  mobileNumber: any
  personName: any
  numOfTyres:any
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private _generalService: GeneralServiceService,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    if (localStorage.getItem('truckStorage') != null) this.userId = JSON.parse(localStorage.getItem('truckStorage')).userInfo._id
    this.route.params.subscribe((params) => (this.jobId = params.id))
    this.getApplicantList(1)
    window.scroll(0, 0)
  }
  reset() {
    this.searchText = null
    this.searchDate = ''
    this.isRead = ''
    this.isStatus = ''
    this.getApplicantList(1)
  }
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }
  searchData() {
    this.getApplicantList(1)
  }
  toggleClass(event: any, className: string) {
    const hasClass = event.target.classList.contains(className)
    if (hasClass) this.renderer.removeClass(event.target, className)
    else this.renderer.addClass(event.target, className)
  }
  clickEvent(resumeData) {
    this.resumeData = resumeData
  }
  closeclickEvent() {
    this.resumeData = null
  }
  description(data) {
    this.dataMain = data
  }
  detail(userData){
this.userDetail = userData
  this.Email = this.userDetail.userData.email
  this.createdAt=this.userDetail.createdAt
  this.mobileNumber=this.userDetail.userData.mobileNumber
  this.personName=this.userDetail.userData.personName
  this.statusType=this.userDetail.status

  }
  getApplicantList(pageNumber) {
    let data = { userId: this.userId,
       jobId: this.jobId, 
        page: pageNumber ,
        count: this.itemsPerPage,
        searchText: this.searchText ? this.searchText : null,
        isStatus: this.isStatus ? this.isStatus : '',
        searchDate : this.searchDate  ? this.searchDate : '',
        isRead: this.isRead ,
      }
   
    this.spinner.show()
    this._generalService.applicantList(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.userData = response['data']
          this.totalCount = response['totalCount']
          this.page = pageNumber
          if (this.userData.length > 4) this.pagi = true
          else this.pagi = false
          if (this.userData.length) this.noRecordFound = false
          else this.noRecordFound = true
        }
        this.spinner.hide()
      },
      () => {
        this.toastr.show('Some error in applicants list')
        this.spinner.hide()
      }
    )
  }
  goBack() {
    this.router.navigate(['layout/myaccount/jobs'])
  }

  Readjob(jobId) {
    let data = { appliedJobId: jobId }
    this.spinner.show()
    this._generalService.isReadedjob(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.getApplicantList(1)

          this.toastr.success(response['message'])
        }
        this.spinner.hide()
      },
      () => {
        this.toastr.show('Some error in applicants list')
        this.spinner.hide()
      }
    )
  }
  statusUpdate(jobId , type) {
    if(type == 'accept'){
      this.jobstatus='ACCEPT'
    }else if(type == 'reject'){
      this.jobstatus='REJECT'
    }
    let data = { appliedJobId: jobId , status: this.jobstatus }


    this.spinner.show()
    this._generalService.jobStatusUpdate(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.getApplicantList(1)

          this.toastr.success(response['message'])
        }
        this.spinner.hide()
      },
      () => {
        this.toastr.show('Some error in applicants list')
        this.spinner.hide()
      }
    )
  }
  savePageChanged(event) {

      this.getApplicantList(event)
    
     }
}
