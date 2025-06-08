import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriversRoutingModule } from './drivers-routing.module';
import { DriversComponent } from './drivers/drivers.component';

import {
  MatNativeDateModule,
  MatDatepickerModule,
  MatSelectModule,
  MatCardModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatSlideToggleModule,
  MatInputModule,
} from '@angular/material'
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { NewDriverInviteComponent } from './new-driver-invite/new-driver-invite.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [DriversComponent, NewDriverInviteComponent],
  imports: [
    NgxPaginationModule,
    CommonModule,
    DriversRoutingModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    NgxMaskModule,
    MatTooltipModule,
    NgxSpinnerModule,
    MatStepperModule,
    TranslateModule
  ],
  entryComponents: [
    NewDriverInviteComponent
  ]
})
export class DriversModule { }
