import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { genralConfig } from 'src/app/constant/genral-config.constant'
@Component({
  selector: 'app-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.css'],
})
export class ViewJobComponent implements OnInit {
  jobId: any
  jobData: any = []
  userId: any
  roleName: any
  jobMaxSalary:any
  jobMinSalary:any
  isApply: Boolean = false
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
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleName = userData.userInfo.roleId.roleTitle
    if (userData && userData.userInfo) {
      this.userId = userData.userInfo._id
      this.roleName = userData.userInfo.roleId.roleTitle
    }
    if (this.roleName == genralConfig.rolename.USER) this.isApply = true
    else this.isApply = false
    this.route.params.subscribe((params) => (this.jobId = params.id))
    this.getJobInfo()
  }
  getJobInfo() {
    this.spinner.show()
    let jobDataObj = { _id: this.jobId, userId: this.userId }
    this._generalService.jobView(jobDataObj).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.jobData = res['data'] 
         
        if(this.jobData.salaryRang[0].max != null && this.jobData.salaryRang[0].max>=0){
          this.jobMaxSalary = this.jobData.salaryRang[0].max.toString()
          // this.jobMinSalary = new Intl.NumberFormat('en-IN').format( this.jobData.salaryRang[0].max)
        }
        else{
          this.jobMaxSalary = "N/A"
        }
        if(this.jobData.salaryRang[0].min != null && this.jobData.salaryRang[0].min>=0){
          this.jobMinSalary = this.jobData.salaryRang[0].min.toString() 
          // this.jobMaxSalary = new Intl.NumberFormat('en-IN').format( this.jobData.salaryRang[0].min)

        }else{
          this.jobMinSalary = "N/A"
        }


         console.log(this.jobData,"this.jobDatathis.jobData")
        //  console.log(this.jobData.salaryRang[0].min.toString(),"this.jobDatathis.jobData")}
        }
        else {
          window.scrollTo(0, 0)
          this.toastr.error('error', res['message'])
        }
        this.spinner.hide()
      },
      (err) => {
        this.toastr.error('error')
        this.spinner.hide()
      }
    )
  }
  goBack() {
    this.router.navigate(['layout/myaccount/jobs'])
  }
}
