import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TruckListComponent } from './truck-list/truck-list.component';
import { ViewTruckComponent } from './view-truck/view-truck.component';
import { EditTruckComponent } from './edit-truck/edit-truck.component';
import { AddTruckComponent } from './add-truck/add-truck.component';
import { EditTrailerComponent } from './edit-trailer/edit-trailer.component';


const routes: Routes = [
  { path :'' ,component:TruckListComponent, pathMatch: 'full'},
  { path : 'add-truck',component:AddTruckComponent},
  { path : 'edit-truck/:id',component:EditTruckComponent},  
  { path : 'view-truck/:id',component:ViewTruckComponent},
  { path : 'edit-trailer/:id',component:EditTrailerComponent}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageTruckRoutingModule { }
