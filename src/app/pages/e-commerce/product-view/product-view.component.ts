import { ChangeDetectorRef, Component, ComponentFactoryResolver, NgZone, OnInit } from '@angular/core'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ActivatedRoute, Router } from '@angular/router'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { NgxSpinnerService } from 'ngx-spinner'
import { MatDialog } from '@angular/material'
import { ToastrService } from 'ngx-toastr'
import { OwlOptions } from 'ngx-owl-carousel-o'
import { ContactForSellerDialogComponentComponent } from '../contact-for-seller-dialog-component/contact-for-seller-dialog-component.component'
import { environment } from 'src/environments/environment'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery'
import { SharedService } from 'src/app/service/shared.service'
import io from 'socket.io-client'
import { timeStamp } from 'console'
const SOCKET_ENDPOINT = environment.URLHOST
const Filter = require('bad-words')
const customFilter = new Filter({ regex: /\*|\.|$/gi })
@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css'],
})
export class ProductViewComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[]
  galleryImages: NgxGalleryImage[]
  product: any = []
  productId: any
  qty: any = 1
  overAllSellerRating: any = []
  overAllSellerRatingCount = 0
  userObj: any
  userId: any
  data: any[] = []
  socket
  currentRate = 3.14
  public productImgPathDefault = environment.URLHOST + '/uploads/product/image/'

  public productImgPath = environment.URLHOST + '/uploads/product/image/thumbnail_150X120/'
  public productImgPathMedium = environment.URLHOST + '/uploads/product/image/thumbnail_1100X685/'
  public productImgPathLarge = environment.URLHOST + '/uploads/product/image/thumbnail_1100X685/'
  // data: { id: string; title: string; firstName: string; lastName: string; picture: string; }[];
  selectedImageForZoom: any
  productImages: any = []
  cusImg = 'https://source.unsplash.com/800x500/?nature'
  imageData: any
  sellerId: any
  question: any
  addQuestion: FormGroup
  quesAnsList: any
  totalCount: any
  page: number = 1
  isData: boolean
  productColor: any
  productColorLength = 0
  productQuestions: any = []
  // imageArrows:boolean = true
  ToatalCount: number = 5
  SimilarproductList: any
  categoryId: any
  SimilarproductTotalCountList: any = 0
  roleTitle: any
  categoryName: any
  fullAddress: any
  fieldValue: any
  companyId:any
  constructor(
    private service: GeneralServiceService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,

    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private SharedService: SharedService,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    setTimeout(() => {
      this.ngZone.run(() => {
        this.changeDetector.detectChanges()
      })
    })
  }
  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('truckStorage'))
    this.userObj = JSON.parse(localStorage.getItem('truckStorage'))
    if (userData && userData.userInfo) {
      this.roleTitle = userData.userInfo.roleId.roleTitle
      if (this.roleTitle == 'SELLER') {
        return this.router.navigate(['/login'])
      }
    }
    if (userData && userData.userInfo) {
      this.userId = userData.userInfo._id
    }
    window.scroll(0, 0)
    this.route.params.subscribe((res) => {
      if (res.id) {
        this.productId = res.id
        this.productData()
      }
    })
    // this.productQuestion(this.page)
    this.galleryOptions = [
      {
        width: '100%',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
      },
      // max-width 800
      {
        // imageArrowsAutoHide:true,
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20,
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false,
      },
    ]
    this.galleryImages = []
  }
  similarProductOptions: OwlOptions = {
    loop: false,
    autoplay: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 25,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 2,
      },
    },
    nav: true,
  }
  async productData() {
    let data = {
      _id: this.productId,
      userId: this.userId,
    }
    this.spinner.show()
    await this.service.productDetail(data).subscribe((res) => {
      if ((res['code'] = genralConfig.statusCode.ok)) {
        window.scroll(0, 0)
        this.product = res['data']

        if (res['data'].color) {
          this.productColor = this.product.color
          this.productColorLength = this.product.color.length
        }
        this.companyId = res['data'].companyId  // added by shivam kashyap 19-12-2022
        this.sellerId = res['data'].createdById
        this.categoryName = res['data'].constant_name
        this.productImages = res['data'].images
        this.categoryId = this.product.categoryId
        this.productQuestion(this.page)
        this.getSimilarproductData()
        this.sellerRating()
        if (res['data'].images) {
          for (let images of res['data'].images) {
            this.galleryImages.push({ small: this.productImgPath + images.name, medium: this.productImgPathDefault + images.name, big: this.productImgPathLarge + images.name })
          }
        }
        console.log(this.galleryImages)
        if (this.productImages && this.productImages.length) {
          this.imageData = this.productImages[0].name
        }
        this.fullAddress = res['data'].location
        function lastWord(words) {
          let n = words.replace(/[\[\]?.,\/#!$%\^&\*;:{}=\\|_~()]/g, '').split(' ')
          return n[n.length - 1]
        }
        let value = lastWord(this.fullAddress)
        this.fieldValue = value
        this.spinner.hide()
      } else {
        this.spinner.hide()
      }
    })
  }
  checkUser() {
    if (!this.userId) {
      const dialogRef = this.dialog.open(ContactForSellerDialogComponentComponent, {
        width: '500px',
      })
      return
    }
  }
  getSimilarproductData() {
    let Data = {
      categoryId: this.categoryId,
      productId: this.productId ? this.productId : '',
    }
    this.spinner.show()
    this.service.similarproductList(Data).subscribe((res) => {
      if (res['code'] == 200) {
        this.SimilarproductList = res['data']
        this.SimilarproductTotalCountList = this.SimilarproductList.length
        this.spinner.hide()
      } else {
        this.spinner.hide()
      }
    })
  }
  productQuestion(page) {
    let Data = {
      sellerId: this.sellerId ? this.sellerId : '',
      productId: this.productId ? this.productId : '',
      count: this.ToatalCount,
      page: page,
    }
    this.spinner.show()
    this.service.questionList(Data).subscribe((res) => {
      if (res['code'] == 200) {
        this.quesAnsList = res['data']
        for (let item of this.quesAnsList) {
          this.productQuestions.push(item)
        }
        this.totalCount = res['totalCount']
        if (this.quesAnsList.length) {
          this.isData = true
        }
        this.spinner.hide()
      } else {
        this.spinner.hide()
      }
    })
  }
  sellerRating() {

    let data = {
      sellerId: this.sellerId,
      productId:this.productId
    }
    this.service.overAllSellerRating(data).subscribe((res) => {
      if (res['code'] == 200) {
        if (res['data'].length) {
          this.overAllSellerRating = res['data'][0]
        } else {
          this.overAllSellerRatingCount = 0
        }
      }
    })
  }
  onSubmit() {
    if (!this.userId) {
      const dialogRef = this.dialog.open(ContactForSellerDialogComponentComponent, {
        width: '500px',
      })
      return
    }
    if (this.question) {
      this.question = customFilter.clean(this.question)
    }
    let data = {
      sellerId:  this.companyId,
      productId: this.productId,
      question: this.question,
      customerId: this.userId,
      userId: this.userId,
      userName: this.userObj.userInfo.personName,
      productName: this.product.productName,
    }

    this.spinner.show()
    this.service.addQuestion(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.question = ''
        this.toastr.success(res['message'])
        // this.productQuestion(this.page)
        this.spinner.hide()
      } else {
        this.spinner.hide()
      }
    })
  }
  pagechange() {
    this.page += 1
    this.productQuestion(this.page)
  }
  seeLess() {
    this.page = 1
    let data = this.productQuestions.splice(0, 5)
    this.productQuestions = []
    this.productQuestions.push(...data)
  }

  addToWishList(id) {
    if (!this.userId) {
      const dialogRef = this.dialog.open(ContactForSellerDialogComponentComponent, {
        width: '500px',
      })
      dialogRef.afterClosed().subscribe((response) => {})
      return
    }
    let data = {
      productId: id,
      userId: this.userId,
    }
    this.spinner.show()

    this.service.addToWishList(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.product.iswishList = true
        this.spinner.hide()

        this.toastr.success(res['message'])
      } else {
        this.spinner.hide()
        this.toastr.warning(res['message'])
      }
    })
  }
  removeFromWishList(id) {
    let data = {
      productId: id,
      _id: this.userId,
    }
    this.spinner.show()

    this.service.removeWishList(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.product.iswishList = false
        this.spinner.hide()

        this.toastr.success('Product removed from wish list')
      } else {
        this.spinner.hide()
        this.productData()
        this.toastr.success(res['message'])
      }
    })
  }

  contactForSeller(id) {
    const dialogRef = this.dialog.open(ContactForSellerDialogComponentComponent, {
      width: '500px',
      // data: { jobId: id }
    })
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        let data = {
          productId: id,
          userId: this.userId,
        }
        this.spinner.show()
        this.service.addToWishList(data).subscribe((res) => {
          if (res['code'] == 200) {
            this.spinner.hide()
            this.toastr.success(res['message'])
          } else {
            this.spinner.hide()
            this.toastr.warning(res['message'])
          }
        })
      }
    })
  }
  addToCart(id) {
    if (!this.userId) {
      const dialogRef = this.dialog.open(ContactForSellerDialogComponentComponent, {
        width: '400px',
      })
      dialogRef.afterClosed().subscribe((response) => {})
      return
    }
    let data = {
      productId: id,
      quantity: this.qty,
      userId: this.userId,
    }
    this.spinner.show()
    this.service.productAddToCart(data).subscribe((res) => {
      if (res['code'] == 200) {
        this.toastr.success(res['message'])
        this.spinner.hide()
      } else {
        this.spinner.hide()
        this.toastr.warning(res['code'])
      }
    })
  }

  chatRouteFun(pro) {
    if (pro.createdById == this.userObj.userInfo._id) return this.toastr.warning('Cannot chat with this account')
    let sellerData = {
      id: pro.createdById,
      name: pro.seller_name,
      product_id:pro._id,
      productName:pro.productName    // changes by shivam kashyap 07/12/2022
    }
    localStorage.setItem('chatSellerData', JSON.stringify(sellerData))
    localStorage.setItem('chatSellerDataProduct', JSON.stringify(sellerData)) // changes by shivam kashyap 07/12/2022

    this.router.navigateByUrl('/chat-window')
  }
}
