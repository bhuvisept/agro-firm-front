import { Component, Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
  providers: [NgxSpinnerService],
})
export class CreateProductComponent implements OnInit {
  public product_catagory_image = environment.URLHOST + '/uploads/category/thumbnail/'
  getVauledata: string
  status: boolean = false
  list: any
  selected: any
  categoryList: any
  constructor(private _generalService: GeneralServiceService, private router: Router, @Inject(DOCUMENT) private document: Document, private renderer: Renderer2) {}
  ngOnInit() {
    this.getCategoryList()
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  getCategoryList() {
    let data = { parentFlag: 'true', isActive: 'true' }
    this._generalService.getCategoryList(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) this.categoryList = response['data']
    })
  }
  getValue(e, list) {
    this.getVauledata = e.target.value
    this.selected = list
    if (this.getVauledata == 'TRUCKS') this.router.navigate(['layout/e-commerce/add-truck/' + this.selected._id])
    else if (this.getVauledata == 'TRAILERS') this.router.navigate(['layout/e-commerce/add-trailer/' + this.selected._id])
    else if (this.getVauledata == 'TRUCKUNITS') this.router.navigate(['layout/e-commerce/add-truckunits/' + this.selected._id])
    else if (this.getVauledata == 'SPAREPARTS' || this.getVauledata == 'ACCESSORIES') return
    else if (this.getVauledata == 'OTHERS') this.router.navigate(['layout/e-commerce/add-miscellaneous/' + this.selected._id])
  }
  isActive(list) {
    return this.selected === list
  }
}
