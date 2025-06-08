import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { environment } from 'src/environments/environment'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ConfirmationDialogueComponent } from '../confirmation-dialogue/confirmation-dialogue.component'
import { MatDialog } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { Router } from '@angular/router'
import { PlanConfirmationDialogComponent } from 'src/app/plan-confirmation-dialog/plan-confirmation-dialog.component'
import { UpgradeConfirmationDialogComponent } from 'src/app/upgrade-confirmation-dialog/upgrade-confirmation-dialog.component'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast'

@Component({
  selector: 'app-truck-list',
  templateUrl: './truck-list.component.html',
  styleUrls: ['./truck-list.component.css'],
})
export class TruckListComponent implements OnInit {
  truckList: any = []
  truckPath = environment.URLHOST + '/uploads/truck/'
  TRAILERIMAGE = environment.URLHOST + '/uploads/truck/trailer/'
  truckId: any
  typeCheck: any
  data: any
  checked: any = true
  truckStatus: any
  noData: boolean
  searchText: String = ''
  isActive: string = 'true'
  currentPage: number
  itemsPerPage = 5

  page: any
  count: any
  statusList = [
    { value: 'true', show: 'Active' },
    { value: 'false', show: 'In-active' },
  ]
  deleted: any = 'false'
  deleteList = [
    { value: 'true', show: 'Archived' },
    { value: 'false', show: 'Unarchived' },
  ]
  totalCount: any
  userObj: any
  userId: any
  userRoleName: any
  planInfo: any
  planNoOfTrip: any
  tripplanLength: any
  totalPlan: any
  currentPlan: any
  innerPlanKey: any = []
  IsExist: any
  roleTitle: any
  constructor(
    private service: GeneralServiceService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private Router: Router,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.roleTitle = this.userObj.userInfo.roleId.roleTitle
    this.planInfo = this.userObj.userInfo.planData
    if (this.planInfo.length > 0) {
      let tripPlanInfo = this.planInfo.filter((planDtl) => planDtl.plan == 'TRIPPLAN' || planDtl.plan == 'CUSTOM PLAN' || planDtl.plan == 'GPS')
      this.tripplanLength = tripPlanInfo.length
      if (tripPlanInfo.length) {
        let tripplanConstName = tripPlanInfo.forEach((element) => {
          let featureArray = element.features
          featureArray.forEach((ele) => this.innerPlanKey.push(ele.constName))
        })
        this.IsExist = this.innerPlanKey.includes('NOOFTRUCKANDTRAILERS')
        if (tripplanConstName) this.planNoOfTrip = tripplanConstName[0].keyValue
      }
    }
    this.userRoleName = this.userObj.userInfo.roleId.roleTitle


    let fleetManager  = JSON.parse(localStorage.getItem('fleetManager'))
    console.log(fleetManager,"fleetManager");
    
    this.searchText = fleetManager?fleetManager.searchText:''
    this.isActive=fleetManager?fleetManager.isActive:'true'
    this.deleted=fleetManager?fleetManager.isDeleted: 'false'

    
    this.getTrucks(1)
  }

searchData(){
  let data = {
    roleName: this.userRoleName,
    userId: this.userId,
    // companyId: this.userObj.userInfo.companyId ? this.userObj.userInfo.companyId : this.userObj.userInfo._id,
    companyId: this.userObj.userInfo.createdById ? this.userObj.userInfo.createdById : this.userObj.userInfo._id,  // changes by shivam kashyap jun 14
    searchText: this.searchText ? this.searchText.replace(/^\s+|\s+$/gm, '') : null,
    isDeleted: this.deleted,
    isActive: this.isActive,
    page: 1,
    count: 5
  }

  localStorage.setItem('fleetManager', JSON.stringify(data))

  this.getTrucks(1) 
}

