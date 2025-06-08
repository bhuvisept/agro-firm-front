import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CompanyRoutingModule } from './company-routing.module'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { CompanyComponent } from './company.component'
import { MyProfileComponent } from './pages/my-profile/my-profile.component'
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
  MatSlideToggleModule,
} from '@angular/material'
import { GooglePlaceModule } from 'ngx-google-places-autocomplete'
import { OrderModule } from 'ngx-order-pipe'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { ToastrModule } from 'ngx-toastr'
import { NgxMaskModule } from 'ngx-mask'
import { AgmCoreModule } from '@agm/core'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { PdfViewerModule } from 'ng2-pdf-viewer'
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component'
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component'
import { ImageCropperModule } from 'ngx-image-cropper'
import { CarouselModule } from 'ngx-owl-carousel-o'
import { SellerCompanyComponent } from './pages/seller-company/seller-company.component'
import { MatStepperModule } from '@angular/material/stepper'
import { CompanyLeftComponent } from './pages/company-left/company-left.component'
import { LeftUsersComponent } from './pages/left-users/left-users.component'
import { MatTabsModule } from '@angular/material/tabs'
import { ActivityLogComponent } from './pages/activity-log/activity-log.component'
import { ViewPlanComponent } from '../company/pages/view-plan/view-plan.component'
import { NewsFeedComponent } from './pages/news-feed/news-feed.component'
import { TranslateModule } from '@ngx-translate/core'
import { CancelPlanDialogComponent } from './pages/cancel-plan-dialog/cancel-plan-dialog.component'
import { CardComponent } from './pages/card/card.component'
import { InstallmentListComponent } from './pages/installmentList/installmentList.component'
import { MyTicketsComponent } from './pages/my-tickets/my-tickets.component'
import { TicketsModule } from '../my-tickets/tickets/tickets.module'
import {MatProgressBarModule} from '@angular/material/progress-bar';


@NgModule({
  declarations: [
    DashboardComponent,
    CardComponent,
    ViewPlanComponent,
    CompanyComponent,
    MyProfileComponent,
    EditProfileComponent,
    ConfirmationDialogComponent,
    SellerCompanyComponent,
    CompanyLeftComponent,
    LeftUsersComponent,
    ActivityLogComponent,
    NewsFeedComponent,
    CancelPlanDialogComponent,
    InstallmentListComponent,
    MyTicketsComponent,
  ],
  imports: [
    CommonModule,
    CarouselModule,
    CompanyRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    InfiniteScrollModule,
    MatInputModule,
    MatTableModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatSelectModule,
    PdfViewerModule,
    GooglePlaceModule,
    NgxPaginationModule,
    OrderModule,
    MatDialogModule,
    NgxMatDatetimePickerModule,
    MatDatepickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatStepperModule,
    NgxMaskModule.forChild(),
    AgmCoreModule,
    ImageCropperModule,
    MatTabsModule,
    TranslateModule,
    TicketsModule,
    MatProgressBarModule,
  
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ConfirmationDialogComponent, CompanyLeftComponent, CancelPlanDialogComponent, MyTicketsComponent, EditProfileComponent],
  exports: [ConfirmationDialogComponent, CompanyLeftComponent, CancelPlanDialogComponent, MyTicketsComponent, EditProfileComponent],

})
export class CompanyModule {}
