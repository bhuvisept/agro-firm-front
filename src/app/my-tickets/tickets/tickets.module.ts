import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketListCommonComponent } from '../ticket-list-common/ticket-list-common.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner'
import { ToastrModule } from 'ngx-toastr'
import {
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
  MatInputModule,
} from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination'
import { AddTicketComponent } from '../add-ticket/add-ticket.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ViewTicketComponent } from '../view-ticket/view-ticket.component';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    NgxSpinnerModule,
    ToastrModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
     MatInputModule, 
     MatSelectModule,
     NgxPaginationModule,
     MatMenuModule,
     TranslateModule,
     MatDialogModule,
     CKEditorModule,
     DirectivesModule
  ],
  declarations: [TicketListCommonComponent, AddTicketComponent, ViewTicketComponent],
  exports: [TicketListCommonComponent, AddTicketComponent, ViewTicketComponent],
  entryComponents: [TicketListCommonComponent, AddTicketComponent, ViewTicketComponent]


})
export class TicketsModule { }
