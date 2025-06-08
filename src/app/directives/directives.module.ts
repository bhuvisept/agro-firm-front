import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadMoreLessDirective } from './readMoreLess.directive';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ReadMoreLessDirective],
  exports: [ReadMoreLessDirective]

})
export class DirectivesModule { }
