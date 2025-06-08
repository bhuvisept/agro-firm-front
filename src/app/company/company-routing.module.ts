import { M } from '@angular/cdk/keycodes'
import { Component, NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CompanyComponent } from './company.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component'
import { MyProfileComponent } from './pages/my-profile/my-profile.component'

import { SellerCompanyComponent } from './pages/seller-company/seller-company.component';
import { LeftUsersComponent } from './pages/left-users/left-users.component';
import { ActivityLogComponent } from './pages/activity-log/activity-log.component';
import { ViewPlanComponent } from '../company/pages/view-plan/view-plan.component'
import { NewsFeedComponent } from './pages/news-feed/news-feed.component'
import { CardComponent } from './pages/card/card.component'
import { InstallmentListComponent } from './pages/installmentList/installmentList.component'
import { MyTicketsComponent } from './pages/my-tickets/my-tickets.component'

const routes: Routes = [
  {
    path: '',
    component: CompanyComponent,
    children: [
      { path: '', redirectTo: 'dashboard',  pathMatch: 'full'},
      { path: 'my-plan',component : ViewPlanComponent },
      { path: 'dashboard', component: DashboardComponent},
      { path: 'left-users', component: LeftUsersComponent},      
      { path: 'activity-log', component: ActivityLogComponent},      
      { path: 'event-management', loadChildren: () => import('./pages/event-management/event-management.module').then((m) => m.EventManagementModule) },
      { path: 'jobs', loadChildren: () => import('./../company/pages/jobs/jobs.module').then((m) => m.JobsModule) },
      { path: 'my-profile', component: MyProfileComponent },
      { path: 'card', component: CardComponent },
      { path: 'installments', component: InstallmentListComponent },
      { path: 'edit-profile', component: EditProfileComponent },
      { path: 'manage-truck', loadChildren: () => import('./pages/manage-truck/manage-truck.module').then((m) => m.ManageTruckModule) },
      { path: 'team-manager', loadChildren: () => import('./pages/drivers/drivers.module').then((m) => m.DriversModule) },
      { path: 'manage-team', loadChildren: () => import('./pages/manage-team/manage-team.module').then((m) => m.ManageTeamModule) },
      { path : 'news-feed' , component : NewsFeedComponent },
      { path : 'my-tickets' , component : MyTicketsComponent },
      
    ],
  },
  { path: 'seller-to-company', component: SellerCompanyComponent },
  { path: 'trip-planner', loadChildren: () => import('./pages/trip-planner/trip-planner.module').then((m) => m.TripPlannerModule) },
  { path: 'service', loadChildren: () => import('./pages/service/service.module').then((m) => m.ServiceModule) },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
