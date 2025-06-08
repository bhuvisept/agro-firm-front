import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatListModule } from '@angular/material/list'
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
  MatDatepickerToggle,
} from '@angular/material'
import { MatStepperModule } from '@angular/material/stepper'
import { TripPlannerRoutingModule } from './trip-planner-routing.module'
import { AddTripComponent } from './add-trip/add-trip.component'
import { TripPlannerComponent } from './trip-planner/trip-planner.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material'
import { NgxSpinnerModule } from 'ngx-spinner'
import { AddStopageComponent } from './add-stopage/add-stopage.component'
import { TripDetailsComponent } from './trip-details/trip-details.component'
import { NgxSliderModule } from '@angular-slider/ngx-slider'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker'
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatSidenavModule } from '@angular/material/sidenav'
import { NgxPaginationModule } from 'ngx-pagination'
import { LiveTrackComponent } from './live-track/live-track.component'
import { InstructionDialogComponent } from './instruction-dialog/instruction-dialog.component'
import { NgxMaskModule } from 'ngx-mask'
import { ViewMapComponent } from './view-map/view-map.component'
import { EditDriverComponent } from './edit-driver/edit-driver.component'
import { TripCompleteComponent } from './trip-complete/trip-complete.component'
import { TripStartComponent } from './trip-start/trip-start.component'
import { AddDriverComponent } from './add-driver/add-driver.component'
import { TranslateModule } from '@ngx-translate/core'
import { OrderModule } from 'ngx-order-pipe'

@NgModule({
  declarations: [
    AddTripComponent,
    TripPlannerComponent,
    AddStopageComponent,
    TripDetailsComponent,
    LiveTrackComponent,
    InstructionDialogComponent,
    ViewMapComponent,
    EditDriverComponent,
    TripCompleteComponent,
    TripStartComponent,
    AddDriverComponent,
  ],
  imports: [
    CommonModule,
    TripPlannerRoutingModule,
    MatCheckboxModule,
    NgxMaterialTimepickerModule,
    MatInputModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    Ng2SearchPipeModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    NgxPaginationModule,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    FormsModule,
    MatStepperModule,
    NgxSpinnerModule,
    MatExpansionModule,
    OrderModule,
    NgxSliderModule,
    NgxMaskModule.forRoot(),
    TranslateModule,
  ],

  entryComponents: [InstructionDialogComponent, TripCompleteComponent, TripStartComponent],
  providers: [MatDatepickerToggle],
})
export class TripPlannerModule {}
