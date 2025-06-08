import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css'],
})
export class DriverListComponent implements OnInit {
  SearchText: any
  noRecordFound: any
  userObj: any
  driverList: any
  noData: boolean
  totalCount: any
  total: any
  page: any
  itemsPerPage = genralConfig.pageNationConfig.itemsPerPage
  defaultStatus: string = 'ALL'
  driverFilter = [
    { value: 'ALL', show: 'All' },
    { value: 'IDLE', show: 'Idle' },
    { value: 'ACTIVE', show: 'Active' },
  ]
  constructor(private service: GeneralServiceService, private spinner: NgxSpinnerService, private ngZone: NgZone, private changeDetector: ChangeDetectorRef) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.getDispatcherToDriverList(1)
  }

  savePageChanged(event) {
    this.getDispatcherToDriverList(event)
  }
  getDispatcherToDriverList(pageNumber) {
    let data = {
      companyId: this.userObj.userInfo.createdById,
      accessLevel: 'DISPATCHER',
      isAccepted: this.defaultStatus,
      searchKey: this.SearchText ? this.SearchText.replace(/^\s+|\s+$/gm, '') : null,
      page: pageNumber,
      count: this.itemsPerPage,
    }
    this.spinner.show()
    this.service.showDriver(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.driverList = res['data']
        this.totalCount = res['totalCount']
        this.page = pageNumber
        if (this.driverList && this.driverList.length == 0) this.noData = true
        else this.noData = false
      }
      this.spinner.hide()
    })
  }

  reset() {
    this.SearchText = ''
    this.defaultStatus = 'ALL'
    this.getDispatcherToDriverList(1)
  }
}
