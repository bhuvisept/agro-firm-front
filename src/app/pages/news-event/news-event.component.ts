import { Component, OnInit } from '@angular/core';
import { GeneralServiceService } from 'src/app/core/general-service.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'


@Component({
  selector: 'app-news-event',
  templateUrl: './news-event.component.html',
  styleUrls: ['./news-event.component.css']
})

export class NewsEventComponent implements OnInit {
  news_image_url = environment.URLHOST + '/uploads/event/thumbnail/'
  userId: any;
  results: any;
  totalCount: number
  itemsPerPage: number = 10
  currentPage: number
  page: number = 1
  count: 9

  constructor(
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private pipe: DatePipe,

  ) { }

  ngOnInit() {
    this.getEventlists(1);
    window.scroll(0, 0);
  }

  limitWords(text: string, limit: number = 20): string {
    if (!text) return '';
    const plain = text.replace(/<[^>]+>/g, ''); // strip HTML
    const words = plain.split(/\s+/);
    return words.length > limit ? words.slice(0, limit).join(' ') + ' ' : plain;
  }

  getEventlists(page) {
    let data = {
      isActive: 'true',
      page: page
    }
    this.spinner.show()
    this._generalService.eventList(data).subscribe(
      (response) => {
        console.log("RES ", response);
        if (response['code'] == 200) {
          this.results = response['data']
          this.totalCount = response['totalCount']


          this.spinner.hide()
        }
      },
      (error) => {
        this.toastr.show(error, 'Network Error')
        this.spinner.hide()
      }
    )
  }
  savePageChanged(element) {
    console.log("savePageChanged ", element)
    this.getEventlists(element)
    this.page = element
  }

}
