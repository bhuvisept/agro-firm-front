import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DriversComponent} from './drivers/drivers.component'

const routes: Routes = [
  { path : '',component:DriversComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriversRoutingModule { }
