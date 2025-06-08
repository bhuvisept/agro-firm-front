import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { DriverComponent } from './driver.component'
import {PlannedTripComponent} from '../driver/pages/planned-trip/planned-trip.component'
import { DisplayRouteComponent } from '../driver/pages/display-route/display-route.component'
const routes: Routes = [
  {
    path: '',
    component: DriverComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
      { path: 'planned-trip', component: PlannedTripComponent },
      { path: 'display-route/:id', component: DisplayRouteComponent },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverRoutingModule {}
