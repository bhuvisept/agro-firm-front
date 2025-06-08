import { Component,NgZone, Inject, OnInit, Renderer2 } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { environment } from 'src/environments/environment'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { genralConfig } from 'src/app/constant/genral-config.constant'
import { GeneralServiceService } from 'src/app/core/general-service.service'
import { ActivatedRoute, Router } from '@angular/router'
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  data:any[] = []
  selectedItem:any
  selectedImageForZoom: any;
  product = {prdContainer:0};
  categoryId: any
  productDetail: any
  imageDate: any
  productColor: any
  productImages:any
  public productImgPath = environment.URLHOST + '/uploads/product/image/'
  // public productImgPathMedium = environment.URLHOST + '/uploads/product/image/'
  // public productImgPathLarge = environment.URLHOST + '/uploads/product/image/'
  noImage: boolean=true
  productnNewColor: any
  currency: any
  fieldValue: any
  constructor(
    private _generalService: GeneralServiceService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.categoryId = params.Id
    })
    this.renderer.addClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
    this.getProductDetails()
    this.galleryOptions = [
      {
          width: '100%',
          height: '400px',
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide
      },
      {
          breakpoint: 800,
          width: '100%',
          height: '600px',
          imagePercent: 80,
          thumbnailsPercent: 20,
          thumbnailsMargin: 20,
          thumbnailMargin: 20
      },
      {
          breakpoint: 400,
          preview: false
      }
  ];
  this.galleryImages = [];
  }
  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'remove-sidebar-with-profile-and-top-header')
  }
  getProductDetails() {
    this.spinner.show()
    let data = {
      _id: this.categoryId,
    }
    this._generalService.productDetails(data).subscribe((response) => {
      if (response['code'] == genralConfig.statusCode.ok) {
        this.productDetail = response['data']
        this.productImages = this.productDetail.images
        if (response['data'].color) {
            this.productColor = this.productDetail.color;
            this.productnNewColor = this.productDetail.color.length;
        }
        if (response['data'].images) {
          for (let images of response['data'].images) {
            console.log(images.name)
              this.galleryImages.push({ small:this.productImgPath+images.name, medium: this.productImgPath+images.name, big: this.productImgPath+images.name })
          }
        }

        if(this.productImages && this.productImages.length){
          this.imageDate = this.productDetail.images[0].name;
          this.noImage=false
        }
        function lastWord(words) {
          let n = words.replace(/[\[\]?.,\/#!$%\^&\*;:{}=\\|_~()]/g, "").split(" ");
          return n[n.length - 1];
        }
        let value = lastWord(this.productLocation)
        this.fieldValue = value
        this.spinner.hide()
      } else {
        this.spinner.hide()
        this.toastr.error(response['message'])
      }
    })
  }
  productLocation(productLocation: any) {
    throw new Error('Method not implemented.')
  }
  customOptions: OwlOptions = {
    mouseDrag: false,
    loop:false,
    center:true,
    dots:false,
    margin:10,
    URLhashListener:true,
    autoplayHoverPause:true,
    startPosition: 'URLHash',
    nav:false,
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

  }
  getImage(img){
    this.imageDate = img
  }
  back(){
    window.history.back()
  }
}
