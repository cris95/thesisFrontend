import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.css']
})
export class DashboardsComponent implements OnInit {
  displayedDashboards = ['Name'];
  dashboardsDataSource = new MatTableDataSource<any>();
  subscription: Subscription;

  constructor(public appComponent: AppComponent) {
    if (this.appComponent.user === undefined) {

      this.appComponent.dataService.login('admin', 'admin').subscribe(data => {
        this.appComponent.user = data;
        this.appComponent.router.navigate(['/dashboards']);
      });

      // this.appComponent.router.navigate(['/login']);
    }
    this.appComponent.title = this.appComponent.user.username + ' dashboards';
    this.appComponent.widgetsIconVisible = false;
    this.appComponent.editIconVisible = false;
    this.appComponent.moreIconVisible = true;
  }

  ngOnInit() {
    this.getUserDashboards(this.appComponent.user.id);

    this.subscription = this.appComponent.buttonClicked().subscribe(value => {
      if (value === 'createDashboard') {
        this.createDashboard();
      }
    });
  }

  openDashboard(dashboard: any) {
    this.appComponent.router.navigate(['/dashboard', { id: dashboard.id }]);
  }

  getUserDashboards(userId: number) {
    this.appComponent.dataService.getUserDashboards(userId).subscribe(data => {
      this.dashboardsDataSource = new MatTableDataSource(data);
    });
  }

  createDashboard() {
    this.appComponent.dataService.createDashboard(this.appComponent.user.id).subscribe(data => {
      this.dashboardsDataSource = new MatTableDataSource(data);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
