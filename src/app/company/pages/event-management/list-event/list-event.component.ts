import { DatePipe } from '@angular/common'
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'
import { PlanConfirmationDialogComponent } from 'src/app/plan-confirmation-dialog/plan-confirmation-dialog.component'
import { UpgradeConfirmationDialogComponent } from 'src/app/upgrade-confirmation-dialog/upgrade-confirmation-dialog.component'

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.css'],
})
export class ListEventComponent implements OnInit {
  public image_url_truck = environment.URLHOST + '/uploads/event/image/thumbnail/'
  totalCount: any
  searchType: String = ''
  exampleTime: any = []
  public search: any
  demoDate: any = Date
  countDownDate: any
  newDateFormat: any
  eventLists: any = []
  filterType: any
  SearchText: string = ''
  bookedTotalCount: number
  userDetail: any
  userId: any
  interested = genralConfig.Interested
  roleTitle: any
  page: number = 1
  public isTimerStart: any
  eventListsbook: any
  statusList = genralConfig.statusList
  public isActive: String = 'true'
  deleteArray = genralConfig.deleteArray
  deleted: any = 'false'
  planInfo: any
  planNoOfEvents: any
  newtotalCount: any
  eventLength: any
  itemsPerPage = genralConfig.pageNationConfig.itemsPerPage
  selectedIndex: Number = 0
  tab = 'TOP'
  totalPlan: any
  currentPlan: any
  accessLevel: any
  innerPlanKey: any = []
  IsExist: any
  constructor(
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private _generalService: GeneralServiceService,
    private pipe: DatePipe,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }
  ngOnInit() {
    window.scrollTo(0, 0)
    this.userDetail = JSON.parse(localStorage.getItem('truckStorage'))
    this.planInfo = this.userDetail.userInfo.planData
    if (this.planInfo.length > 0) {
      let eventPlanInfo = this.planInfo.filter((planDtl) => planDtl.plan == 'EVENT' || planDtl.plan == 'CUSTOM PLAN')
      this.eventLength = eventPlanInfo.length
      if (eventPlanInfo.length) {
        let eventConstName = eventPlanInfo.forEach((element) => {
          let featureArray = element.features
          featureArray.forEach((ele) => this.innerPlanKey.push(ele.constName))
        })
        this.IsExist = this.innerPlanKey.includes('NOOFEVENTS')
        if (eventConstName) this.planNoOfEvents = eventConstName[0].keyValue
      }
    }
    this.roleTitle = this.userDetail.userInfo.roleId.roleTitle
    this.accessLevel = this.userDetail.userInfo.accessLevel
    this.userId = this.userDetail.userInfo._id

    let EventData = JSON.parse(localStorage.getItem('event'))
    this.isActive = EventData?EventData.isActive:'true'
    this.deleted = EventData?EventData.isDeleted:'false'
    this.SearchText = EventData?EventData.searchText:''
    this.selectedIndex = EventData ? EventData.selectedIndex : 0

    this.getEventLists('TOP', 1)
  }
  getTabChangeValue(event) {
    this.filterType = event.tab.textLabel
    this.selectedIndex = event.index
    this.tab = event.tab.textLabel.toUpperCase()
    this.changeTab(this.tab)
  }
  changeTab(value) {
    this.eventLists = []
    this.newtotalCount = 0
    this.page = 1
    value == 'BOOKED' ? this.Bookedlist(1) : this.getEventLists(value, 1)
    clearInterval(this.isTimerStart)
    this.exampleTime = []
  }
  getEventLists(event, pageNumber) {


    let EventData  = JSON.parse(localStorage.getItem('event'))


    let data = {
      searchType: EventData?EventData.searchType: event,
      companyId:EventData?EventData.companyId: this.roleTitle == 'COMPANY' ? this.userDetail.userInfo._id : this.userDetail.userInfo.companyId,
      userId:EventData?EventData.userId: this.userDetail.userInfo._id,
      searchText:EventData?EventData.searchText: this.SearchText,
      roleTitle:EventData?EventData.roleTitle: this.roleTitle,
      isDeleted:EventData?EventData.isDeleted: this.deleted ? this.deleted : 'false',
      isActive:EventData?EventData.isActive: this.isActive ? this.isActive : 'true',
      page:EventData?EventData.pageNumber :pageNumber,
    }



    this.spinner.show()
    this._generalService.companyEvents(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          window.scrollTo(0, 0)
          this.eventLists = response['data']
          console.log(this.eventLists);
          
          this.newtotalCount = response['totalCount']
          this.page = pageNumber
          if (this.newtotalCount) {
            this.eventLists.forEach((element) => this.exampleTime.push(element.startDate))
            this.setTimer(this.exampleTime)
          }
        }
        this.spinner.hide()
      },
      () => {
        this.toastr.warning('Something went wrong')
        this.spinner.hide()
      }
    )
  }
  createEvents() {
    if(this.roleTitle=='COMPANY'){
 if (!this.planInfo || this.planInfo.length == 0 || this.eventLength == 0 || !this.IsExist) this.dialog.open(PlanConfirmationDialogComponent, { width: '550px', data: 'EVENT' })
    else if (this.newtotalCount === this.planNoOfEvents) this.dialog.open(UpgradeConfirmationDialogComponent, { width: '550px' })
    else  this.router.navigate(['/layout/myaccount/event-management/create-event'])
    }else{
       let data ={companyId:this.userDetail.userInfo.companyId}
    this._generalService.PlanStatus(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          if(res['data'].EVENT=='OK'){
            this.router.navigate(['/layout/myaccount/event-management/create-event'])
      }else{
        this.dialog.open(PlanConfirmationDialogComponent, { width: '550px', data: res['data'].EVENT })
      }
          
        }
        this.spinner.hide()
      },
      () => this.spinner.hide()
    )
    }
   
         
   
  }
  setTimer(time) {
    this.isTimerStart = setInterval(() => {
      time.forEach((element, index) => {
        let eventSDate = element
        this.newDateFormat = this.pipe.transform(eventSDate, 'EEEE, MMMM d, y, h: mm: ss a zzzz')
        this.demoDate = new Date(this.newDateFormat).getTime()
        var now = new Date().getTime()
        var distance = this.demoDate - now
        var days = Math.floor(distance / (1000 * 60 * 60 * 24))
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        var seconds = Math.floor((distance % (1000 * 60)) / 1000)
        this.countDownDate = days + ' days ' + hours + ' hours ' + minutes + ' min ' + seconds + ' sec '
        if (this.eventLists[index]) {
          this.eventLists[index].countdown = this.countDownDate ? this.countDownDate : 0
        }
        if (distance < 0) {
          if (new Date(this.eventLists[index].startDate) < new Date() && new Date(this.eventLists[index].endDate) > new Date()) this.eventLists[index].countdown = 'On-going'
          else if (new Date(this.eventLists[index].endDate) < new Date()) this.eventLists[index].countdown = 'Expired !'
        }
      })
    }, 500)
  }
  //reset the filters
  reset() {
    this.selectedIndex = 0
    this.SearchText = ''
    this.isActive = 'true'
    this.deleted = 'false'
    localStorage.removeItem('event');
    this.getEventLists(this.tab, 1)

  }
  pageChanged(event, type) {
    type == 'BOOKED' ? this.Bookedlist(event) : this.getEventLists(type, event)
    clearInterval(this.isTimerStart)
    this.exampleTime = []
  }
  searchEvent() {
    let data = {
      searchType: this.tab,
      companyId: this.roleTitle == 'COMPANY' ? this.userDetail.userInfo._id : this.userDetail.userInfo.companyId,
      userId: this.userDetail.userInfo._id,
      searchText: this.SearchText,
      roleTitle: this.roleTitle,
      isDeleted: this.deleted ? this.deleted : 'false',
      isActive: this.isActive ? this.isActive : 'true',
      page: 1,
      selectedIndex: this.selectedIndex
    }
    localStorage.setItem('event', JSON.stringify(data))
    clearInterval(this.isTimerStart)
    this.exampleTime = []

    this.getEventLists( this.tab, 1)

    // this.tab == 'BOOKED' ? this.Bookedlist(1) : this.getEventLists(this.tab, 1)
  }

  Bookedlist(page) {
    let data = {
      userId: this.userDetail.userInfo._id,
      page: page,
      companyId: this.roleTitle == 'COMPANY' ? this.userDetail.userInfo._id : this.userDetail.userInfo.companyId,
      count: this.itemsPerPage,
      accessLevel: this.accessLevel,
      searchText: this.SearchText,
    }
    this.spinner.show()
    this._generalService.getBookedLists(data).subscribe(
      (res) => {
        if (res.code == 200) {
          this.eventListsbook = res['data']
          this.bookedTotalCount = res.totalCount
          this.page = page
        }
        this.spinner.hide()
      },
      () => this.spinner.hide()
    )
  }
}
