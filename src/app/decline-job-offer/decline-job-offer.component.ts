import { Component, OnInit } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-decline-job-offer',
  templateUrl: './decline-job-offer.component.html',
  styleUrls: ['./decline-job-offer.component.css'],
})
export class DeclineJobOfferComponent implements OnInit {
  token: any
  message: string
  successFlag: boolean

  constructor(private service: GeneralServiceService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((res) => (this.token = res.token))
    this.checkToken()
  }

  checkToken() {
    this.service.checkJobToken({ token: this.token }).subscribe((res) => {
      if (res.code === 200) {
        this.service.rejectJobInvitations({ resetkey: this.token }).subscribe((res) => {
          if (res['code'] == 200) {
            this.message = 'Invitation declined successfully'
            this.successFlag = true
          } else {
            this.successFlag = true
            this.message = 'Invitation expired'
          }
        })
      } else {
        this.message = 'Invitation expired'
        this.successFlag = true
      }
    })
  }
}
