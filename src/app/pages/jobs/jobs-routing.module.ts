import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListJobComponent } from './list-job/list-job.component';
import { ViewJobComponent } from './view-job/view-job.component';
const routes: Routes = [
  {path:'view-job/:id',component:ViewJobComponent},
  {path:'jobs',component:ListJobComponent},
  {path:'list-jobs',component:ListJobComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
