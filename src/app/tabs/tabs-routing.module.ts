import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'list',
        loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('./chat/chat.module').then(m => m.ChatPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/map',
        pathMatch: 'full'
      },
      {
        path: 'map',
        children: [
          {
            path: '',
            loadChildren: () => import('./map/map.module').then(m => m.MapPageModule)
          },
          {
            path: ':busId',
            loadChildren: () => import('./map/map.module').then(m => m.MapPageModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
