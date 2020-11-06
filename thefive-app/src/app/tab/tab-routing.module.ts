import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabPage } from './tab.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/user/user-feed',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabPage,
    children:[
      {
        path: 'edit-profile',
        children: [
          {
            path: '',
            loadChildren: () => import('./user/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
          }
        ]  
      },
      {
        path: 'user-feed',
        children: [
          {
            path: '',
            loadChildren: () => import('./user/user-feed/user-feed.module').then( m => m.UserFeedPageModule)
          }
        ]  
      },
      {
        path: 'upload',
        children: [
          {
            path: '',
            loadChildren: () => import('./user/upload/upload.module').then( m => m.UploadPageModule)
          }
        ]  
      },
    ]
  },
  {
    path: 'comment',
    children: [
      {
        path: '',
        loadChildren: () => import('./user/comment/comment.module').then( m => m.CommentPageModule)
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPageRoutingModule {}
