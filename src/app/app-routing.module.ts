import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardsComponent } from './components/dashboards/dashboards.component';
import { DashboardComponent } from './components/dashboards/dashboard/dashboard.component';
import { EditWidgetsComponent } from './components/edit-widgets/edit-widgets.component';
import { EditWidgetComponent } from './components/edit-widgets/edit-widget/edit-widget.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboards', component: DashboardsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'widgets', component: EditWidgetsComponent },
  { path: 'widget', component: EditWidgetComponent },
  { path: '', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [LoginComponent, DashboardComponent, DashboardsComponent, EditWidgetsComponent, EditWidgetComponent];

