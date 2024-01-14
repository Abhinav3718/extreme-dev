import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard2Component } from './dashboard2/dashboard2.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: Dashboard2Component
  },
  {
    path: '',
    component: Dashboard2Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
