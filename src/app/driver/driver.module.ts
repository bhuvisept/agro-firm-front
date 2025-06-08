import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverRoutingModule } from './driver-routing.module';
import { DriverComponent } from './driver.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule, MatButtonModule, MatCardModule, MatTableModule, MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule, MatNativeDateModule, MatSelectModule, MatDialogModule, MatDatepickerModule } from '@angular/material';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { PlannedTripComponent } from './pages/planned-trip/planned-trip.component';
import { DisplayRouteComponent } from './pages/display-route/display-route.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DriverTripCompleteComponent } from './pages/driver-trip-complete/driver-trip-complete.component';
import { StartTripDialogComponent } from './pages/start-trip-dialog/start-trip-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [DriverComponent, PlannedTripComponent, DisplayRouteComponent, DriverTripCompleteComponent, StartTripDialogComponent],
  imports: [
    CommonModule,
    DriverRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    MatInputModule,
    MatExpansionModule,
    MatButtonModule, MatCardModule, MatInputModule, MatTableModule,
    MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule,MatFormFieldModule,
    ReactiveFormsModule,FormsModule,
    MatNativeDateModule, MatSelectModule,
    GooglePlaceModule,NgxPaginationModule,
    OrderModule,
    MatDialogModule,
    NgxMatDatetimePickerModule,MatDatepickerModule,NgxMatTimepickerModule,NgxMatNativeDateModule,
    TranslateModule
  ],
  entryComponents:[DriverTripCompleteComponent, StartTripDialogComponent], 
})
export class DriverModule { }
