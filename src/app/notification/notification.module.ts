import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationRoutingModule } from './notification-routing.module';
import { NotificationComponent } from './notification.component';
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    NgxPaginationModule,
    NotificationRoutingModule,
    NgxSpinnerModule,
    TranslateModule
  ]
})
export class NotificationModule { }
