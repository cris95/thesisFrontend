import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid } from 'angular-gridster2';
import { AppComponent } from 'src/app/app.component';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.css']
})
export class DashboardsComponent implements OnInit {
  displayedDashboards = ['Name'];
  dashboardsDataSource = new MatTableDataSource<any>();

  constructor(public appComponent: AppComponent) {
    if (this.appComponent.user === undefined) {
      this.appComponent.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.appComponent.title = this.appComponent.user.username + ' dashboards';
    this.appComponent.widgetsIconVisible = false;
    this.appComponent.editIconVisible = false;
    this.appComponent.moreIconVisible = true;
    this.getUserDashboards(this.appComponent.user.id);

    this.appComponent.buttonClicked().subscribe((value) => {
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

}
