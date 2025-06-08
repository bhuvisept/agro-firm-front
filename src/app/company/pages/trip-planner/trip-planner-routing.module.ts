import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AddStopageComponent } from './add-stopage/add-stopage.component'
import { AddTripComponent } from './add-trip/add-trip.component'
import { TripPlannerComponent } from './trip-planner/trip-planner.component'
import { TripDetailsComponent } from './trip-details/trip-details.component'
import { LiveTrackComponent } from './live-track/live-track.component'
import { ViewMapComponent } from './view-map/view-map.component'
import { EditDriverComponent } from './edit-driver/edit-driver.component'
import { AddDriverComponent } from './add-driver/add-driver.component'


const routes: Routes = [
  { path: '', component: TripPlannerComponent, pathMatch: 'full' },
  { path: 'add-trip', component: AddTripComponent },
  { path: 'add-stopage/:id', component: AddStopageComponent },
  { path: 'trip-details/:id', component: TripDetailsComponent },
  { path: 'live-track/:id', component: LiveTrackComponent },
  { path: 'view-map', component: ViewMapComponent },
  { path: 'edit-driver/:id', component: EditDriverComponent },
  { path: 'add-driver/:id', component: AddDriverComponent },
  
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TripPlannerRoutingModule {}
