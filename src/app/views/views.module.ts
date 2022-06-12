import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewsRoutingModule } from './views-routing.module';
import { RoundRobinProcessComponent } from './round-robin-process/round-robin-process.component';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './table/table.component';


@NgModule({
  declarations: [
    RoundRobinProcessComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    ViewsRoutingModule,
    FormsModule
  ]
})
export class ViewsModule { }
