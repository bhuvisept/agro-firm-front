import { Component, OnInit } from '@angular/core'

import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent implements OnInit {
  blogList: any
  public BLOGIMAGE = environment.URLHOST + '/uploads/blog/thumbnail/'
  constructor(
    private spinner: NgxSpinnerService,

    private toastr: ToastrService,
    private _generalService: GeneralServiceService
  ) {}

  ngOnInit() {
    window.scroll(0, 0)
    this.getBloglists()
  }
  getBloglists() {
    let obj = { isDeleted: false, isActive: 'true' }
    this.spinner.show()
    this._generalService.getBlogList(obj).subscribe((result) => {
      if (result['code'] == genralConfig.statusCode.ok) {
        this.blogList = result['data']
        this.spinner.hide()
      } else {
        this.toastr.warning(result['message'])
        this.spinner.hide()
      }
    })
  }
}
