import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.css'],
})
export class NewsFeedComponent implements OnInit {
  truckNews: any

  constructor(private _generalService: GeneralServiceService, private spinner: NgxSpinnerService, private toastr: ToastrService, private ngZone: NgZone, private changeDetector: ChangeDetectorRef) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.newsFeed()
  }

  newsFeed() {
    this.spinner.show()
    this._generalService.getTruckNews('').subscribe(
      (res) => {
        if (res['code'] == 200) this.truckNews = res['data'].item
        else this.toastr.warning(res['message'])
        this.spinner.hide()
      },
      () => this.toastr.warning('Something went wrong')
    )
  }
}
