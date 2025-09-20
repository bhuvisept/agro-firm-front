import { Component, OnInit } from '@angular/core';
import { GeneralServiceService } from 'src/app/core/general-service.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
// import { DatePipe } from '@angular/common'
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery'

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})

export class ProductViewComponent implements OnInit {
  productId: any;
  productData: any;
  productImages: any
  productImgPath = environment.URLHOST + '/uploads/product/thumbnail_150X120/'
  product_image_url = environment.URLHOST + '/uploads/product/thumbnail_245X245/'
  productImgPathLarge = environment.URLHOST + '/uploads/product/thumbnail_800X500/'

  galleryOptions: NgxGalleryOptions[]
  galleryImages: NgxGalleryImage[]

  constructor(
    private _generalService: GeneralServiceService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.productId = param.id;
      // console.log(" this.eventId ", this.eventId)
      if (this.productId) {
        this.getProductDetail(this.productId);
      } else {
      }
    })
    this.galleryOptions = [
      {
        width: '100%',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        previewCloseOnClick: true,    // <-- close when clicking the big image
        previewCloseOnEsc: true,      // <-- close on ESC key
        previewKeyboardNavigation: true
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
    window.scroll(0, 0);
  }
  getProductDetail(productId) {
    this.spinner.show()
    this._generalService.getProductDetail({ _id: productId }).subscribe(result => {

      if (result['code'] === 200) {
        this.productData = result['data'];
        this.productImages = this.productData.images;

        if (result['data'].images) {
          for (let images of result['data'].images) {
            this.galleryImages.push({ small: this.productImgPath + images.name, medium: this.product_image_url + images.name, big: this.productImgPathLarge + images.name })
          }
        }

        console.log("this.galleryImages ==", this.galleryImages)
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
      } else { }
      // this.spinner.hide();
    });
  }

}
