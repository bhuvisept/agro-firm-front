import { Component, Inject, OnInit, Renderer2, } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import {ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { genralConfig } from 'src/app/constant/genral-config.constant';
import {FormBuilder , FormGroup, Validators} from '@angular/forms' 
import { MatDialog } from '@angular/material';
import {ToastrService} from 'ngx-toastr'
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact-seller',
  templateUrl: './contact-seller.component.html',
  styleUrls: ['./contact-seller.component.css']
})
export class ContactSellerComponent implements OnInit {
  productId: any;
  product: any=[];
  data: { id: string; title: string; firstName: string; lastName: string; picture: string; }[];
  selectedImageForZoom: any;
  contactSeller:FormGroup
  userObj: any;
  userId: any;
  sellerId: any;
  imageData: any;
  validRecaptcha: boolean;
  productName: void;
  productImages: any;
  public productImgPath = environment.URLHOST + '/uploads/product/image/'
  userName: any;
  // userMobileNumber: any;
  // userEmail: any;

  constructor(
    private route:ActivatedRoute,
    private spinner:NgxSpinnerService ,
    private service :GeneralServiceService,
    private fb :FormBuilder,
    private dialog:MatDialog,
    private toastr:ToastrService,
    @Inject(DOCUMENT) private document: Document, 
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.route.params.subscribe((res)=>{
      this.productId=res.id
    })

    this.contactSeller=this.fb.group({
      name:['',[Validators.required,Validators.minLength(2),Validators.pattern(genralConfig.pattern.WHITESPACE),Validators.pattern(genralConfig.pattern.BACKSPACE)]],
      email:['',Validators.required],
      phone:[''],
      description:['',Validators.required],
      

    })
    let userData= JSON.parse(localStorage.getItem('truckStorage'))
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    this.userName = this.userObj.userInfo.personName
   if(userData && userData.userInfo){
    this.userId = userData.userInfo._id;
   }
    this.productData() 
    this.test();

    this.renderer.addClass('product_view_thumb', 'remove-sidebar-with-profile')
  }



  customOptions: OwlOptions = {
    
    loop:false,
    mouseDrag: false,
    center:true,
    dots:false,
    margin:10,
    URLhashListener:true,
    autoplayHoverPause:false,
    startPosition: 'URLHash',
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }


  productData() {
    let data = {
      _id: this.productId
    }
    this.service.productDetail(data).subscribe((res) => {
      if (res['code'] = genralConfig.statusCode.ok) {
        this.product = res['data']
        this.productImages=res['data'].images
        if(this.productImages && this.productImages.length){
          this.imageData=this.productImages[0].name
        }
        this.spinner.hide()
        this.sellerId=res['data'].createdById
        this.productName=res['data'].productName
      } else {
        this.spinner.hide()
      }
    })
  }

  test(){
    this.data = [
        {"id":"60d0fe4f5311236168a109cf","title":"one","firstName":"Carolina","lastName":"Lima","picture":"https://source.unsplash.com/800x500/?nature"},
        {"id":"60d0fe4f5311236168a109d0","title":"two","firstName":"Emre","lastName":"Asikoglu","picture":"https://source.unsplash.com/user/erondu/800x500"},
        {"id":"60d0fe4f5311236168a109d1","title":"three","firstName":"Kent","lastName":"Brewer","picture":"https://source.unsplash.com/WLUHO9A_xik/800x500"},

      ]
  }

  onSubmit(){
    if (!this.contactSeller.valid) {
      this.contactSeller.controls['name'].markAsTouched()
      this.contactSeller.controls['email'].markAsTouched()
      this.contactSeller.controls['phone'].markAsTouched()
      this.contactSeller.controls['description'].markAsTouched()
    }
    if(this.contactSeller.valid){
      this.contactSeller.value.product_id=this.productId
      this.contactSeller.value.seller_id= this.sellerId
      this.contactSeller.value.productName=this.productName
      this.spinner.show()
      this.service.contactSeller(this.contactSeller.value).subscribe((res)=>{
        if(res['code']==genralConfig.statusCode.ok){
          this.spinner.hide()
          this.toastr.success(res['message'])
          this.contactSeller.patchValue({
            description:'',
            recaptchaReactive:''
          })          
        }else{
          this.toastr.warning(res['message'])
          this.spinner.hide()
        }
      })
    }else {
      if (this.contactSeller.value.description && this.contactSeller.value.recaptchaReactive==''){
        this.toastr.warning('Please complete captcha verification')
      }
  }
}


  getImage(img){
    this.imageData = img
  }


}
