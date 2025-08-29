import { Component, OnInit } from '@angular/core';
import { GeneralServiceService } from 'src/app/core/general-service.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent implements OnInit {
  eventId: any;
  eventData: any;
  news_image_url = environment.URLHOST + '/uploads/event/'

  constructor(
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.eventId = param.id;
      // console.log(" this.eventId ", this.eventId)
      if (this.eventId) {
        this.getEventDetail(this.eventId);
      } else {
      }
    })
    window.scroll(0, 0);
  }
  getEventDetail(eventId) {
    this._generalService.eventView({ eventId: eventId }).subscribe(result => {
      this.spinner.show()
      if (result['code'] === 200) {
        this.eventData = result['data'][0];
        // this.uploadedBannerImage = this.eventData.image;

        this.spinner.hide();
      } else { }
      this.spinner.hide();
    });
  }

}
