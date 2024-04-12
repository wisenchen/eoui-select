import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { E2EEouiSelectComponent } from './test/e2e.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'index',
    component: HomeComponent,
  },
  {
    path: 'e2e',
    component: E2EEouiSelectComponent,
  },
  {
    path: '**',
    redirectTo: 'index',
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes, { scrollOffset: [0, 0] })],
  exports: [RouterModule],
})
export class AppRouterModule {}
