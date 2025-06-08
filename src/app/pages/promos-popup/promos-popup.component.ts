import { Component, OnInit, Inject } from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'app-promos-popup',
  templateUrl: './promos-popup.component.html',
  styleUrls: ['./promos-popup.component.css'],
})
export class PromosPopupComponent implements OnInit {
  // promoCodes = [
  //   { name: 'TRUCK10', des: 'Get 10% discount on applying this promo code', disable: false },
  //   { name: 'TRUCK15', des: 'Get flat $15 discount on applying this promo code', disable: false },
  // ]
  promoList: any[] = [];
  userId: any
  active: boolean = false
  constructor(private toastr: ToastrService,private dialog: MatDialogRef<PromosPopupComponent>,   
  @Inject(MAT_DIALOG_DATA,)
  public data = <dataModel>{}) {}

  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    if(this.data) this.promoList = this.data.promoList
    
    if (userData && userData.userInfo)   this.userId = userData.userInfo._id
    else this.dialog.close()
    
  }

  close() {
    this.dialog.close()
  }
  copy(value, i) {
    navigator.clipboard.writeText(value)
    this.promoList[i].disable = true
    this.toastr.success('Link copied to clipboard')
  }
}


interface dataModel {
  promoList: any[]
}