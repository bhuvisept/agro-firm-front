import { Component, OnInit } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ActivatedRoute } from '@angular/router'
@Component({
  selector: 'app-accept-reject-job',
  templateUrl: './accept-reject-job.component.html',
  styleUrls: ['./accept-reject-job.component.css'],
})
export class AcceptRejectJobComponent implements OnInit {
  token: any
  message: any = ''
  successFlag: boolean = false
  constructor(private service: GeneralServiceService, private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.params.subscribe((res) => (this.token = res.token))
    this.checkToken()
  }
  checkToken() {
    this.service.checkJobToken({ token: this.token }).subscribe((res) => {
      if (res.code === 200) {
        this.service
          .acceptJobInvitations({ resetkey: this.token })
          .subscribe((res) => (res['code'] == 200 ? (this.message = 'Invitation accepted successfully') : (this.message = 'Invitation expired')))
      } else this.message = 'Invitation expired'
      this.successFlag = true
    })
  }
}
