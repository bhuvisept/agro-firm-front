// import { Component, OnInit } from '@angular/core';
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'
import { DOCUMENT } from '@angular/common'

@Component({
  selector: 'app-my-connections',
  templateUrl: './my-connections.component.html',
  styleUrls: ['./my-connections.component.css'],
  providers: [NgxSpinnerService],
})
export class MyConnectionsComponent implements OnInit {
  userObj: any
  myConnnectionList
  noData: any
  total: any
  page: any
  noRecordFound: any
  status: any
  searchText: any

  statusList = [
    { value: 'accept', show: 'Accepted' },
    { value: 'decline', show: 'Declined' },
    { value: 'pending', show: 'In Progress' },
  ]

  constructor(private service: GeneralServiceService, private toastr: ToastrService, private spinner: NgxSpinnerService, @Inject(DOCUMENT) private document: Document, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')

    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.myConnectionsList()
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }

  myConnectionsList() {
    let data = {
      invitedBy: this.userObj.userInfo._id,
      searchEmail: this.searchText,
      status: this.status,
      count: 20,
      page: 1,
    }
    this.spinner.show()
    this.service.getMyConnectionsList(data).subscribe((res) => {
      this.spinner.hide()

      this.myConnnectionList = res['data']
      if (this.myConnnectionList.length == 0) {
        this.noData = true
      } else {
        this.noData = false
      }
    })
  }

  reset() {
    if (this.searchText || this.status) {
      this.searchText = ''
      this.status = ''
      this.myConnectionsList()
    }
  }
}
