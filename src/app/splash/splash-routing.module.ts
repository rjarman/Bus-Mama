import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplashPage } from './splash.page';

const routes: Routes = [
  {
    path: '',
    component: SplashPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplashPageRoutingModule {}
