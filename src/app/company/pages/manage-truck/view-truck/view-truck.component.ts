import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'
import { Location } from '@angular/common'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
@Component({
  selector: 'app-view-truck',
  templateUrl: './view-truck.component.html',
  styleUrls: ['./view-truck.component.css'],
})
export class ViewTruckComponent implements OnInit {
  id: any
  truckData: any = []
  truckPath = environment.URLHOST + '/uploads/truck/'
  vehicleType: any
  img: boolean = false
  isotherbrand:boolean=true
  constructor(
    private service: GeneralServiceService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private location: Location,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.route.params.subscribe((res) => (this.id = res.id))
    this.getTruck()
  }

  getTruck() {
    let data = { _id: this.id }
    this.spinner.show()
    this.service.oneTruck(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.spinner.hide()
        this.truckData = res['data']
     if(this.truckData.otherbrand ==null){
        this.isotherbrand=false
     }
        if (res['data'].image == null) this.img = true
        else this.spinner.hide()
        this.vehicleType = res['data'].vechicleType
      }
    })
  }
  gotoEdit() {
    this.router.navigate(['/layout/myaccount/manage-truck/edit-truck/' + this.id])
  }

  gotoEditTrailer() {
    this.router.navigate(['/layout/myaccount/manage-truck/edit-trailer/' + this.id])
  }

  back() {
    this.router.navigate(['/layout/myaccount/manage-truck'])
  }
}
