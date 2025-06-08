import { Component, OnInit } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FaqComponent implements OnInit {
  faqList: any[] = []
  itemsPerPage: number = 10
  pageNew: number = 1
  panelOpenState: any = false
  newtotalCount: number = 0

  constructor(private service: GeneralServiceService, private toastr: ToastrService, private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.getFAQList()
  }

  getFAQList() {
    this.spinner.show()

    let data = {
      count: this.itemsPerPage,
      page: this.pageNew,
      isActive: 'true',
      isDeleted: 'false',
    }

    this.service.faqList(data).subscribe(
      (res) => {
        if (res['code'] == 200) {
          this.faqList = res['data']
          this.newtotalCount = res.totalCount
          this.faqList.map((res) => (res.answer = res.answer.replaceAll('\n', '<br>')))

          this.spinner.hide()
        } else {
          this.toastr.warning(res['message'])
          this.spinner.hide()
        }
      },
      () => {
        this.toastr.warning('Something went wrong')
        this.spinner.hide()
      }
    )
  }

  savePageChanged(e) {
    this.pageNew = e
    this.getFAQList()
  }
}
