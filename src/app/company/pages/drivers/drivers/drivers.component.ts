import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NewDriverInviteComponent } from '../new-driver-invite/new-driver-invite.component'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css'],
  providers: [NgxSpinnerService]
})
export class DriversComponent implements OnInit {
  driverList: any
  SearchText: string = ''
  Active: any
  driverStatus: any
  noData: boolean
  // itemsPerPage = genralConfig.pageNationConfig.itemsPerPage
  // itemsPerPage : number = 5
  p:number = 1

  isAccepted: any = 'accept' 
  isActive: any = 'true'
  isDeleted: any = 'false'
  accessLevel: any = 'ALL'
  userObj: any
  noRecordFound: any
  page: any
  total: any
  leftUsersList: any
  formGroup1: any
  formGroup2: any
  userListPage: any = 1
  userId:any
  statusList = [
    { value: 'true', show: 'Active' },
    { value: 'fasle', show: 'In-active' },
  ]

  deleteList = [
    { value: 'false', show: 'Not-deleted' },
    { value: 'true', show: 'Deleted' },
  ]

  invitationList = [
    { value: 'accept', show: 'Accepted' },
    { value: 'decline', show: 'Declined' },
    { value: 'pending', show: 'In Progress' },
  ]
  typeCategorie = [
    { name: 'All', value: 'ALL' },
    { name: 'Dispatcher', value: 'DISPATCHER' },
    { name: 'Driver', value: 'DRIVER' },
    { name: 'HR', value: 'HR' },
  ]
  totalCount: any
  companyId: any
  totalcount: any
  planInfo: any
  tripplanLength: any
  planNoOfDeivers: any
  roleTitle: any
  status: any
  deleted:any
  public docsfor = environment.URLHOST + '/uploads/docs/'
  accessLeveL: any

