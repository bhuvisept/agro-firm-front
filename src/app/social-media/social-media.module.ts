import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SocialMediaRoutingModule } from './social-media-routing.module'
import { MyNetworkComponent } from './my-network/my-network.component'
import { CreateGroupComponent } from './create-group/create-group.component'
import { ListGroupComponent } from './list-group/list-group.component'
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
  MatProgressBarModule,
} from '@angular/material'
import { OrderModule } from 'ngx-order-pipe'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { ToastrModule } from 'ngx-toastr'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker'
import { NgxMaskModule } from 'ngx-mask'
import { UiSwitchModule } from 'ngx-toggle-switch'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ConnectionsComponent } from './connections/connections.component'
import { GroupViewComponent } from './group-view/group-view.component'
import { EditGroupComponent } from './edit-group/edit-group.component'
import { ManageGroupComponent } from './manage-group/manage-group.component'
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component'
import { DeleteGroupConfirmationDialogComponent } from './delete-group-confirmation-dialog/delete-group-confirmation-dialog.component'
import { AddTeamMemberComponent } from './team-management/add-team-member/add-team-member.component'
import { TeamListComponent } from './team-management/team-list/team-list.component'
import { ProfileConnectionViewComponent } from './profile-connection-view/profile-connection-view.component'
import { MyConnectionsComponent } from './my-connections/my-connections.component'
import { DeleteConnectionConfirmationDialogComponent } from './delete-connection-confirmation-dialog/delete-connection-confirmation-dialog.component';
import { DeletNetworkComponent } from './team-management/delet-network/delet-network.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AssignGroupComponent } from './assign-group/assign-group.component';
import {MatRadioModule} from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [
    MyNetworkComponent,
    CreateGroupComponent,
    ConfirmationDialogComponent,
    ListGroupComponent,
    ConnectionsComponent,
    GroupViewComponent,
    EditGroupComponent,
    ManageGroupComponent,
    DeleteGroupConfirmationDialogComponent,
    AddTeamMemberComponent,
    TeamListComponent,
    ProfileConnectionViewComponent,
    MyConnectionsComponent,
    DeleteConnectionConfirmationDialogComponent,
    DeletNetworkComponent,
    AssignGroupComponent,
  ],
  imports: [
    CommonModule,
    SocialMediaRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
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
    CKEditorModule,
    NgxMaterialTimepickerModule,
    NgxMaskModule.forRoot(),
    UiSwitchModule,
    MatRadioModule,
    InfiniteScrollModule,
    TranslateModule,
    MatProgressBarModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ConfirmationDialogComponent, DeleteGroupConfirmationDialogComponent,AssignGroupComponent,DeleteConnectionConfirmationDialogComponent],
})
export class SocialMediaModule {}
