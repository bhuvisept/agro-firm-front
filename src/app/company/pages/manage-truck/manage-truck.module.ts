import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ManageTruckRoutingModule } from './manage-truck-routing.module'
import { TruckListComponent } from './truck-list/truck-list.component'
import { ViewTruckComponent } from './view-truck/view-truck.component'
import { EditTruckComponent } from './edit-truck/edit-truck.component'
import { AddTruckComponent } from './add-truck/add-truck.component'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { MatNativeDateModule, MatDatepickerModule, MatSelectModule, MatCardModule, MatDialogModule, MatAutocompleteModule, MatProgressSpinnerModule } from '@angular/material'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { ConfirmationDialogueComponent } from '../manage-truck/confirmation-dialogue/confirmation-dialogue.component'
import { NgxSpinnerModule } from 'ngx-spinner'
import { MatPaginatorModule } from '@angular/material'
import { NgxPaginationModule } from 'ngx-pagination';
import { EditTrailerComponent } from './edit-trailer/edit-trailer.component';
import {NgxMaskModule} from 'ngx-mask'
import { TranslateModule } from '@ngx-translate/core'
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [TruckListComponent, ViewTruckComponent, EditTruckComponent, AddTruckComponent, ConfirmationDialogueComponent, EditTrailerComponent, ],

  imports: [
    CommonModule,
    ManageTruckRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCardModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    HttpClientModule,
    FormsModule,
    MatSlideToggleModule,
    MatDialogModule,
    NgxSpinnerModule,
    MatPaginatorModule,
    NgxPaginationModule,
    MatAutocompleteModule,
    NgxMaskModule.forRoot(),
    TranslateModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  entryComponents: [ConfirmationDialogueComponent],
})
export class ManageTruckModule {}