  getTrucks(pageNumber) {

    let fleetManager  = JSON.parse(localStorage.getItem('fleetManager'))

    let data = {
      roleName:fleetManager?fleetManager.roleName: this.userRoleName,
      userId:fleetManager?fleetManager.userId: this.userId,
      // companyId: this.userObj.userInfo.companyId ? this.userObj.userInfo.companyId : this.userObj.userInfo._id,
      companyId:fleetManager?fleetManager.companyId: this.userObj.userInfo.createdById ? this.userObj.userInfo.createdById : this.userObj.userInfo._id,  // changes by shivam kashyap jun 14
      searchText:fleetManager?fleetManager.searchText: this.searchText ? this.searchText.replace(/^\s+|\s+$/gm, '') : null,
      isDeleted:fleetManager?fleetManager.isDeleted: this.deleted,
      isActive:fleetManager?fleetManager.isActive: this.isActive,
      page:fleetManager?fleetManager.pageNumber: pageNumber,
      count:fleetManager?fleetManager.count: 5,
    }

    this.spinner.show()
    this.service.getTrucks(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.spinner.hide()
          this.truckList = res['data']
          this.totalCount = res['totalCount']
          this.page = pageNumber
          if (this.truckList.length > 0) this.noData = false
          else this.noData = true
        }
        this.spinner.hide()
      },
      () => this.toastr.error('Something went wrong')
    )
  }
  createVehicle() {
    console.log(this.userRoleName)
    if(this.userRoleName=='COMPANY'){
   if (!this.planInfo || this.planInfo.length == 0 || this.tripplanLength == 0 || !this.IsExist)
      this.dialog.open(PlanConfirmationDialogComponent, { width: '550px', data: this.userObj.userInfo.accessLevel == 'ENDUSER' ? 'GPS' : 'TRIP PLANNER' })
    else if (this.totalCount === this.planNoOfTrip) this.dialog.open(UpgradeConfirmationDialogComponent, { width: '550px' })
    else this.Router.navigate(['/layout/myaccount/manage-truck/add-truck'])
    }else{
      let data;
      if(this.userObj.userInfo.accessLevel == 'ENDUSER' && this.userObj.userInfo.invitedBy == null){
         data ={companyId:this.userObj.userInfo._id}
      }else{
         data ={companyId:this.userObj.userInfo.companyId}
      }
      
     this.service.PlanStatus(data).subscribe(
       (res) => {
       
         if (res['code'] == 200) {
      
           if(res['data'].FLEET=='OK'){
                 this.Router.navigate(['/layout/myaccount/manage-truck/add-truck'])
           }else{
             this.dialog.open(PlanConfirmationDialogComponent, { width: '550px', data: res['data'].FLEET })
           }
         }
         this.spinner.hide()
       },
       () => this.spinner.hide()
     )
    }
 
  }
  deleteTruck(id) {
    this.dialog
      .open(ConfirmationDialogueComponent, { width: '350px' })
      .afterClosed()
      .subscribe((data) => {
        if (data == true) {
          let data = { id: id }
          this.spinner.show()
          this.service.deleteTruck(data).subscribe((res) => {
            if (res['code'] == 200) {
              this.toastr.success(res['message'])
              this.getTrucks(1)
            }
            this.spinner.hide()
          })
        }
      })
  }

  toggleChange(e) {
    if (this.truckStatus) this.checked = false
  }
  changeStatus(id, isActive) {
    let data = {
      id: id,
      isActive: isActive,
      planTitle: 'TRIPPLAN',
      constName: 'NOOFTRUCKANDTRAILERS',
      companyId: this.roleTitle == 'COMPANY' ? this.userObj.userInfo._id : this.userObj.userInfo.companyId,
      roleTitle: this.roleTitle,
    }
    this.service.changeStatus(data).subscribe((res) => {
      if (res['code'] == 200) this.toastr.success(res['message'])
      this.getTrucks(1)
    })
  }
  reset() {
    this.searchText = ''
    this.isActive = 'true'
    this.deleted = 'false'
    localStorage.removeItem('fleetManager');

    this.getTrucks(1)
  }

  savePageChanged(event) {
    this.getTrucks(event)
  }
}
