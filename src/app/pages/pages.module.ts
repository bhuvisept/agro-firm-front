import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule, MatButtonModule, MatCardModule, MatTableModule, MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule, MatNativeDateModule, MatSelectModule, MatDialogModule, MatDatepickerModule, MatTabsModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { NgxSpinnerModule,NgxSpinnerService } from 'ngx-spinner';
import { NgxMatDatetimePickerModule,  NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { AngularCountdownTimerModule } from 'angular8-countdown-timer';
import { ToastrModule } from 'ngx-toastr';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PagesRoutingModule } from './pages-routing.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { PagesComponent } from './pages.component';
import { EventsComponent } from './events/events.component';
import { ServicesComponent } from './services/services.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { BlogsComponent } from './blogs/blogs.component';
import { GeneralServiceService } from '../core/general-service.service';
import { EventDetailsComponent } from './event-details/event-details.component';
import { PricingPageComponent } from './pricing-page/pricing-page.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { ServicesDetailComponent } from './services-detail/services-detail.component';
import {NgxMaskModule} from 'ngx-mask';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { PaymentComponent } from './payment/payment.component'
import {NgxStripeModule} from 'ngx-stripe';
import { PlanCartComponent } from './plan-cart/plan-cart.component'
import {MatRadioModule} from '@angular/material/radio';
import { SharedService } from '../service/shared.service';
import { UpgradePlanComponent } from './upgrade-plan/upgrade-plan.component';
import { TranslateModule } from '@ngx-translate/core';
import { TripPlannerComponent } from './trip-planner/trip-planner.component';
import { PromosPopupComponent } from './promos-popup/promos-popup.component';
import { FaqComponent } from './faq/faq.component';
import {MatExpansionModule} from '@angular/material/expansion';

import { MatStepperModule } from '@angular/material/stepper';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { InstallmentPaymentComponent } from './installmentPayment/installmentPayment.component';
// import { CardComponent } from './card/card.component';

@NgModule({
  declarations: [AboutUsComponent,InstallmentPaymentComponent, PagesComponent, ServicesComponent, EventsComponent, BlogsComponent, ContactUsComponent, EventDetailsComponent, PricingPageComponent, BlogDetailsComponent, ServicesDetailComponent, PrivacyPolicyComponent, TermsAndConditionsComponent, LoginDialogComponent, PaymentComponent, PlanCartComponent, TripPlannerComponent, PromosPopupComponent, FaqComponent, UpgradePlanComponent, TermsConditionComponent],
  imports: [
    CommonModule,
    NgxMaskModule,
    PagesRoutingModule,
    Ng2SearchPipeModule,
    FormsModule,
    MatCardModule,
    CommonModule,
    MatInputModule,
    MatButtonModule, 
    MatCardModule, 
    MatInputModule, 
    MatTableModule,
    MatToolbarModule, 
    MatTabsModule,
    MatMenuModule, 
    MatDialogModule,
    MatIconModule, 
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatNativeDateModule,
    MatSelectModule,
    GooglePlaceModule,
    NgxPaginationModule,
    OrderModule,
    NgxStripeModule.forRoot('pk_test_51HFJPzAbeKm8NUzZXthjPzMslRkheryDF4jNCX3bVPAVxHglFSpi4oGcQAlg1ulInuMuV6Le3Ju3aYN8V8XtTESr00gxpGCXH4'),
    NgxMatDatetimePickerModule,
    MatDatepickerModule,
    Ng2SearchPipeModule,
    NgxMatNativeDateModule,
    NgxSpinnerModule,
    AngularCountdownTimerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaterialTimepickerModule,
    MatDialogModule,
    ToastrModule,
    MatCheckboxModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaterialTimepickerModule,
    ToastrModule,
    MatCheckboxModule,
    ToastrModule,
    MatCheckboxModule,
    ToastrModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaterialTimepickerModule,
    MatRadioModule,
    TranslateModule,
    MatExpansionModule,
    MatStepperModule
  ],
  providers:[SharedService,GeneralServiceService,NgxSpinnerService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents : [LoginDialogComponent , PromosPopupComponent],
  exports : [LoginDialogComponent , PromosPopupComponent]
})
export class PagesModule { }
