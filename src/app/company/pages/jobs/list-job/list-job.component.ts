import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { ConfirmationDialogComponent } from 'src/app/company/confirmation-dialog/confirmation-dialog.component'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ConfirmationDialogueComponent } from '../confirmation-dialogue/confirmation-dialogue.component'
import { PlanConfirmationDialogComponent } from 'src/app/plan-confirmation-dialog/plan-confirmation-dialog.component'
import { UpgradeConfirmationDialogComponent } from 'src/app/upgrade-confirmation-dialog/upgrade-confirmation-dialog.component'
@Component({
  selector: 'app-list-job',
  templateUrl: './list-job.component.html',
  styleUrls: ['./list-job.component.css'],
})
export class ListJobComponent implements OnInit {
  jobsList: any = []
  totalCount: any
  page: number = 1
  itemsPerPage = 10
  pagi: boolean = false
  noRecordFound: boolean = false
  statusList = [
    { value: 'true', name: 'Active' },
    { value: 'false', name: 'In-active' },
  ]
  public isActive: String = 'true'
  deleteArray = [
    { value: 'true', name: 'Archived' },
    { value: 'false', name: 'Unarchived' },
  ]
  deleted: any = 'false'
  search: string
  postCount: any
  userId: any
  planInfo: any
  planNoOfJobs: any
  planNoOfHr: any
  jobLength: any
  roleTitle: any
  userData: any
  totalPlan: any
  currentPlan: any
  innerPlanKey: any = []
  IsExist: any
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private _generalService: GeneralServiceService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.zone.run(() => this.changeDetector.detectChanges()))
  }

  setChanged() {}

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleTitle = this.userData.userInfo.roleId.roleTitle
    this.planInfo = this.userData.userInfo.planData
    if (this.planInfo.length > 0) {
      const jobPlanInfo = this.planInfo.filter((planDtl) => planDtl.plan == 'JOB' || planDtl.plan == 'CUSTOM PLAN')
      this.jobLength = jobPlanInfo.length
      if (jobPlanInfo.length) {
        let jobConstName = jobPlanInfo.forEach((element) => {
          let featureArray = element.features
          featureArray.forEach((ele) => this.innerPlanKey.push(ele.constName))
        })
        this.IsExist = this.innerPlanKey.includes('NOOFJOBS')
        if (jobConstName) this.planNoOfJobs = jobConstName[0].keyValue
      }
    }
    this.userId = this.userData.userInfo._id
    if ((this.userData && this.userData.userInfo && this.userData.userInfo.roleId.roleTitle == genralConfig.rolename.COMPANY) || genralConfig.rolename.HR) this.getJobLists(1)
    else this.router.navigate(['/home-page'])
    window.scroll(0, 0)
  }
  reset() {
    this.search = ''
    this.isActive = 'true'
    this.deleted = 'false'
    this.getJobLists(1)
  }
  getJobLists(pageNumber) {
    let data = {
      count: genralConfig.paginator.COUNT,
      companyId: this.roleTitle == 'COMPANY' ? this.userId : this.userData.userInfo.companyId,
      page: pageNumber,
      searchText: this.search ? this.search : '',
      isDeleted: this.deleted ? this.deleted : 'false',
      isActive: this.isActive ? this.isActive : 'true',
      userId: this.userId,
    }
    this.spinner.show()
    this._generalService.jobsLists(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.jobsList = response['data']
          this.totalCount = response['totalCount']
          this.page = pageNumber
          if (this.jobsList.length && this.jobsList) this.noRecordFound = false
          else this.noRecordFound = true
        }
        this.spinner.hide()
      },
      () => {
        this.toastr.show('Some error in event list')
        this.spinner.hide()
      }
    )
  }
  createPost() {
    if(this.roleTitle=='COMPANY'){
     if (!this.planInfo || this.planInfo.length == 0 || this.jobLength == 0 || !this.IsExist) this.dialog.open(PlanConfirmationDialogComponent, { width: '550px', data: 'JOB' })
     else if (this.totalCount === this.planNoOfJobs) this.dialog.open(UpgradeConfirmationDialogComponent, { width: '550px' })
     else this.router.navigate(['/layout/myaccount/jobs/create-job'])
   }else{
     let data ={companyId:this.userData.userInfo.companyId}
    this._generalService.PlanStatus(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
        console.log(res['data'],"1111111111111")
          if(res['data'].JOB=='OK'){
                this.router.navigate(['/layout/myaccount/jobs/create-job'])
          }else{
            this.dialog.open(PlanConfirmationDialogComponent, { width: '550px', data: res['data'].JOB })
          }
        }
        this.spinner.hide()
      },
      () => this.spinner.hide()
    )
   }
   
    
  }
  pageChanged(event) {
    this.getJobLists(event)
  }
  moveToJobDetail() {
    this.router.navigateByUrl('layout/jobs/job-details')
  }

  deleteItem(id) {
    this.dialog
      .open(ConfirmationDialogComponent, { width: '450px', data: 'Are_delete_job' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.spinner.show()
          this._generalService.parmanentDeleteJob({ id: id }).subscribe((res: any) => {
            this.spinner.hide()
            if (res['code'] == 200) {
              this.toastr.success(res.message)
              this.getJobLists(1)
            } else this.toastr.error(res.message)
          })
        }
      })
  }
  archiveItem(id) {
    this.dialog
      .open(ConfirmationDialogComponent, { width: '450px', data: 'Are_archive_job' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.spinner.show()
          this._generalService.deleteJob({ id: id }).subscribe((res: any) => {
            this.spinner.hide()
            if (res && res.code == genralConfig.statusCode.ok) {
              this.toastr.success(res.message)
              this.getJobLists(1)
            } else this.toastr.error(res.message)
          })
        }
      })
  }

  onChange(data, jobIsActive) {
    this.dialog
      .open(ConfirmationDialogueComponent, { width: '350px', data: { jobIsActive: jobIsActive } })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.spinner.show()
          let obj = { id: data._id, isActive: data.isActive,constName: "NOOFJOBS" ,  planTitle: "JOB",companyId: this.roleTitle == 'COMPANY' ? this.userId : this.userData.userInfo.companyId,roleTitle:this.roleTitle }
          this._generalService.ChangeJobStatus(obj).subscribe(
            (res: any) => {
              this.spinner.hide()
              if (res && res.code == genralConfig.statusCode.ok) {
                this.toastr.success(res.message)
                this.getJobLists(1)
              } else this.toastr.error(res.message)
            },
            () => {
              this.toastr.error('Something went wrong')
              this.spinner.hide()
            }
          )
        }
      })
  }
}
