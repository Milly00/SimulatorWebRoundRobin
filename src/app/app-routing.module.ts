import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'simulation', loadChildren: ()=>import("./views/views.module").then(m=> m.ViewsModule) },
  {path: '**',redirectTo: 'simulation/round-robin', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
