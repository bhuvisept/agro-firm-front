import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ConnectionsComponent } from './connections/connections.component'
import { CreateGroupComponent } from './create-group/create-group.component'
import { ListGroupComponent } from './list-group/list-group.component'
import { MyNetworkComponent } from './my-network/my-network.component'
import { GroupViewComponent } from './group-view/group-view.component'
import { EditGroupComponent } from './edit-group/edit-group.component'
import { ManageGroupComponent } from './manage-group/manage-group.component'
import { TeamListComponent } from './team-management/team-list/team-list.component'
import { AddTeamMemberComponent } from './team-management/add-team-member/add-team-member.component'
import { ProfileConnectionViewComponent } from './profile-connection-view/profile-connection-view.component'
import { MyConnectionsComponent } from './my-connections/my-connections.component'
import { DeletNetworkComponent } from './team-management/delet-network/delet-network.component'

const routes: Routes = [
  { path: '', component: MyNetworkComponent, pathMatch: 'full' },
  { path: 'connections', component: ConnectionsComponent },
  { path: 'group-list', component: ListGroupComponent },
  { path: 'team-member-list', component: TeamListComponent },
  { path: 'add-team-member', component: AddTeamMemberComponent },
  { path: 'create-group', component: CreateGroupComponent },
  { path: 'group-view/:Id', component: GroupViewComponent },
  { path: 'edit-group/:Id', component: EditGroupComponent },
  { path: 'manage-group', component: ManageGroupComponent },
  { path: 'connection-profileview/:Id', component: ProfileConnectionViewComponent },
  { path: 'my-connections', component: MyConnectionsComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  entryComponents: [DeletNetworkComponent],
})
export class SocialMediaRoutingModule {}
