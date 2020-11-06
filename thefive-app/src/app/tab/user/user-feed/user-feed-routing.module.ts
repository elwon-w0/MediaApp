import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserFeedPage } from './user-feed.page';

const routes: Routes = [
  {
    path: '',
    component: UserFeedPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserFeedPageRoutingModule {}
