import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT, getLocaleFirstDayOfWeek } from '@angular/common'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { MatDialog } from '@angular/material/dialog'
import { DeletNetworkComponent } from '../delet-network/delet-network.component'

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css'],
  providers: [NgxSpinnerService],
})
export class TeamListComponent implements OnInit {
  title: string = 'Invite Connection'
  userObj: any
  groupLists: any
  userId: any
  currentPage: number = 1
  itemsPerPage: number = 10
  searchText: String = ''
  status: string = 'STATUS'
  noData: boolean
  count: any
  noRecordFound: boolean
  
  statusList = [
    { value: 'ACCEPT', show: 'Accepted' },
    { value: 'DECLINE', show: 'Declined' },
    { value: 'PENDING', show: 'In Progress' },
  ]
  page: any
  total: any

  constructor(
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.getInvitedByMailList(1)
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }
  pageChanged(event) {
    this.getInvitedByMailList(event)
  }
  getInvitedByMailList(event) {
    this.spinner.show()
    let data = {
      isActive: 'true',
      invitedBy: this.userObj.userInfo._id,
      searchEmail: this.searchText,
      status: this.status,
      page:event,
      count: this.itemsPerPage
    }
    this.spinner.show()
    this._generalService.getInvitedByMailDetail(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.groupLists = response['data']
        this.page = event
        this.total = response.totalCount
        

        if (this.groupLists.length != 0) {
          this.noRecordFound = false
          this.currentPage = 1
        } else {
          this.noRecordFound = true
        }
        this.spinner.hide()
      } else {
        this.toastr.error(response['message'])
      }
    })
  }
  reset() {
    this.searchText = ''
    this.status = 'accept'
    this.getInvitedByMailList(1)
  }


  deleteTruck(id) {
    const dialogRef = this.dialog.open(DeletNetworkComponent, {
      width: '350px',
    })
    dialogRef.afterClosed().subscribe((res) => {
   if(res == true){
      
    let data ={
     invitationId : id,
     ownerId: this.userObj.userInfo._id,
    }
    
    this._generalService.removedconnection(data).subscribe((response) => {
     this.spinner.hide()
     if (response['code'] == 200) {
       this.toastr.success('', response['message'])
       this.getInvitedByMailList(1)
     
     } else {
       this.toastr.warning('', response['message'])
     }
 
   })
   }
   else{
   
   }
      
    })
  }
}
