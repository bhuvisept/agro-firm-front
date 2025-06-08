import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
import { ActivatedRoute } from '@angular/router'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'app-view-services',
  templateUrl: './view-services.component.html',
  styleUrls: ['./view-services.component.css'],
})
export class ViewServicesComponent implements OnInit {
  roleName: any
  serviceId: any
  Creatobj: any = []
  public serviceImage = environment.URLHOST + '../truck-backend/uploads/service/'
  public SERVICEIMAGE = environment.URLHOST + '/uploads/service/'
  constructor(
    private service: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }
  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    this.roleName = userData.userInfo.roleId.roleTitle
    this.route.params.subscribe((params) => (this.serviceId = params.Id))
    this.getApiData()
  }
  getApiData() {
    this.spinner.show()
    let data = { _id: this.serviceId }
    this.service.GetServiceDetails(data).subscribe((Response) => {
      if (Response['code'] == 200) this.Creatobj = Response['data']
      else this.toastr.warning('', Response['message'])
      this.spinner.hide()
    })
  }
}