  constructor(
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
    private service: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toatsr: ToastrService
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))

    if (this.userObj && this.userObj.userInfo) {
      this.userId = this.userObj.userInfo._id
    }
    if (this.userObj.userInfo.accessLevel == 'COMPANY') this.companyId = this.userObj.userInfo._id
    else if (this.userObj.userInfo.accessLevel == 'HR') this.companyId = this.userObj.userInfo.createdById
    this.roleTitle = this.userObj.userInfo.roleId.roleTitle
    this.accessLeveL = this.userObj.userInfo.accessLevel

    let manageTeamDatas  = JSON.parse(localStorage.getItem('manageTeam'))
    this.isAccepted=manageTeamDatas?manageTeamDatas.isAccepted:'accept' 
    this.isDeleted=manageTeamDatas?manageTeamDatas.isDeleted:'false'
    this.accessLevel=manageTeamDatas?manageTeamDatas.accessLevel:'ALL'
    this.SearchText=manageTeamDatas?manageTeamDatas.searchKey:''
    

    this.getDriversList(1)    
  }

  searchData(){
    let data = {
      roleName: this.userObj.userInfo.roleId.roleTitle,
      companyId: this.roleTitle == 'COMPANY' ? this.userObj.userInfo._id : this.userObj.userInfo.companyId,
      isAccepted: this.isAccepted,
      isDeleted: this.isDeleted,
      accessLevel: this.accessLevel,
      searchKey: this.SearchText ? this.SearchText.replace(/^\s+|\s+$/gm, '') : null,
      page: 1,
      // count: this.itemsPerPage,
      hrAccess: this.roleTitle != 'COMPANY' ? 'HR' : '',
    }

    localStorage.setItem('manageTeam', JSON.stringify(data))

    this.getDriversList(1)  
  }
  getDriversList(pageNumber) {

    let manageTeamData  = JSON.parse(localStorage.getItem('manageTeam'))


    let data = {
      roleName:manageTeamData?manageTeamData.roleName: this.userObj.userInfo.roleId.roleTitle,
      companyId:manageTeamData?manageTeamData.companyId:this.roleTitle == 'COMPANY' ? this.userObj.userInfo._id : this.userObj.userInfo.companyId,
      isAccepted:manageTeamData?manageTeamData.isAccepted:this.isAccepted,
      isDeleted:manageTeamData?manageTeamData.isDeleted:this.isDeleted,
      accessLevel:manageTeamData?manageTeamData.accessLevel:this.accessLevel,
      searchKey:manageTeamData?manageTeamData.searchKey:this.SearchText ? this.SearchText.replace(/^\s+|\s+$/gm, '') : null,
      page:manageTeamData?manageTeamData.page:pageNumber,
      // count: this.itemsPerPage,
      hrAccess:manageTeamData?manageTeamData.hrAccess:this.roleTitle != 'COMPANY' ? 'HR' : '',
    }
    this.spinner.show()
    this.service.getDrivers(data).subscribe(
      (res) => {
        this.driverList = res['data']
        this.status = this.isAccepted
        this.deleted = this.isDeleted
        this.totalcount = res['totalCount']
      
        this.userListPage = pageNumber
        if (this.driverList && this.driverList.length) this.noData = false
        else this.noData = true
        this.spinner.hide()
      },
      () => this.spinner.hide()
    )
  }

  savePageChangedList(event) {
    this.userListPage = event
    this.getDriversList(this.userListPage)
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    this.dialog.open(NewDriverInviteComponent, { height: '450px', width: '900px' })
  }

  reset() {
    this.p = 1
    this.isActive = 'true'
    this.isDeleted = 'false'
    this.isAccepted = 'accept'
    this.accessLevel = 'ALL'
    this.SearchText = ''
    localStorage.removeItem('manageTeam')
    this.getDriversList(1)
  }
  removeEmployee(company, name, type, personName) {
    let data = { userId: name, companyId: company, reason: 'Remove by company', accessLevel: this.userObj.userInfo.accessLevel, userName: personName, loginId: this.userObj.userInfo._id }
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    this.dialog
      .open(NewDriverInviteComponent, { height: '150px', width: '500px', data: type })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.spinner.show()
          this.service.leaveCompany(data).subscribe(
            (res) => {
              if (res['code'] == 200) {
                this.toatsr.success('Member removed successfully')
                this.getDriversList(1)
              } else this.toatsr.warning(res['message'])
              this.spinner.hide()
            },
            () => this.spinner.hide()
          )
        }
      })
  }


  //! IN FUTURE IF REMOVE ANY ROLE ITS BECOME ENDUSER
  deleteEmployee(company, userId, type, isDeleted) {
    let data = { userId: userId, companyId: company, reason: 'Deleted by company', accessLevel: this.userObj.userInfo.accessLevel, isDeleted: isDeleted, loginId: this.userObj.userInfo._id }
    const dialogConfig = new MatDialogConfig()
    
    dialogConfig.disableClose = true
    this.dialog
      .open(NewDriverInviteComponent, { height: '150px', width: '500px', data: type})
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.spinner.show()
          this.service.deleteCompany(data).subscribe(
            (res) => {
              if (res['code'] == 200) {
                this.toatsr.success('Member removed successfully')
                this.getDriversList(1)
              } else this.toatsr.warning(res['message'])
              this.spinner.hide()
            },
            () => this.spinner.hide()
          )
        }
      })
  }




  companyLeftUsers(page) {
    let data = { companyId: this.companyId, page: page,
      //  count: this.itemsPerPage,
        searchText: this.SearchText }
    this.spinner.show()
    this.service.leftUsersList(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.leftUsersList = res['data']
          this.totalCount = res['totalCount']
          if (this.leftUsersList && this.leftUsersList.length) this.noRecordFound = false
          else this.noRecordFound = true
        }
        this.spinner.hide()
      },
      () => this.spinner.hide()
    )
  }

  savePageChanged(e) {
    this.page = e
    this.userListPage = e
    this.getDriversList(this.userListPage)
    this.companyLeftUsers(this.page)
  }

  Reset() {
    if (this.SearchText != '') {
      this.SearchText = ''
      this.companyLeftUsers(this.page)
    }
    localStorage.removeItem('manageTeam');

  }

  resendInvite(userDetails){
    let constKey
    switch (userDetails.accessLevel) {
      case 'HR':
        constKey = 'NOOFHR'
        break
      case 'DRIVER':
        constKey = 'NOOFDRIVERS'
        break
      case 'DISPATCHER':
        constKey = 'NOOFDISPATCHER'
        break
    }
   
    let data = {
   firstName:userDetails.firstName,
   lastName:userDetails.lastName,
   email:userDetails.email,
   mobileNumber:userDetails.mobileNumber,
   accessLevel:userDetails.accessLevel,
   companyId:userDetails.companyId,
   createdById:userDetails.createdById,
   planTitle:'TRIPPLAN',
   constName:constKey,
   roleTitle:this.userObj.userInfo.roleId.roleTitle == 'COMPANY' ? this.userObj.userInfo.roleId.roleTitle : this.userObj.userInfo.accessLevel
    
  }
  this.spinner.show()
  this.service.driverRegister(data).subscribe((result) => {
    if (result['code'] == 200) {
      this.toatsr.success(result['message'])
      this.spinner.hide()
      this.getDriversList(1)
    } 
    else {
      this.toatsr.error(result['message'])
      this.spinner.hide()
    }
  })
  }
  invitationDeleteByCompany(email){
   let data = {email : email }
   this.spinner.show()
    this.service.invitationDeleteByCompany(data).subscribe((result) => {
      if (result['code'] == 200) {
        this.toatsr.success(result['message'])
        this.spinner.hide()
        this.getDriversList(1)
      } 
      else {
        this.spinner.hide()
      }
    }) 
  }
  sportHandler(val) {
    if (!val.selectedIndex) this.getDriversList(1)
    else this.companyLeftUsers(1)
  }
}
