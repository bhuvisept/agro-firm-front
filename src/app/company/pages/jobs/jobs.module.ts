import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobsRoutingModule } from './jobs-routing.module';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTooltipModule,MatInputModule, MatButtonModule, MatCardModule, MatTableModule, MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule, MatNativeDateModule, MatSelectModule, MatDialogModule, MatDatepickerModule, MatTabsModule, MatAutocompleteModule, MatChipsModule, MatCheckboxModule } from '@angular/material';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxMaskModule ,IConfig} from 'ngx-mask'
import { UiSwitchModule } from 'ngx-toggle-switch';
import { ApplicantsListComponent } from './applicants-list/applicants-list.component';
import { CreateJobComponent } from './create-job/create-job.component';
import { EditJobComponent } from './edit-job/edit-job.component';
import { ListJobComponent } from './list-job/list-job.component';
import { ViewJobComponent } from './view-job/view-job.component';
import { ConfirmationDialogueComponent } from '../jobs/confirmation-dialogue/confirmation-dialogue.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDocViewerModule } from '../../../../../node_modules/ngx-doc-viewer';
import { TranslateModule } from '@ngx-translate/core';
import { ReopenJobComponent } from './reopen-job/reopen-job.component';

const maskConfig: Partial<IConfig> | any = {
  validation:true,
};

@NgModule({
  declarations: [ApplicantsListComponent, CreateJobComponent, EditJobComponent,ReopenJobComponent, ListJobComponent, ConfirmationDialogueComponent,ViewJobComponent,],
  imports: [
    CommonModule,
    NgxDocViewerModule,
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
    MatTooltipModule, 
    MatToolbarModule, 
    PdfViewerModule,
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
    CKEditorModule,
    NgxMaterialTimepickerModule,
    NgxMaskModule.forRoot(maskConfig),
    UiSwitchModule,
    AngularEditorModule,
    TranslateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ConfirmationDialogueComponent]
})
export class JobsModule { }
