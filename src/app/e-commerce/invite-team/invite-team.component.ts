import { Component, Renderer2, OnInit, Inject } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { MatDialog, MatDialogConfig } from '@angular/material'
import { DialogInviteTeamComponent } from '../dialog-invite-team/dialog-invite-team.component'
import { NgxSpinnerService } from 'ngx-spinner'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { genralConfig } from 'src/app/constant/genral-config.constant'
@Component({
  selector: 'app-invite-team',
  templateUrl: './invite-team.component.html',
  styleUrls: ['./invite-team.component.css'],
})
export class InviteTeamComponent implements OnInit {
  itemsPerPage = genralConfig.pageNationConfig.itemsPerPage
  acceptStatus: any = 'accept'
  invitePerson: any = ''
  search: any = ''
  statusList = [
    { value: 'true', show: 'Active' },
    { value: 'fasle', show: 'In-active' },
  ]
  deleteList = [
    { value: 'false', show: 'not-deleted' },
    { value: 'true', show: 'deleted' },
  ]
  invitationList = [
    { value: 'accept', show: 'Accepted' },
    { value: 'decline', show: 'Declined' },
    { value: 'pending', show: 'In Progress' },
  ]
  typeCategorie = [{ name: 'Salesperson', value: 'SALESPERSON' }]
  userObj: any
  companyId: any
  inviteList: any
  SearchText: string = ''
  accessLevel: any = 'SALESPERSON'
  isAccepted: any = 'accept'
  isActive: any = 'true'
  isDeleted: any = 'false'
  page: any
  totalcount: any
  noData: boolean
  userListPage: any = 1
  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2, private service: GeneralServiceService, private dialog: MatDialog, private spinner: NgxSpinnerService) {}
  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    if (this.userObj.userInfo.accessLevel == '"SELLER"') this.companyId = this.userObj.userInfo._id
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')

    let inviteTeamSeller  = JSON.parse(localStorage.getItem('inviteTeamSeller'))
    this.accessLevel= inviteTeamSeller?inviteTeamSeller.accessLevel:'SALESPERSON'
    this.isAccepted=inviteTeamSeller?inviteTeamSeller.isAccepted:'accept'
    this.getTeamList(1)
  }

  searchData(){
    let data = {
      companyId: this.userObj.userInfo._id,
      isAccepted: this.isAccepted,
      accessLevel: this.accessLevel,
      searchKey: this.SearchText ? this.SearchText.replace(/^\s+|\s+$/gm, '') : null,
      page: 1,
      count: this.itemsPerPage,
    }
    localStorage.setItem('inviteTeamSeller', JSON.stringify(data))

    this.getTeamList(1)
  }
  getTeamList(pageNumber) {

    let inviteTeamSeller  = JSON.parse(localStorage.getItem('inviteTeamSeller'))

    let data = {
      companyId:inviteTeamSeller?inviteTeamSeller.companyId: this.userObj.userInfo._id,
      isAccepted:inviteTeamSeller?inviteTeamSeller.isAccepted:this.isAccepted,
      accessLevel:inviteTeamSeller?inviteTeamSeller.accessLevel:this.accessLevel,
      searchKey:inviteTeamSeller?inviteTeamSeller.searchKey:this.SearchText ? this.SearchText.replace(/^\s+|\s+$/gm, '') : null,
      page:inviteTeamSeller?inviteTeamSeller.page:pageNumber,
      count:inviteTeamSeller?inviteTeamSeller.count:this.itemsPerPage,
    }
    this.spinner.show()
    this.service.getSealPersong(data).subscribe((res) => {
      this.inviteList = res['data']
      this.totalcount = res['totalCount']
      this.userListPage = pageNumber
      this.spinner.hide()
      if (this.inviteList && this.inviteList.length) this.noData = false
      else this.noData = true
    })
  }
  savePageChangedList(event) {
    this.userListPage = event
    this.getTeamList(this.userListPage)
  }
  reset() {
    this.isActive = 'true'
    this.isDeleted = 'false'
    this.isAccepted = 'accept'
    this.accessLevel = 'SALESPERSON'
    this.SearchText = ''

    localStorage.removeItem('inviteTeamSeller')

    this.getTeamList(1)
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    this.dialog.open(DialogInviteTeamComponent, { height: '450px', width: '900px', data: 'hi' }).afterClosed()
  }
}
