import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  ratingLink:any=''
  userObj: any
  userId: any
 linkurl :any
  constructor(
    private _generalService: GeneralServiceService,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2, 
  ) { }
  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    if(this.userObj && this.userObj.userInfo){
      this.userId = this.userObj.userInfo._id
    }
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.linkurl = window.location.origin
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
//   copy(){
//     navigator.clipboard.writeText(this.ratingLink)
//     this.toastr.success('Link copied to clipboard')
//     }
//  generateLink(){
//    let data={
//     sellerId:this.userId,
//     userId:"6202002afc7f81da1df3f228",
//     path:'/pages/e-commerce/rating', 
//    }
//    this._generalService.ratingTokenGererate(data).subscribe(res=>{
//      if(res['code']=200){
//       this.ratingLink= this.linkurl+res['data'].urlPath
//       this.toastr.success('Link generated successfully')
//      }
//    })
//  }
}
