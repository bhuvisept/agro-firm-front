import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css'],
})
export class ActivityLogComponent implements OnInit {
  userObj: any
  userId: any
  activityLogs: any

  constructor(private service: GeneralServiceService, private spinner: NgxSpinnerService, private ngZone: NgZone, private changeDetector: ChangeDetectorRef) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id
    this.userActivity()
  }
  userActivity() {
    this.spinner.show()
    this.service.activityLogs({ userId: this.userId }).subscribe((res) => {
      if (res['code'] == 200) {
        this.activityLogs = res['data']
        this.activityLogs.forEach((element) => {
          element.list.forEach((ele) => {
            let name = ele.source.split(' ')[0]
            ele['source'] = name
          })
        })
      }
      this.spinner.hide()
    })
  }
}
