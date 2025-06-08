import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { TripCompleteComponent } from 'src/app/company/pages/trip-planner/trip-complete/trip-complete.component'
import { DriverTripCompleteComponent } from '../driver-trip-complete/driver-trip-complete.component'
import { NgxSpinnerService } from 'ngx-spinner'
import { StartTripDialogComponent } from '../start-trip-dialog/start-trip-dialog.component'
@Component({
  selector: 'app-planned-trip',
  templateUrl: './planned-trip.component.html',
  styleUrls: ['./planned-trip.component.css'],
})
export class PlannedTripComponent implements OnInit {
  tripPlannerList: any
  userObj: any
  userID: any
  noRecordFound: boolean

  itemsPerPage = genralConfig.pageNationConfig.itemsPerPage
  totalCount: any
  page: any
  companyId: any
  searchText
  tripStatusShow: string = 'ALL'
  tripStatus = [
    { value: 'ALL', show: 'All' },
    { value: 'ACTIVE', show: 'Active' },
    { value: 'CANCELLED', show: 'Cancelled' },
    { value: 'COMPLETED', show: 'Completed' },
    { value: 'UPCOMING', show: 'Upcoming' },
  ]
  constructor(private listData: GeneralServiceService, private dialog: MatDialog, private spinner: NgxSpinnerService, private ngZone: NgZone, private changeDetector: ChangeDetectorRef) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.companyId = this.userObj.userInfo.createdById
    this.userID = this.userObj.userInfo._id
    this.tripList(1)
  }

  reset() {
    this.searchText = ''
    this.tripStatusShow = 'ALL'
    this.tripList(1)
  }

  searchData() {
    this.tripList(1)
  }
  tripList(pageNumber) {
    let data = {
      createdById: this.companyId,
      driverId: this.userID,
      page: pageNumber,
      count: this.itemsPerPage,
      runningStatus: this.tripStatusShow,
      searchText: this.searchText ? this.searchText.replace(/^\s+|\s+$/gm, '') : null,
    }
    this.spinner.show()
    this.listData.getdata(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.tripPlannerList = res['data']
        console.log(this.tripPlannerList[0].destination,"-===================")
        this.totalCount = res['totalCount']
        this.page = pageNumber
        if (this.tripPlannerList && this.tripPlannerList.length) this.noRecordFound = false
        else this.noRecordFound = true
      }
      this.spinner.hide()
    })
  }
  savePageChanged(element) {
    this.page = element
    this.tripList(element)
  }

  completeTrip(id) {
    this.dialog
      .open(DriverTripCompleteComponent, { width: '450px', data: { _id: id, cancelledById: this.userID, userName: this.userObj.userInfo.personName }, autoFocus: false })
      .afterClosed()
      .subscribe((res) => res == true && this.tripList(1))
  }

  startTrip(id) {
    this.dialog
      .open(StartTripDialogComponent, { width: '450px', data: { _id: id, cancelledById: this.userID, userName: this.userObj.userInfo.personName }, autoFocus: false })
      .afterClosed()
      .subscribe((res) => res == true && this.tripList(1))
  }
}
