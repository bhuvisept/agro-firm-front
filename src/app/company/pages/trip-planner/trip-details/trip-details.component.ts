import { Component, Inject, OnInit, Renderer2, NgZone, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ActivatedRoute, Router } from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.css'],
  providers: [NgxSpinnerService],
})
export class TripDetailsComponent implements OnInit {
  ID: any
  tripDetails: any = []
  public postProfile = environment.URLHOST + '/uploads/enduser/'
  noData: boolean = false
  isotherbrand:boolean=true

  brandName: any
  constructor(
    private service: GeneralServiceService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    window.scrollTo(0, 0)
    this.route.params.subscribe((res) => (this.ID = res.id))
    this.getTripDetails()
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile')
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile')
  }

  getTripDetails() {
    let data = { _id: this.ID, accessLevel: 'DRIVER' }
    this.spinner.show()
    this.service.getTripDetails(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.tripDetails = res['data']

        if(this.tripDetails.truckData.brandName == null){
         this.brandName= this.tripDetails.truckData.brand
        }else{
          this.brandName= this.tripDetails.truckData.brandName
        }

        if(this.tripDetails.truckData.otherbrand ==null){
          this.isotherbrand=false
       }
        this.noData = false
      } else this.noData = true
      this.spinner.hide()
    })
  }
  Back() {
    window.history.back()
  }
}
