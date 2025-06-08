import { Component, OnInit } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
import { ActivatedRoute } from '@angular/router'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'app-services-detail',
  templateUrl: './services-detail.component.html',
  styleUrls: ['./services-detail.component.css']
})
export class ServicesDetailComponent implements OnInit {
  roleName:any
  serviceId: any
  Creatobj: any = []
  public serviceImage = environment.URLHOST + '../truck-backend/uploads/service/'
  public SERVICEIMAGE = environment.URLHOST + '/uploads/service/'
  constructor(
    private service: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.serviceId = params.id
    })
    this.getApiData()
    window.scroll(0,0)
  }

  getApiData() {
    this.spinner.show()
    let data = {
      _id: this.serviceId,
    }
    this.service.GetServiceDetails(data).subscribe((Response) => {
      if (Response['code'] == 200) {
        this.spinner.hide()
        this.Creatobj = Response['data']
      } else {
        this.toastr.warning('', Response['message'])
        this.spinner.hide()
      }
    })
  }
}