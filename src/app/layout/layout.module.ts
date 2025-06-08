import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'

import { LayoutRoutingModule } from './layout-routing.module'
import { LayoutComponent } from './layout.component'
import { HeaderComponent } from './component/header/header.component'
import { SidemenuComponent } from './component/sidemenu/sidemenu.component'
import { MyEventsComponent } from './component/my-events/my-events.component'
import { SharedService } from '../service/shared.service'
import { MatTabsModule } from '@angular/material/tabs'
import { NgxPaginationModule } from 'ngx-pagination'
import { MyJobsComponent } from './component/my-jobs/my-jobs.component'
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MyWishlistComponent } from './component/my-wishlist/my-wishlist.component';
import { NgxSpinnerModule,NgxSpinnerService } from 'ngx-spinner';
import { ReactiveFormsModule ,FormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { TranslateModule } from '@ngx-translate/core';
import { GpsComponent } from './component/gps/gps.component';
import { MatInputModule, MatButtonModule, MatCardModule, MatTableModule, MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule, MatNativeDateModule, MatSelectModule, MatDialogModule, MatDatepickerModule, MatCheckboxModule } from '@angular/material';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMaskModule } from 'ngx-mask'
import { MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
  declarations: [LayoutComponent, HeaderComponent, SidemenuComponent, MyEventsComponent, MyJobsComponent, MyWishlistComponent, GpsComponent],
  imports: [CommonModule,UiSwitchModule,NgxSpinnerModule, NgxPaginationModule, MatTabsModule, LayoutRoutingModule, MatProgressBarModule , ReactiveFormsModule ,
    NgxMatDatetimePickerModule , NgxMaskModule.forRoot(),MatTooltipModule,
    MatCheckboxModule , NgxMatTimepickerModule , FormsModule,TranslateModule , MatInputModule ,MatButtonModule, MatCardModule, MatTableModule, MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule, MatNativeDateModule, MatSelectModule, MatDialogModule, MatDatepickerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [SharedService,NgxSpinnerService],
  exports : [HeaderComponent]
})
export class LayoutModule {}
