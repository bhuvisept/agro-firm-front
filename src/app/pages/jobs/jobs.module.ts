import { JobsRoutingModule } from './jobs-routing.module'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ViewJobComponent } from './view-job/view-job.component'
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
  MatTabsModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatCheckboxModule,
} from '@angular/material'
import { OrderModule } from 'ngx-order-pipe'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { ToastrModule } from 'ngx-toastr'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'
import { ListJobComponent } from './list-job/list-job.component'
import { ApplyjobDialogComponent } from './applyjob-dialog/applyjob-dialog.component'
import { SavejobDialogComponent } from './savejob-dialog/savejob-dialog.component'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [ViewJobComponent, ListJobComponent, ApplyjobDialogComponent, SavejobDialogComponent],
  imports: [
    CommonModule,
    JobsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatTabsModule,
    NgxMatNativeDateModule,
    ToastrModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    OrderModule,
    MatInputModule,
    HttpClientModule,
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
    CommonModule,
    FormsModule,
    CKEditorModule,
    MatCheckboxModule,
    TranslateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ApplyjobDialogComponent, SavejobDialogComponent],
})
export class JobsModule {}
