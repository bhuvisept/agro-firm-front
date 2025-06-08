import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EventManagementRoutingModule } from './event-management-routing.module';
import { CreateEventComponent,  } from './create-event/create-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { ListEventComponent } from './list-event/list-event.component';
import { MatInputModule,
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
    MatTabsModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from 'ngx-order-pipe';
import { NgxSpinnerModule,NgxSpinnerService } from 'ngx-spinner';
import { NgxMatDatetimePickerModule,  NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { GeneralServiceService } from '../../../../app/core/general-service.service';
import { AngularCountdownTimerModule } from 'angular8-countdown-timer';
import { ViewEventComponent } from './view-event/view-event.component';
import { ToastrModule } from 'ngx-toastr';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AgmCoreModule } from '@agm/core';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import {NgxMaskModule} from 'ngx-mask'
import { ImageCropperModule } from 'ngx-image-cropper';
import { EventCancelComponent } from './event-cancel/event-cancel.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TranslateModule } from '@ngx-translate/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ReopenEventComponent } from './reopen-event/reopen-event.component';

@NgModule({
  declarations: [
    CreateEventComponent, EventCancelComponent,EditEventComponent,ReopenEventComponent, ListEventComponent, ViewEventComponent, DeleteConfirmationDialogComponent, EventCancelComponent 
     
  ],
  imports: [
    CommonModule,
    NgxMaskModule.forRoot(),
    EventManagementRoutingModule, 
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
    ImageCropperModule,
    MatCheckboxModule,
    ToastrModule,
    MatCheckboxModule,
    ToastrModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxMaterialTimepickerModule,
    CKEditorModule,
    MatProgressBarModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC0y2S4-iE2rHkYdyAsglz_qirv0UtpF1s',
      libraries: ["places"], 
    }),
    TranslateModule
  ] ,
  providers: [GeneralServiceService, NgxSpinnerService, DatePipe, DeleteConfirmationDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    DeleteConfirmationDialogComponent,
    EventCancelComponent
  ],
})
export class EventManagementModule { }
