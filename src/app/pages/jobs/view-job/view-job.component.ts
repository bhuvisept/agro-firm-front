import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { MatDialog } from '@angular/material'
import { ApplyjobDialogComponent } from '../applyjob-dialog/applyjob-dialog.component'
import { SavejobDialogComponent } from '../savejob-dialog/savejob-dialog.component'
@Component({
  selector: 'app-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.css'],
})
export class ViewJobComponent implements OnInit {
  jobId: any
  jobData: any = []
  userId: String = ''
  roleName: any
  isApply: Boolean = false
  isApplied: void
  jobDataObj: any = {}
  website: any
  companyId: any
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private _generalService: GeneralServiceService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    if (userData && userData.userInfo) {
      this.userId = userData.userInfo._id
      this.roleName = userData.userInfo.roleId.roleTitle
    }
    this.route.params.subscribe((params) => {
      this.jobId = params.id
    })
    this.getJobInfo()
    window.scroll(0, 0)
  }
  applyForJob(id) {
    const dialogRef = this.dialog.open(ApplyjobDialogComponent, {
      width: '800px',
      data: { jobId: id, jobData: this.jobData },
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        setTimeout(() => {
          this.getJobInfo()
        }, 1000)
      }
    })
  }
  getJobInfo() {
    this.spinner.show()
    if (this.userId) {
      this.jobDataObj = { _id: this.jobId, userId: this.userId }
    }
    if (!this.userId) {
      this.jobDataObj = { _id: this.jobId }
    }

    this._generalService.jobView(this.jobDataObj).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.jobData = res['data']
          this.spinner.hide()
          this.website = this.jobData.companyWebsite
          this.companyId = this.jobData.createdById
        } else {
          window.scrollTo(0, 0)
          // this.toastr.error('error', res['message']);
          this.spinner.hide()
        }
      },
      (error) => {
        this.toastr.error('error')
        this.spinner.hide()
      }
    )
  }
  savedJob(id) {
    const dialogRef1 = this.dialog.open(SavejobDialogComponent, {
      width: '500px',
      data: { jobId: id },
    })
    dialogRef1.afterClosed().subscribe((result) => {
      if (result) {
        let data = {
          userId: this.userId,
          jobId: this.jobId,
          companyId: this.companyId,
        }
        this.spinner.show()
        this._generalService.savedJobs(data).subscribe((res: any) => {
          this.spinner.hide()
          if (res['code'] == 200) {
            this.getJobInfo()
            this.toastr.success(res.message)
          } else {
            this.getJobInfo()
            this.toastr.error(res.message)
          }
        })
      }
    })
  }
  login() {
    this.router.navigate(['/login'])
  }
  userRegister() {
    this.router.navigate(['/signup/user-signup'])
  }
  back() {
    this.router.navigate(['/pages/search-job/jobs'])
  }
}
