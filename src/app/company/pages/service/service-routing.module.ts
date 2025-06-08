import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AddServiceComponent } from './add-service/add-service.component'
import { ServiceListComponent } from './service-list/service-list.component'
import { UpdateServiceComponent } from './update-service/update-service.component'
import { ViewServicesComponent } from './view-services/view-services.component'
const routes: Routes = [
  {path: '',component: ServiceListComponent,pathMatch: 'full'},
  {path: 'Add-service',component: AddServiceComponent,},
  {path: 'view-service/:Id',component: ViewServicesComponent,},
  {path: 'updateservice/:Id',component: UpdateServiceComponent,},
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceRoutingModule {}
