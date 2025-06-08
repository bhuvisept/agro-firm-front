import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralServiceService } from "src/app/core/general-service.service";
import { environment } from "src/environments/environment";
import { NgxSpinnerService } from 'ngx-spinner'
@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css'],
  providers:[NgxSpinnerService]
})
export class BlogDetailsComponent implements OnInit {
  blogID: any;
  blogDetails: any;
  blogDetailsImage: any;
  public BLOGIMAGE = environment.URLHOST + '/uploads/blog/'
  constructor(
    private _generalService: GeneralServiceService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) { }
  ngOnInit() {
    this.route.params.subscribe(param => {
      this.blogID = param.id;
      if (this.blogID) {
        this.getBlogDetail(this.blogID);
      } 
    })
    window.scroll(0,0)
  }
  getBlogDetail(blogID) {
    this.spinner.show()
    this._generalService.getBlogdetails({ blogID: blogID }).subscribe((result) => {
      if (result['code'] === 200) {
        this.blogDetails = result['data'];
        this.blogDetailsImage = this.blogDetails.image
        window.scroll(0, 0)
        this.spinner.hide()
      }
    });
  }
}
