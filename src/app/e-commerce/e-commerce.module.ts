
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { ECommerceRoutingModule } from './e-commerce-routing.module'
import { CreateProductComponent } from './create-product/create-product.component'
import { ListProductComponent } from './list-product/list-product.component'
import { ViewProductComponent } from './view-product/view-product.component'
import { CarouselModule } from 'ngx-owl-carousel-o'
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
  MatRadioModule,
  MatStepperModule,
  MatSlideToggleModule,
  MatProgressBarModule,
} from '@angular/material'
import { OrderModule } from 'ngx-order-pipe'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { ToastrModule } from 'ngx-toastr'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker'
import { MatExpansionModule } from '@angular/material/expansion'
import { NgxMaskModule } from 'ngx-mask'
import { UiSwitchModule } from 'ngx-toggle-switch'
import { MatTooltipModule } from '@angular/material/tooltip'
import { DashboardComponent } from './dashboard/dashboard.component'
import { SidemenuComponent } from './sidemenu/sidemenu.component'
import { ECommerceHeaderComponent } from './e-commerce-header/e-commerce-header.component'
import { ViewProfileComponent } from './view-profile/view-profile.component'
import { EditProfileComponent } from './edit-profile/edit-profile.component'
import { NgxDropzoneModule } from 'ngx-dropzone'
import { AddProductTruckComponent } from './truck-form/add-product-truck/add-product-truck.component'
import { EditTruckComponent } from './truck-form/edit-truck/edit-truck.component'
import { AddTrailerComponent } from './trailer-from/add-trailer/add-trailer.component'
import { EditTrailerComponent } from './trailer-from/edit-trailer/edit-trailer.component'
import { AddSparepartsComponent } from './spareParts-form/add-spareparts/add-spareparts.component'
import { EditSparepartsComponent } from './spareParts-form/edit-spareparts/edit-spareparts.component'
import { AddAccessoriesComponent } from './accessories-form/add-accessories/add-accessories.component'
import { EditAccessoriesComponent } from './accessories-form/edit-accessories/edit-accessories.component'
// import { NgxImageZoomModule } from 'ngx-image-zoom';
import { BrandListComponent } from './manage-product/brand/brand-list/brand-list.component'
import { CategoryListComponent } from './manage-product/category/category-list/category-list.component'
import { ModelListComponent } from './manage-product/model/model-list/model-list.component'
import { ModelDeletConfirmationComponent } from './manage-product/model/model-list/model-delet-confirmation/model-delet-confirmation.component'
import { AddTruckUnitsComponent } from './truck-units-form/add-truck-units/add-truck-units.component'
import { EditTruckUnitsComponent } from './truck-units-form/edit-truck-units/edit-truck-units.component'
import { QuriesComponent } from './quries/quries.component'
import { BrandDeletConfirmationComponent } from './manage-product/brand/brand-delet-confirmation/brand-delet-confirmation.component'
import { AddBrandComponent } from './manage-product/brand/add-brand/add-brand.component'
import { AddCategoryComponent } from './manage-product/category/add-category/add-category.component'
import { AddModelComponent } from './manage-product/model/add-model/add-model.component'
import { QuesAnsComponent } from './ques-ans/ques-ans.component'
import { AnswerQuesComponent } from './answer-ques/answer-ques.component'
import 'hammerjs'
import { NgxGalleryModule } from 'ngx-gallery'
import { AddMisceProductComponent } from './miscellaneous-form/add-misce-product/add-misce-product.component'
import { EditMisceProductComponent } from './miscellaneous-form/edit-misce-product/edit-misce-product.component'
import { SupportComponent } from './support/support.component'
import { UpdateProfileComponent } from './update-profile/update-profile.component'
import { SellerRatingComponent } from './seller-rating/seller-rating.component'
import {CompanyToSellerComponent} from './company-to-seller/company-to-seller.component'
import {RatingModule} from "ngx-rating";
import { ImageCropperModule } from 'ngx-image-cropper'
import { InviteTeamComponent } from './invite-team/invite-team.component'
import { DialogInviteTeamComponent } from './dialog-invite-team/dialog-invite-team.component'
import { NotificationComponent } from './notification/notification.component'
import { MyPlanComponent } from './my-plan/my-plan.component'
import { TranslateModule } from '@ngx-translate/core'
import { CancelEcommercePlanComponent } from './cancel-ecommerce-plan/cancel-ecommerce-plan.component'
import { InstallmentListComponent } from './installmentList/installmentList.component'
import { CardComponent } from './card/card.component'
import { MyTicketsComponent } from './my-tickets/my-tickets.component'
import { TicketsModule } from '../my-tickets/tickets/tickets.module'

// import { ConfirmationDialogComponent } from '../company/confirmation-dialog/confirmation-dialog.component'
// import { CancelPlanDialogComponent } from '../company/pages/cancel-plan-dialog/cancel-plan-dialog.component'
const declarations= [
  CreateProductComponent,
  ListProductComponent,
  ViewProductComponent,
  DashboardComponent,
  SidemenuComponent,
  ECommerceHeaderComponent,
  ViewProfileComponent,
  AddMisceProductComponent,
  SupportComponent,
  EditMisceProductComponent,
  EditProfileComponent,
  AddProductTruckComponent,
  EditTruckComponent,
  AddTrailerComponent,
  EditTrailerComponent,
  AddSparepartsComponent,
  EditSparepartsComponent,
  InstallmentListComponent,
  AddAccessoriesComponent,
  EditAccessoriesComponent,
  BrandListComponent,
  CategoryListComponent,
  MyPlanComponent,
  ModelListComponent,
  ModelDeletConfirmationComponent,
  AddTruckUnitsComponent,
  EditTruckUnitsComponent,
  QuriesComponent,
  BrandDeletConfirmationComponent,
  AddBrandComponent,
  AddCategoryComponent,
  AddModelComponent,
  QuesAnsComponent,
  AnswerQuesComponent,
  UpdateProfileComponent,
  SellerRatingComponent,
  CompanyToSellerComponent,
  InviteTeamComponent,
  DialogInviteTeamComponent,
  NotificationComponent,
  CancelEcommercePlanComponent,
  CardComponent,
  MyTicketsComponent
]
@NgModule({
  declarations: [
    declarations
  ],
  imports: [
    ImageCropperModule,
    RatingModule,
    NgxGalleryModule,
    CommonModule,
    ECommerceRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    CarouselModule,
    FormsModule,
    MatTooltipModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatTabsModule,
    NgxMatNativeDateModule,
    MatStepperModule,
    ToastrModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    OrderModule,
    MatInputModule,
    MatRadioModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatExpansionModule,
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
    NgxMaskModule.forChild(),
    UiSwitchModule,
    NgxDropzoneModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    TicketsModule,
    // NgxStarRatingModule,
    TranslateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [declarations],
  exports: [
    declarations
  ],
})
export class ECommerceModule {}
