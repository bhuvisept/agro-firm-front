import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogConfig } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { InstructionDialogComponent } from '../instruction-dialog/instruction-dialog.component'
import { TripCompleteComponent } from '../trip-complete/trip-complete.component'
import { TripStartComponent } from '../trip-start/trip-start.component'
import { Router } from '@angular/router'
import { PlanConfirmationDialogComponent } from 'src/app/plan-confirmation-dialog/plan-confirmation-dialog.component'
import { UpgradeConfirmationDialogComponent } from 'src/app/upgrade-confirmation-dialog/upgrade-confirmation-dialog.component'
import moment from 'moment'

@Component({
  selector: 'app-trip-planner',
  templateUrl: './trip-planner.component.html',
  styleUrls: ['./trip-planner.component.css'],
})
export class TripPlannerComponent implements OnInit {
  searchText
  Tripplanner = new FormGroup({
    location: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    Equipments: new FormControl('', Validators.required),
    destination: new FormControl('', Validators.required),
  })
  page: any
  tripPlannerList: any = []
  totalCount: any
  noRecordFound: boolean
  userObj: any
  userId: any
  itemsPerPage = genralConfig.pageNationConfig.itemsPerPage
  tripStatusShow: string = 'UPCOMING'
  routeFlag: string = ''
  filterDate
  key: string ='id';
  reverse:boolean = false;
  tripStatus = [
    { value: 'ACTIVE', show: 'Active' },
    { value: 'CANCELLED', show: 'Canceled' },
    { value: 'COMPLETED', show: 'Completed' },
    { value: 'UPCOMING', show: 'Upcoming' },
    { value: 'UNASSINGED', show: 'Unassigned' },
    { value: 'EXPIRED', show: 'Action Pending' },
  ]
  planInfo: any
  planNoOfTrip: any
  tripPlanInfo: any
  totalPlan: any
  currentPlan: any
  isExist: boolean = false
  innerPlanKey: any = []
  IsPresent: any
  get location() {
    return this.Tripplanner.get('location')
  }
  get date() {
    return this.Tripplanner.get('date')
  }
  get Equipments() {
    return this.Tripplanner.get('Equipments')
  }
  get destination() {
    return this.Tripplanner.get('destination')
  }
  constructor(
    private postData: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private Router: Router,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId =this.userObj.userInfo._id  // changes by shivam kashyap
    this.planInfo = this.userObj.userInfo.planData
    if (this.planInfo.length > 0) {
      let tripPlanInfo = this.planInfo.filter((planDtl) => planDtl.plan == 'TRIPPLAN' || planDtl.plan == 'CUSTOM PLAN')
      this.tripPlanInfo = tripPlanInfo.length
      if (tripPlanInfo.length) {
        let tripplanConstName = tripPlanInfo.forEach((element) => {
          let featureArray = element.features
          featureArray.forEach((ele) => this.innerPlanKey.push(ele.constName))
        })
        this.IsPresent = this.innerPlanKey.includes('NOOFTRIPS')
        if (tripplanConstName) this.planNoOfTrip = tripplanConstName[0].keyValue
      }
    }
    this.tripList(1)
  }
  reset() {
    this.searchText = ''
    this.tripStatusShow = 'UPCOMING'
    this.routeFlag = ''
    this.filterDate = null
    localStorage.removeItem('tripPlanner');
    this.tripList(1)
 

  }
  sort(key) {
    console.log(key)
    this.key = key;
    this.reverse = !this.reverse;
  }
  searchData() {
    let data = {
      createdById: this.userId,
      page: 1,
      count: this.itemsPerPage,
      routeFlag: this.routeFlag,
      runningStatus: this.tripStatusShow,
      searchText: this.searchText ? this.searchText.replace(/^\s+|\s+$/gm, '') : null,
      roleTitle: this.userObj.userInfo.roleId.roleTitle == 'COMPANY' ? this.userObj.userInfo.roleId.roleTitle : this.userObj.userInfo.accessLevel,
    }

    localStorage.setItem('tripPlanner', JSON.stringify(data))
    
    this.tripList(1)
  }
  tripList(pageNumber) {

   let tripPlannerData  = JSON.parse(localStorage.getItem('tripPlanner'))
    let data = {
      createdById: tripPlannerData?tripPlannerData.createdById: this.userId,
      page: tripPlannerData?tripPlannerData.page:pageNumber,
      count: tripPlannerData?tripPlannerData.count:this.itemsPerPage,
      routeFlag: tripPlannerData?tripPlannerData.routeFlag:this.routeFlag,
      runningStatus: tripPlannerData?tripPlannerData.runningStatus:this.tripStatusShow,
      searchText: tripPlannerData?tripPlannerData.searchText:this.searchText ? this.searchText.replace(/^\s+|\s+$/gm, '') : null,
      roleTitle: tripPlannerData?tripPlannerData.roleTitle :this.userObj.userInfo.roleId.roleTitle == 'COMPANY' ? this.userObj.userInfo.roleId.roleTitle : this.userObj.userInfo.accessLevel,
    }
  
    this.tripStatusShow=data.runningStatus
    this.routeFlag=data.routeFlag
    this.searchText=data.searchText

    if (this.routeFlag) data['filterDate'] = moment(this.filterDate).startOf('day').utc()
    this.spinner.show()
    this.postData.getdata(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.tripPlannerList = res['data']
        this.totalCount = res['totalCount']
        this.page = pageNumber
        if (this.tripPlannerList && this.tripPlannerList.length) this.noRecordFound = false
        else this.noRecordFound = true
      }
      this.spinner.hide()
    })
  }
  createTripPlan() {
    if(this.userObj.userInfo.roleId.roleTitle=='COMPANY'){
       if (!this.planInfo || this.planInfo.length == 0 || this.tripPlanInfo == 0 || !this.IsPresent) this.dialog.open(PlanConfirmationDialogComponent, { width: '550px', data: 'TRIP PLANNER' })
    else if (this.totalCount === this.planNoOfTrip) this.dialog.open(UpgradeConfirmationDialogComponent, { width: '550px' })
    else this.Router.navigate(['/layout/myaccount/trip-planner/add-trip'])
    }else{
      let data ={companyId:this.userObj.userInfo.companyId}
     this.postData.PlanStatus(data).subscribe(
       (res) => {
         if (res['code'] == 200) {
        
           if(res['data'].TRIP=='OK'){
                 this.Router.navigate(['/layout/myaccount/trip-planner/add-trip'])
           }else{
             this.dialog.open(PlanConfirmationDialogComponent, { width: '550px', data: res['data'].TRIP })
           }
         }
         this.spinner.hide()
       },
       () => this.spinner.hide()
     )
    }
   
  }

  savePageChanged(event) {
    this.tripList(event)
  }

  cancelTrip(id, listData) {
    this.dialog
      .open(InstructionDialogComponent, { width: '450px', data: { _id: id, cancelledById: this.userId, data: listData }, autoFocus: false })
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.tripStatusShow = 'UPCOMING'
          this.tripList(1)
        }
      })
  }

  completeTrip(id) {
    this.dialog
      .open(TripCompleteComponent, { width: '450px', data: { _id: id, cancelledById: this.userId, userName: this.userObj.userInfo.personName }, autoFocus: false })
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.tripStatusShow = 'UPCOMING'
          this.tripList(1)
        }
      })
  }

  startTrip(id) {
    this.dialog
      .open(TripStartComponent, { width: '450px', data: { _id: id, cancelledById: this.userId, userName: this.userObj.userInfo.personName }, autoFocus: false })
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          this.tripStatusShow = 'UPCOMING'
          this.tripList(1)
        }
      })
  }
}
