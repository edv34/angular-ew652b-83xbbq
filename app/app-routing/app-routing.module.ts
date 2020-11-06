import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { TableOverviewExample } from '../table-overview/table-overview-example';
import { TableSave } from '../table-save/table-save';

const routes: Routes = [
  { path: 'filter', component: TableOverviewExample },
  { path: 'edit1', component: TableSave,
    data: {
      reuse: true
    } 
  },
  { path: 'edit2', component: TableSave,
    data: {
      reuse: true
    } 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }