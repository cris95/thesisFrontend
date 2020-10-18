import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridType, CompactType, DisplayGrid, GridsterConfig } from 'angular-gridster2';
import { DataService } from 'src/app/data.service';
import { AppComponent } from 'src/app/app.component';
import { isUndefined } from 'util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  options: GridsterConfig;
  dashboard: any;
  dashboardName: string;
  widgets: any[];

  constructor(public appComponent: AppComponent, private route: ActivatedRoute) {
    if (this.appComponent.user === undefined) {
      this.appComponent.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.ScrollVertical,
      compactType: CompactType.None,
      margin: 25,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      minCols: 15,
      maxCols: 15,
      minRows: 1,
      maxRows: 15,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 15,
      fixedRowHeight: 15,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: false,
      },
      resizable: {
        enabled: false,
      },
      swap: true,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: false,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false
    };

    this.appComponent.readOnly = true;
    this.appComponent.moreIconVisible = false;
    this.appComponent.editIconVisible = true;
    const id = this.route.snapshot.paramMap.get('id');

    this.appComponent.buttonClicked().subscribe((value) => {
      if (value === 'editDashboard') {
        this.setEditable(true);
      }
      else if (value === 'deleteDashboard'){
        this.deleteDashboard(this.dashboard);
      }
    });

    this.appComponent.dataService.getDashboard(id).subscribe(data => {
      this.dashboard = data;
      this.dashboardName = this.dashboard.name;
      this.appComponent.title = this.dashboard.name;
    });

    this.appComponent.dataService.getAllWidgets().subscribe(data => {
      this.widgets = data;
    });

  }

  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  setEditable(b: boolean) {
    this.appComponent.readOnly = !b;
    this.appComponent.widgetsIconVisible = b;
    this.options.draggable.enabled = b;
    this.changedOptions();
  }

  addWidget(template: any) {
    this.dashboard.widgets.push({ x: 0, y: 0, rows: template.rows, cols: template.cols, template });
  }

  deleteDashboard(dashboard: any) {
    this.appComponent.dataService.deleteDashboard(dashboard.id).subscribe(data => {
      this.setEditable(false);
      this.appComponent.router.navigate(['/dashboards']);
    });
  }

  saveDashboard(dashboard: any) {
    this.dashboard.name = this.dashboardName;
    this.appComponent.dataService.saveDashboard(dashboard).subscribe(data => {
      this.setEditable(false);
      this.appComponent.dataService.getDashboard(dashboard.id).subscribe(d => {
        this.dashboard = d;
        this.dashboardName = this.dashboard.name;
        this.appComponent.title = this.dashboard.name;
      });
    });
  }

}
