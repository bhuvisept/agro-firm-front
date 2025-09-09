import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EcommerceRoutingModule } from './ecommerce-routing.module';
import { CategoryComponent } from './category/category.component';
import { MatInputModule, MatButtonModule, MatCardModule, MatTableModule, MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule, MatNativeDateModule, MatSelectModule, MatDialogModule, MatDatepickerModule, MatTabsModule } from '@angular/material';


@NgModule({
  declarations: [CategoryComponent],
  imports: [
    CommonModule,
    EcommerceRoutingModule,
    TranslateModule,
     MatInputModule,
    MatButtonModule, 
    MatCardModule, 
    MatInputModule, 
    MatTableModule,
    MatToolbarModule, 
    MatTabsModule,
    MatMenuModule, 
    MatDialogModule,
    MatIconModule, 
    MatProgressSpinnerModule, 
    MatFormFieldModule, 
    MatNativeDateModule, 
    MatSelectModule,
    MatDatepickerModule
  ]
})
export class EcommerceModule { }
