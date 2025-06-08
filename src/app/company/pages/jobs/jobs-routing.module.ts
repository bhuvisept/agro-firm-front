import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ApplicantsListComponent } from './applicants-list/applicants-list.component'
import { CreateJobComponent } from './create-job/create-job.component'
import { EditJobComponent } from './edit-job/edit-job.component'
import { ListJobComponent } from './list-job/list-job.component'
import { ReopenJobComponent } from './reopen-job/reopen-job.component'
import { ViewJobComponent } from './view-job/view-job.component'
const routes: Routes = [
  { path: '', component: ListJobComponent, pathMatch: 'full' },
  { path: 'edit-job/:id', component: EditJobComponent },
  { path: 'reopen-job/:id', component: ReopenJobComponent },
  { path: 'job-details/:id', component: ViewJobComponent },
  { path: 'create-job', component: CreateJobComponent },
  { path: 'applicant-list/:id', component: ApplicantsListComponent },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobsRoutingModule {}
