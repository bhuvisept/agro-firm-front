import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material'
import { Router } from '@angular/router'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { FormControl } from '@angular/forms'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { environment } from 'src/environments/environment'
import { ToastrService } from 'ngx-toastr'
import { NgxSpinnerService } from 'ngx-spinner'
@Component({
  selector: 'app-my-wishlist',
  templateUrl: './my-wishlist.component.html',
  styleUrls: ['./my-wishlist.component.css'],
})
export class MyWishlistComponent implements OnInit {
  userObj: any
  userId: any
  productData: any
  productImage: any
  totalResult: any
  page: number = 1
  itemsperPage: number = 10
  public productImgPath = environment.URLHOST + '/uploads/product/image/'
  constructor(private service: GeneralServiceService, private spinner: NgxSpinnerService, private toastr: ToastrService, private ngZone: NgZone, private changeDetector: ChangeDetectorRef) {
    setTimeout(() => this.ngZone.run(() => this.changeDetector.detectChanges()))
  }

  ngOnInit() {
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userId = this.userObj.userInfo._id

    this.getWishList(this.page)
  }

  getWishList(page) {
    let data = {
      userId: this.userId,
      page: page,
      count: this.itemsperPage,
    }
    this.spinner.show()
    this.service.wishList(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.spinner.hide()
        this.productData = res['data']

        this.totalResult = res['totalCount']
      } else {
        this.spinner.hide()
      }
    })
  }

  removeFromWishList(id) {
    // if (!this.userId) {
    //   const dialogRef = this.dialog.open(AddWishListDialogComponent, {
    //     width: '400px',
    //   })
    //   dialogRef.afterClosed().subscribe((response) => { })
    //   return;
    // }
    let data = {
      productId: id,
      _id: this.userId,
    }
    this.spinner.show()
    this.service.removeWishList(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.spinner.hide()
        this.toastr.success('Product removed from wish list')
        this.getWishList(this.page)
      } else {
        this.spinner.hide()
        this.getWishList(this.page)
        this.toastr.success(res['message'])
      }
    })
  }

  pagechange(e) {
    this.page = e
    this.getWishList(this.page)
  }
}
