import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoundRobinProcessComponent } from './round-robin-process/round-robin-process.component';

const routes: Routes = [{
  path: '', children:[
    {
      path: 'round-robin', component: RoundRobinProcessComponent
    },{
      path: '', redirectTo: 'round-robin',pathMatch: 'full'
    }
  ]
}];

@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewsRoutingModule { }
