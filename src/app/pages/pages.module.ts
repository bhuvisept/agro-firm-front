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
import { ContactUsComponent } from './contact-us/contact-us.component';
import { GeneralServiceService } from '../core/general-service.service';
import {NgxMaskModule} from 'ngx-mask';
import {MatRadioModule} from '@angular/material/radio';
import { SharedService } from '../service/shared.service';
import { TranslateModule } from '@ngx-translate/core';
import {MatExpansionModule} from '@angular/material/expansion';

import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  declarations: [AboutUsComponent, PagesComponent,  ContactUsComponent],
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
  entryComponents : [ ],
  exports : []
})
export class PagesModule { }
