import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewsRoutingModule } from './views-routing.module';
import { RoundRobinProcessComponent } from './round-robin-process/round-robin-process.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    RoundRobinProcessComponent
  ],
  imports: [
    CommonModule,
    ViewsRoutingModule, MatSelectModule, ReactiveFormsModule, FormsModule, MatInputModule,
    MatTabsModule, MatDialogModule, MatSnackBarModule
  ]
})
export class ViewsModule { }
