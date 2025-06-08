import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
import { environment } from 'src/environments/environment'
import { Router } from '@angular/router'
import { ConfirmationDialogComponent } from 'src/app/company/pages/service/confirmation-dialog/confirmation-dialog.component'
import { MatDialog } from '@angular/material'
import { PlanConfirmationDialogComponent } from 'src/app/plan-confirmation-dialog/plan-confirmation-dialog.component'
import { UpgradeConfirmationDialogComponent } from 'src/app/upgrade-confirmation-dialog/upgrade-confirmation-dialog.component'

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css'],
})
export class ServiceListComponent implements OnInit {
  userId: string
  minelist: any
  count: any
  page: number = 1
  itemsPerPage: number = 10
  currentPage: number
  searchText: String = ''
  roleName: any
  pageNew: any
  newtotalCount: any
  planInfo: any
  planNoOfServices: any
  roleTitle: any
  deleteArray = [
    { value: 'true', name: 'Archived' },
    { value: 'false', name: 'Unarchived' },
  ]
  deleted: any = 'false'
  servicesLength: any
  public SERVICEIMAGE = environment.URLHOST + '/uploads/service/thumbnail/'
  totalPlan: any
  currentPlan: any
  isExist: boolean = false
  innerPlanKey: any = []
  IsPresent: any
  constructor(
    private service: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private Router: Router,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }
  ngOnInit() {
    window.scroll(0, 0)
    this.getUserId()


    let servicesData  = JSON.parse(localStorage.getItem('services'))
    this.deleted=servicesData?servicesData.isDeleted:'false'
    this.searchText=servicesData?servicesData.searchText:''
    this.getServicesList(1)
  }
searchData(){
  let data = { _id: this.userId, searchText: this.searchText ? this.searchText : '', page: 1, isDeleted: this.deleted }

  localStorage.setItem('services', JSON.stringify(data))
  this.getServicesList(1)
}

  getUserId() {
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleName = userData.userInfo.roleId.roleTitle
    if (userData && this.roleName == 'ENDUSER') this.Router.navigateByUrl('/login')
    if (userData && userData.userInfo) this.userId = userData.userInfo._id
    this.planInfo = userData.userInfo.planData
    if (this.planInfo.length > 0) {
      let servicesPlanInfo = this.planInfo.filter((planDtl) => planDtl.plan == 'SERVICE' || planDtl.plan == 'CUSTOM PLAN')
      this.servicesLength = servicesPlanInfo.length
      if (servicesPlanInfo.length) {
        let servicesConstName = servicesPlanInfo.forEach((element) => {
          let featureArray = element.features
          featureArray.forEach((ele) => this.innerPlanKey.push(ele.constName))
        })
        this.IsPresent = this.innerPlanKey.includes('NOOFSERVICES')
        if (servicesConstName) this.planNoOfServices = servicesConstName[0].keyValue
      }
    }
  }
  getServicesList(element) {

    let servicesData  = JSON.parse(localStorage.getItem('services'))

    this.spinner.show()
    let data = {
       _id:servicesData?servicesData._id: this.userId,
       searchText:servicesData?servicesData.searchText: this.searchText ? this.searchText : '', 
       page:servicesData?servicesData.page: element, 
       isDeleted:servicesData?servicesData.isDeleted: this.deleted 
      }
    this.service.listService(data).subscribe((Response) => {
      if (Response['code'] == 200) {
        this.minelist = Response['data']
        this.newtotalCount = Response['totalCount']
        this.pageNew = element
      } else this.toastr.warning('', Response['message'])
      this.spinner.hide()
    })
  }
  createServices() {
    if (!this.planInfo || this.planInfo.length == 0 || this.servicesLength == 0 || !this.IsPresent) this.dialog.open(PlanConfirmationDialogComponent, { width: '550px', data: 'SERVICE' })
    else if (this.newtotalCount === this.planNoOfServices) this.dialog.open(UpgradeConfirmationDialogComponent, { width: '550px' })
    else this.Router.navigate(['/layout/myaccount/service/Add-service'])
  }
  onDelete(userid) {
    let data = { id: userid }
    this.service.DeleteService(data).subscribe(() => this.getServicesList(1))
  }
  resetbutton() {
  
      this.searchText = ''
      this.deleted = 'false'
      localStorage.removeItem('services');

      this.getServicesList(1)
 
  }
  deleteServices(id) {
    this.dialog
      .open(ConfirmationDialogComponent, { width: '350px' })
      .afterClosed()
      .subscribe((res) => {
        if (res == true) {
          let data = { id: id }
          this.service.DeleteService(data).subscribe(() => this.getServicesList(1))
        }
      })
  }
  savePageChanged(element) {
    this.getServicesList(element)
  }
}
