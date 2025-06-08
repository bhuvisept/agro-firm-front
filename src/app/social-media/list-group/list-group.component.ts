// import { Component, OnInit } from '@angular/core'
import { ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component'
import { AssignGroupComponent } from '../assign-group/assign-group.component'

@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.component.html',
  styleUrls: ['./list-group.component.css'],
  providers: [NgxSpinnerService],
})
export class ListGroupComponent implements OnInit {
  userId: string
  groupId: any

  page: number = 1
  totalCount: any
  total: any
  totalItems: any
  itemsPerPage = 10

  constructor(
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  roleName: any
  userObj: any
  createGroupLists: any
  imgGroupLists: string = ''
  deleted: string = 'false'
  count: any
  currentPage: number = 1

  noRecordFound: boolean
  public group_Image_url = environment.URLHOST + '/uploads/group/thumbnail/'

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id

    this.roleName = this.userObj.userInfo.roleId.roleTitle
    this.getGroupList(1)
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }

  getGroupList(event) {
    let data = {
      isActive: 'true',
      isDeleted: this.deleted ? this.deleted : '',
      userId: this.userObj.userInfo._id,
      page: event,
    }
    this._generalService.getGroupListDetails(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.createGroupLists = response['data']

        this.total = response.totalCount
        this.page = event
        if (this.createGroupLists.length != 0) {
          this.noRecordFound = false
          this.currentPage = 1
        } else {
          this.noRecordFound = true
        }

        this.spinner.hide()
      } else {
        this.noRecordFound = true
        this.createGroupLists = response['data']
        this.spinner.hide()
      }
    })
  }

  deleteGroupMember(list) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: 'Are you sure you want to leave this information?',
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show()
        let data = {
          invitationId: list.invitationId,
          userId: this.userId,
          groupId: list.group_Id,
          actionType: 'MEMBERLEAVE',
        }

        this._generalService.leaveGroupMember(data).subscribe((res: any) => {
          this.spinner.hide()
          if (res['code'] == genralConfig.statusCode.ok) {
            this.spinner.hide()
            this.getGroupList(1)
          } else {
            this.spinner.hide()
          }
        })
      }
    })
  }

  assingGroup(list) {
    const dialogRef = this.dialog.open(AssignGroupComponent, {
      width: '650px',
      data: list,
      panelClass: 'my-dialog-creat-post',
    })
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.admin) {
        let data = {
          invitationId: list.invitationId,
          userId: this.userId,
          groupId: list.group_Id,
          actionType: 'ADMINLEAVE',
          assignAdmin: result.admin,
        }

        this._generalService.leaveGroupMember(data).subscribe((res: any) => {
          this.spinner.hide()
          if (res['code'] == genralConfig.statusCode.ok) {
            this.spinner.hide()
            this.getGroupList(1)
          } else {
            this.spinner.hide()
          }
        })
      }
    })
  }

  currentPagegruop(event) {
    this.getGroupList(event)
  }
}
