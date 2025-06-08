import { Component, OnInit } from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { FormControl } from '@angular/forms'
import { Router } from '@angular/router'
import { runInThisContext } from 'vm'
@Component({
  selector: 'app-left-users',
  templateUrl: './left-users.component.html',
  styleUrls: ['./left-users.component.css'],
})
export class LeftUsersComponent implements OnInit {
  userObj: any
  companyId: any
  leftUsersList: any
  noRecordFound: any
  itemsPerPage: any = 10
  page: any = 1
  SearchText: any = ''
  totalCount: any
  constructor(private service: GeneralServiceService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    if (this.userObj.userInfo.accessLevel == 'COMPANY') this.companyId = this.userObj.userInfo._id
    else if (this.userObj.userInfo.accessLevel == 'HR') this.companyId = this.userObj.userInfo.createdById
    this.companyLeftUsers(1)
  }

  companyLeftUsers(page) {
    let data = { companyId: this.companyId, page: page, count: this.itemsPerPage, searchText: this.SearchText }
    this.spinner.show()
    this.service.leftUsersList(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.leftUsersList = res['data']
        this.totalCount = res['totalCount']
        if (this.leftUsersList && this.leftUsersList.length) this.noRecordFound = false
        else this.noRecordFound = true
      }
      this.spinner.hide()
    })
  }

  savePageChanged(e) {
    this.page = e
    this.companyLeftUsers(this.page)
  }

  reset() {
    if (this.SearchText != '') {
      this.SearchText = ''
      this.companyLeftUsers(this.page)
    }
  }
}
