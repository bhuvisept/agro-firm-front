import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NotificationComponent} from '../../app/notification/notification.component'

const routes: Routes = [
  {
    path: '', component: NotificationComponent , 
    children :[
      { path: 'notification', component: NotificationComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
