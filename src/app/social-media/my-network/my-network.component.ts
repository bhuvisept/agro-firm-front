import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, Renderer2 } from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'
import { DOCUMENT } from '@angular/common'

import { Router } from '@angular/router'
@Component({
  selector: 'app-my-network',
  templateUrl: './my-network.component.html',
  styleUrls: ['./my-network.component.css'],
  providers: [NgxSpinnerService],
})
export class MyNetworkComponent implements OnInit {
  userObj: any
  userId: any
  connectionsLits = []
  connectionsTotalCount: any
  MySuggestionLits: any
  listProfileImage: any
  sendInvitedTo: any = []
  sendConnectionIvitation: string
  sendStatus: false
  value: string = ''
  invitedTo = []
  currentPage: number
  count: any
  // page: number = 1
  itemsPerPage: number = 9
  seeAllInvite: boolean = false
  searchResults: boolean = false
  interestPage
  invitationYet: boolean = true
  page = 1
  modalScrollDistance = 2
  modalScrollThrottle = 50
  itemPerPage: any = 10
  inviteDefine: string = 'INVITES'
  public image_url_profile = environment.URLHOST + '/uploads/enduser/'
  public postProfileImage = environment.URLHOST + '/uploads/company/'
  public driverPath = environment.URLHOST + '/uploads/driver/'
  public endUser = environment.URLHOST + '/uploads/enduser/'
  public group = environment.URLHOST + '/uploads/group/'
  public company = environment.URLHOST + '/uploads/company/'
  intrestPage: any
  searchKey: string
  jobInvitationLists: any[]
  accessLevel: any
  recommendPage = 1

  constructor(
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,

    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.accessLevel = this.userObj.userInfo.accessLevel

    this.getAcceptDeclineLits('INVITES')
    this.getSuggestionLits(1)
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
    window.scroll(0, 0)
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }

  getAcceptDeclineLits(type) {
    let data = { userId: this.userObj.userInfo._id, type: type, count: 9, page: this.page }
    this.spinner.show()
    this._generalService.getMySuggestionLits(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.connectionsLits.push(...response['data'])
        this.connectionsTotalCount = response.totalCount
        if (this.connectionsTotalCount) {
          this.invitationYet = false
        }
        this.spinner.hide()
      } else {
        this.spinner.hide()
        this.toastr.warning(response['message'])
      }
    })
    ;() => {
      this.spinner.hide()
      this.toastr.warning('Server Error')
    }
  }

  onAcceptInvitation(_id, index) {
    let data = {
      invitationId: _id,
      userId: this.userObj.userInfo._id,
      userName: this.userObj.userInfo.personName,
      userImage: this.userObj.userInfo.image,
    }

    this.spinner.show()
    this._generalService.acceptInvitation(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.connectionsLits.splice(index, 1)
        this.connectionsTotalCount--
        this.toastr.success('', response['message'])
        this.spinner.hide()
      } else {
        this.spinner.hide()
      }
    })
  }
  onIgnoreInvitation(list, index) {
    let data = {
      invitationId: list._id,
      invitedBy: list.invitedBy,
      userId: this.userObj.userInfo._id,
    }
    this.spinner.show()
    this._generalService.ignoreInvitation(data).subscribe((response) => {
      if (response['code'] == 200) {
        this.spinner.hide()
        this.connectionsLits.splice(index, 1)
        this.connectionsTotalCount--
      } else {
        this.toastr.warning(response['message'])
        this.spinner.hide()
      }
      ;(error) => {
        this.spinner.hide()
      }
    })
  }
  getSuggestionLits(intrestPage) {
    let data = {
      userId: this.userObj.userInfo._id,
      type: 'SUGGESTION',
      page: intrestPage,
      count: this.itemsPerPage,
      searchText: this.searchKey,
    }
    this.spinner.show()
    this._generalService.getMySuggestionLits(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          window.scroll(0, 0)
          this.interestPage = intrestPage
          this.MySuggestionLits = response['data']
          this.count = response['totalCount']
        } else this.MySuggestionLits = []
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server error')
      }
    )
  }

  sendConnectionIvite(list, index) {
    this.spinner.show()
    let data = {
      invitedBy: this.userObj.userInfo._id,
      invitedTo: list.userId,
    }
    this._generalService.connect(data).subscribe(
      (response) => {
        if (response['code'] == 200) {
          this.MySuggestionLits.splice(index, 1)
          if (!this.MySuggestionLits.length) {
            this.getSuggestionLits(this.interestPage)
          }
          this.toastr.success(response['message'])
          this.spinner.hide()
        } else {
          this.toastr.warning(response['message'])
          this.spinner.hide()
        }
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server error')
      }
    )
  }

  currentPagenew(event) {
    this.spinner.show()
    this.getSuggestionLits(event)
  }
  getJobinvitationList() {
    let data = {
      userId: this.userId,
      page: this.page,
      itemPerPage: this.itemPerPage,
    }
    this._generalService.getJobInvitations(data).subscribe((res) => {
      this.jobInvitationLists = res['data']
    })
  }

  getTabChangeValue(data) {
    this.inviteDefine = data.tab.textLabel
    if (data.tab.textLabel == 'Groups invitations') {
      this.page = 1
      this.connectionsLits = []
      this.getAcceptDeclineLits('GROUP INVITATION')
    } else if (data.tab.textLabel == 'Invitations') {
      this.page = 1
      this.connectionsLits = []
      this.inviteDefine = 'INVITES'
      this.getAcceptDeclineLits('INVITES')
    } else if (data.tab.textLabel == 'Job invitations') {
      this.connectionsLits = []
      this.jobInvitationLists = []
      this.getJobinvitationList()
    }
  }

  reset() {
    this.searchKey = ''
    this.searchResults = false
    this.getSuggestionLits(1)
  }

  searchUser() {
    if (this.searchKey) {
      this.getSuggestionLits(1)
      this.searchResults = true
    }
  }

  onModalScrollDown() {
    if (this.inviteDefine == 'Groups invitations' && this.connectionsTotalCount > this.connectionsLits.length) {
      this.page++
      this.getAcceptDeclineLits('GROUP INVITATION')
    } else if (this.inviteDefine == 'Invitations' && this.connectionsTotalCount > this.connectionsLits.length) {
      this.page++

      this.getAcceptDeclineLits('INVITES')
    }
  }

  acceptJobInvitation(key, i) {
    this._generalService.acceptJobInvitations({ resetkey: key }).subscribe((res) => {
      if (res['code'] == 200) {
        this.toastr.success('Invitation accepted successfully')
        this.getJobinvitationList()
        localStorage.clear()
        this.router.navigate(['/login'])
      }
    })
  }

  ignoreJobInvitation(key, i) {
    this._generalService.rejectJobInvitations({ resetkey: key }).subscribe((res) => {
      if (res['code'] == 200) {
        this.getJobinvitationList()
        this.toastr.success('Invitation rejected successfully')
      }
    })
  }
  onJobModalScroll() {
    this.page += 1
    this.getJobinvitationList()
  }
}
