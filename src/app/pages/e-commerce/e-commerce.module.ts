import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import {
  MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatTableModule,
  MatToolbarModule,
  MatMenuModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatSelectModule,
  MatDialogModule,
  MatDatepickerModule,
  MatTabsModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatCheckboxModule,
} from '@angular/material'
import { OrderModule } from 'ngx-order-pipe'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { ToastrModule } from 'ngx-toastr'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker'
import { NgxMaskModule } from 'ngx-mask'
import { UiSwitchModule } from 'ngx-toggle-switch'
import { MatTooltipModule } from '@angular/material/tooltip'
import { NgxSliderModule } from '@angular-slider/ngx-slider'
import { ECommerceRoutingModule } from './e-commerce-routing.module'
import { ProductListComponent } from './product-list/product-list.component'
import { ProductViewComponent } from './product-view/product-view.component'
import { ProductCartComponent } from './product-cart/product-cart.component'
import { ProductCheckoutComponent } from './product-checkout/product-checkout.component'
// import { MatSliderModule } from '@angular/material'
import { MatExpansionModule } from '@angular/material/expansion'
import { CarouselModule } from 'ngx-owl-carousel-o'
import { MatSliderModule } from '@angular/material/slider'
import { MatPaginatorModule } from '@angular/material'
import { AddWishListDialogComponent } from './add-wish-list-dialog/add-wish-list-dialog.component'
// import { NgxImageZoomModule } from 'ngx-image-zoom';
import { ProductCategoryComponent } from './product-category/product-category.component'
import { ContactSellerComponent } from './contact-seller/contact-seller.component'
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RecaptchaFormsModule } from 'ng-recaptcha'
import { ContactForSellerDialogComponentComponent } from './contact-for-seller-dialog-component/contact-for-seller-dialog-component.component'
import { RatingComponentComponent } from './rating-component/rating-component.component'
// import { ImgMagnifier } from "ng-img-magnifier";
// import { ImgMagnifier } from "ng-img-magnifier";
// import { NgxStarRatingModule } from 'ngx-star-rating';

// app.module.ts
import { NgxGalleryModule } from 'ngx-gallery'
// import {NgxMaskModule} from 'ngx-mask'
import { RatingModule } from 'ngx-rating'
import { BreadcrumbModule } from 'angular-crumbs'
import { SharedService } from 'src/app/service/shared.service'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [
    ProductListComponent,
    ProductViewComponent,
    ProductCartComponent,
    ProductCheckoutComponent,
    AddWishListDialogComponent,
    ProductCategoryComponent,
    ContactSellerComponent,
    ContactForSellerDialogComponentComponent,
    RatingComponentComponent,
  ],
  imports: [
    // ImgMagnifier,
    BreadcrumbModule,
    NgxGalleryModule,
    CommonModule,
    ECommerceRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatTabsModule,
    NgxMatNativeDateModule,
    ToastrModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    OrderModule,
    MatInputModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatChipsModule,
    CommonModule,
    FormsModule,
    CKEditorModule,
    MatCheckboxModule,
    CKEditorModule,
    NgxMaterialTimepickerModule,
    NgxMaskModule.forRoot(),
    UiSwitchModule,
    MatSliderModule,
    MatExpansionModule,
    CarouselModule,
    MatPaginatorModule,
    NgxSliderModule,
    // NgxImageZoomModule.forRoot(),
    RecaptchaModule,
    RecaptchaFormsModule,
    // NgxStarRatingModule,
    RatingModule,
    TranslateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [AddWishListDialogComponent, ContactForSellerDialogComponentComponent],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
      } as RecaptchaSettings,
    },
    SharedService,
  ],
})
export class ECommerceModule {}
