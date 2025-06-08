import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEventComponent } from './create-event/create-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { ListEventComponent } from './list-event/list-event.component';
import { ReopenEventComponent } from './reopen-event/reopen-event.component';
import { ViewEventComponent } from './view-event/view-event.component';
const routes: Routes = [
  { path: '', component: ListEventComponent, pathMatch: 'full' },
  { path: 'view-event/:id', component: ViewEventComponent },
  { path: 'edit-event/:id', component: EditEventComponent },
  { path: 'reopen-event/:id', component: ReopenEventComponent },
  { path: 'create-event', component: CreateEventComponent },
  
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventManagementRoutingModule { }
