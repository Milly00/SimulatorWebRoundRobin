import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewsRoutingModule } from './views-routing.module';
import { RoundRobinProcessComponent } from './round-robin-process/round-robin-process.component';


@NgModule({
  declarations: [
    RoundRobinProcessComponent
  ],
  imports: [
    CommonModule,
    ViewsRoutingModule
  ]
})
export class ViewsModule { }
