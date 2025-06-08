import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { genralConfig } from 'src/app/constant/genral-config.constant'

import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
import { LoginDialogComponent } from 'src/app/pages/login-dialog/login-dialog.component'
import { MatDialog } from '@angular/material'

@Component({
  selector: 'app-my-jobs',
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.css'],
})
export class MyJobsComponent implements OnInit {
  userId: any
  userObj: any
  savedJob: any
  appliedJoblist: any
  isSavedJobsNoRecod: boolean
  isSavedJobs: boolean
  isAppliedJobs: boolean
  isAppliedJobsNoRecod: boolean

  postCount: any
  totalCount: any
  page: number = 1
  itemsPerPage = 10
  noData: boolean
  Savedpage = 1
  filterType: any
  searchText: String = ''
  totalCountsav: any
  pagesav: any
  pageNumber = 1
  favorite = true
  applied = false

  constructor(
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    window.scroll(0, 0)
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.savedJoblist(1)
  }
  showSubsPopUp() {
    this.dialog.open(LoginDialogComponent, { width: '500px', data: 'PLANFEATURE' })
  }

  getTabChangeValue(event) {
    this.filterType = event.tab.textLabel
    switch (this.filterType) {
      case 'Favorite':
        this.savedJoblist(1)
        break

      case 'Applied':
        this.appliedJob(1)
        break
    }
  }

  savedJoblist(pageNumber) {
    let data = {
      userId: this.userId,
      count: genralConfig.paginator.COUNT,
      page: pageNumber,
    }
    this.spinner.show()
    this._generalService.savedJobsList(data).subscribe((res) => {
      if (res['code'] == 200) {
        window.scroll(0, 0)
        this.savedJob = res['data']
        this.totalCountsav = res['totalCount']

        this.Savedpage = pageNumber
        this.postCount = res['count']
        this.favorite = true
        this.applied = false

        if (this.savedJob.length > 0) {
          this.isSavedJobsNoRecod = true
        } else {
          this.isSavedJobsNoRecod = false
        }
        this.spinner.hide()
      } else {
        this.toastr.warning(res['message'])
        this.spinner.show()
      }
    })
  }
  savePageChanged(event) {
    this.savedJoblist(event)
    this.Savedpage = event
  }

  appliedJob(pageNumber) {
    let data = {
      userId: this.userId,
      count: genralConfig.paginator.COUNT,
      page: pageNumber,
    }
    this.spinner.show()
    this._generalService.appliedJobs(data).subscribe((res) => {
      if (res['code'] == 200) {
        window.scroll(0, 0)
        this.appliedJoblist = res['data']
        this.totalCount = res['totalCount']
        this.page = pageNumber
        this.favorite = false
        this.applied = true
        this.postCount = res['count']
        if (this.appliedJoblist.length > 0) {
          this.isAppliedJobsNoRecod = true
        } else {
          this.isAppliedJobsNoRecod = false
        }
        if (this.appliedJoblist.length > 4) {
          this.isAppliedJobs = true
        } else {
          this.isAppliedJobs = false
        }
        this.spinner.hide()
      } else {
        this.toastr.warning(res['message'])
        this.spinner.hide()
      }
    })
  }
  unsaveJob(jobId) {
    let data = {
      jobId: jobId,
      userId: this.userId,
    }
    this._generalService.unSaveJob(data).subscribe((res) => {
      this.spinner.show()
      if (res['code'] == 200) {
        this.spinner.hide()
        this.savedJoblist(1)
        this.toastr.success(res['message'])
      } else {
        this.spinner.hide()
        this.toastr.warning(res['message'])
      }
    })
  }
  pageChanged(event) {
    this.appliedJob(event)
  }
}
