import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import { ManageTeamRoutingModule } from './manage-team-routing.module';
import { DriverListComponent } from './driver-list/driver-list.component';
import {NgxMaskModule} from 'ngx-mask';
import {NgxSpinnerModule} from 'ngx-spinner';
import {
  MatNativeDateModule,
  MatDatepickerModule,
  MatSelectModule,                                                                                                           
  MatCardModule,
  MatDialogModule ,
  MatAutocompleteModule,
  MatSlideToggleModule,
  MatInputModule,
 
} from '@angular/material'
import {MatTooltipModule} from '@angular/material/tooltip';

import {ReactiveFormsModule,FormsModule} from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [DriverListComponent],
  imports: [
    CommonModule,
    ManageTeamRoutingModule,
    NgxPaginationModule,   
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,                                                                                                           
    MatCardModule,
    MatDialogModule ,
    MatAutocompleteModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    NgxMaskModule,
    MatTooltipModule,
    NgxSpinnerModule,
    TranslateModule
  ]
})
export class ManageTeamModule { }
