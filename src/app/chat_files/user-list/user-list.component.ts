import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA, TransitionCheckState } from '@angular/material'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { FetchService } from '../socket-service/fetch.service'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [NgxSpinnerService],
})
export class UserListComponent implements OnInit {
  imgBaseUrl: string = environment.URLHOST + '/uploads/enduser/'
  imgBaseUrlGroup = environment.URLHOST + '/uploads/chatImages/'
  roleName: any
  userObj: any
  postId: any
  selectedGrpName: string = ''
  groupMember
  removeMembers = []
  cheaked: boolean = false
  imagePath: string = ''

  constructor(
    public dialogRef: MatDialogRef<UserListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private fetchService: FetchService
  ) {}

  ngOnInit() {
    if (this.data && this.data.name === 'memberList') this.GroupMember()
    if (this.data.data.groupName) this.selectedGrpName = this.data.data.groupName
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onSubmit() {
    if (!this.selectedGrpName && !this.imagePath) {
      return
    }
    this.fetchService.updateGroupName(this.selectedGrpName, this.data.data._id, this.imagePath).subscribe(
      (res) => {
        this.spinner.show()
        if (res['code'] === 200) {
          this.toastr.success(res['message'])
          this.onNoClick()
        } else this.toastr.success(res['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  GroupMember() {
    this.spinner.show()
    this.fetchService.memberListdetail(this.data.data._id).subscribe(
      (res) => {
        if (res['code'] === 200) {
          this.groupMember = res['data']
          this.toastr.success(res['message'])
        } else this.toastr.success(res['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  removeMember(id) {
    if (!this.removeMembers.includes(id)) {
      this.removeMembers.push(id)
    } else {
      let list = this.removeMembers.filter((data) => data != id)
      this.removeMembers = list
    }
  }

  removeUser() {
    this.spinner.show()
    this.fetchService.removeGroupMembers(this.data.data._id, this.removeMembers).subscribe(
      (res) => {
        if (res['code'] === 200) {
          this.toastr.success(res['message'])
          this.onNoClick()
        } else this.toastr.warning(res['message'])
        this.spinner.hide()
      },
      () => {
        this.spinner.hide()
        this.toastr.warning('Server Error')
      }
    )
  }

  removeCheak() {
    this.cheaked = !this.cheaked
  }

  groupImage(event) {
    this.spinner.show()
    let image = <File>event.target.files[0]
    const formData = new FormData()
    formData.append('file', image)
    formData.append('type', 'GROUPCHATIMG')
    this.fetchService.groupImage(formData).subscribe((res) => {
      if (res['code'] === 200) this.imagePath = res['data'].imagePath
      else this.toastr.warning(res['message'])
      this.spinner.hide()
    })
  }
}
