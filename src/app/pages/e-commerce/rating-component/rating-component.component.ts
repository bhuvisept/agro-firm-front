import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms'
import {Router,ActivatedRoute} from '@angular/router'
import { genralConfig } from 'src/app/constant/genral-config.constant';
import { GeneralServiceService } from 'src/app/core/general-service.service';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { P } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-rating-component',
  templateUrl: './rating-component.component.html',
  styleUrls: ['./rating-component.component.css'],
  providers: [NgxSpinnerService],
})
export class RatingComponentComponent implements OnInit {
  form: FormGroup
  // rating3:number
  userObj: any
  userId: any
  token: any
  productId: any // changes by shivam kashyap 7/12/2022
  ratingSuccess: boolean = false
  allProduct: any
  productForRating: any
  // products:any = '6258ef5e95425f41cda4f370'
  sellerId: any
  //  isRating:any = 'Yes'
  isRatingSelected: any = 'true'
  RatingArray = [
    { value: 'true', name: 'Product' },
    { value: 'false', name: 'Seller' },
  ]
  isAllow: boolean= false
isLinkedExpired :boolean;
  ratingValue: number = 0; 
  Name: any; // Name for product or seller
  ratingType: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _generalServices: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.productId = JSON.parse(localStorage.getItem('chatSellerDataProduct')) // changes by shivam kashyap 7/12/2022
    if (userData && userData.userInfo) {
      this.userId = userData.userInfo._id
    }
    this.route.params.subscribe((res) => {
      this.token = res['token']
      this.sellerId = res['sellerId']
    })

    this.checkToken()
    this.allProductList()
    this.checkAllowToGiveRating()

    this.form = this.fb.group({
      rating: ['', Validators.required]
    })
    if (!userData) {
      this.router.navigate(['/login'])
    }
  }


  checkAllowToGiveRating(){
    if( this.sellerId == this.userId){
     this.isAllow= true
    }else{
      this.isAllow= false
    }
  }

  checkToken() {
    
    let data = {
      token: this.token,
      userId: this.userId,
    }
    this._generalServices.ratingTokenCheck(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.isLinkedExpired = false
        // this.toaster.success(res['message'])
      } else {
        this.isLinkedExpired = true
        this.toaster.warning(res['message'])
      }
    })
  }
  onChange(event) {
    this.productForRating = event.value
  }
  onRatingSelect(event) {
    this.isRatingSelected = event.value
    this.form.patchValue({rating:0})
  }

  allProductList() {
    const data = {
      sellerId: this.sellerId,
    }
    this._generalServices.allProductList(data).subscribe((res) => {
      if ((res['code'] = 200)) {
        this.allProduct = res['data']
      } else {
        this.toaster.warning(res['message'])
      }
      this.spinner.hide()
    })
  }

  submit() {
 
    if (this.isRatingSelected == 'true' && this.productForRating == undefined) return this.toaster.warning('Select product from dropdown')
    let data = {
      userId: this.userId,
      rating: this.form.value.rating,
      token: this.token,
      productId: this.productForRating, // changes by shivam kashyap 07/12/2022
      ratingType:this.isRatingSelected == 'true' ? "PRODUCT" :"SELLER"
    }

    this._generalServices.giveSellerRating(data).subscribe((res) => {
      if ((res['code'] = 200)) {
        this.ratingSuccess = true

        console.log("1111111111111",res['data']);
        this.ratingValue = res['data'].rating
        this.Name = res['data'].Name   // Name for product or seller
        this.ratingType = res['data'].ratingType   // Name for product or seller

        this.toaster.success(res['message'])
        this.form.reset()
        // this.router.navigate(['/home-page'])
      } else {
        this.toaster.warning(res['message'])
      }
      this.spinner.hide()
    })
  }
  goBack(){
    window.history.back()
  }
}
