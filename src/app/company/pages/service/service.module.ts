import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRoutingModule } from './service-routing.module';
import { AddServiceComponent } from './add-service/add-service.component';
import { ReactiveFormsModule ,FormsModule } from '@angular/forms';
import {MatInputModule,MatButtonModule,MatCardModule,MatTableModule, MatToolbarModule,MatMenuModule, MatIconModule,MatProgressSpinnerModule, MatFormFieldModule,MatNativeDateModule,MatSelectModule,MatDialogModule,MatDatepickerModule } from '@angular/material';
import { MatAutocompleteModule} from '@angular/material'
import { NgxSpinnerModule } from 'ngx-spinner';
import { ServiceListComponent } from './service-list/service-list.component';
import { UpdateServiceComponent } from './update-service/update-service.component';
import { ViewServicesComponent } from './view-services/view-services.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component'
import {NgxMaskModule} from 'ngx-mask'
import { NgxPaginationModule } from 'ngx-pagination'
import { ImageCropperModule } from 'ngx-image-cropper';
import { TranslateModule } from '@ngx-translate/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [AddServiceComponent, ServiceListComponent, UpdateServiceComponent, ViewServicesComponent, ConfirmationDialogComponent],
  imports: [TranslateModule , CommonModule,ServiceRoutingModule,NgxPaginationModule,ReactiveFormsModule ,FormsModule, MatProgressBarModule, ImageCropperModule,MatInputModule, MatButtonModule, MatCardModule, MatTableModule, MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule, MatNativeDateModule, MatSelectModule, MatDialogModule, MatDatepickerModule,MatAutocompleteModule,NgxSpinnerModule,NgxMaskModule.forRoot()],
  entryComponents:[ConfirmationDialogComponent],
})
export class ServiceModule { }
