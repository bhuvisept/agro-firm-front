import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { MatDialog } from '@angular/material/dialog'
import { DeleteConnectionConfirmationDialogComponent } from '../delete-connection-confirmation-dialog/delete-connection-confirmation-dialog.component'

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.css'],
  providers: [NgxSpinnerService],
})
export class ConnectionsComponent implements OnInit {
  roleName: any
  userObj: any
  userId: any
  invitedList: any
  count: any
  currentPage: number = 1
  itemsPerPage: number = 9
  searchKey: String = ''
  isActive: string = 'true'
  noData: boolean
  noRecordFound: boolean
  noRecordFoundNoDatata: boolean

  public postProfileImage = environment.URLHOST + '/uploads/company/'
  public driverPath = environment.URLHOST + '/uploads/driver/'
  public endUser = environment.URLHOST + '/uploads/enduser/'
  connectTotalNo = 0

  constructor(
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.getMyConnectList(1)
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }

  getMyConnectList(page) {
    let data = { userId: this.userObj.userInfo._id, searchText: this.searchKey, count: this.itemsPerPage, page: page }
    this.spinner.show()
    this._generalService.getConnectListDetails(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.invitedList = response['data']
        this.connectTotalNo = response.totalCount
        this.count = this.invitedList.length
        this.spinner.hide()
      } else {
        this.spinner.hide()
      }
    })
    ;() => {
      this.spinner.hide()
    }
  }

  pageChanged(event) {
    this.currentPage = event
    this.getMyConnectList(this.currentPage)
  }
  deleteConnectList(connectId) {
    const dialogRef = this.dialog.open(DeleteConnectionConfirmationDialogComponent, {
      width: '450px',
      data: connectId,
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.apiHit) {
        this.currentPage = 1
        this.getMyConnectList(this.currentPage)
      }
    })
  }

  reset() {
    if (this.searchKey) {
      this.searchKey = ''
      this.getMyConnectList(1)
    }
  }
}
