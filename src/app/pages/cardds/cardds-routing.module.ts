import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarddsPage } from './cardds.page';

const routes: Routes = [
  {
    path: '',
    component: CarddsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarddsPageRoutingModule {}
