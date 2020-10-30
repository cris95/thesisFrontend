import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridType, CompactType, DisplayGrid, GridsterConfig } from 'angular-gridster2';
import { AppComponent } from 'src/app/app.component';
import { Subscription, interval, BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  options: GridsterConfig;
  dashboard: any;
  dashboardName: string;
  widgetTemplates: any[];

  alertWidgets: any[];
  chartWidgets: any[];
  alertsElapsed: Map<any, number>;
  chartsElapsed: Map<any, number>;
  chartsSubscription: Subscription;
  alertsSubscription: Subscription;
  retrievedData: BehaviorSubject<any>;

  subscription: Subscription;

  dataIsAvailable = false;

  constructor(public appComponent: AppComponent, private route: ActivatedRoute) {
    if (this.appComponent.user === undefined) {
      this.appComponent.router.navigate(['/login']);
    }
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
      fixedColWidth: 50,
      fixedRowHeight: 200,
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
      displayGrid: DisplayGrid.OnDragAndResize,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false
    };
    this.appComponent.readOnly = true;
    this.appComponent.moreIconVisible = false;
    this.appComponent.editIconVisible = true;

    this.retrievedData = new BehaviorSubject<any>('');
  }

  ngOnInit(): void {

    this.subscription = this.appComponent.buttonClicked().subscribe((value) => {
      if (value === 'editDashboard') {
        this.setEditable(true);
      }
      else if (value === 'deleteDashboard') {
        this.deleteDashboard(this.dashboard);
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.appComponent.dataService.getDashboard(id).subscribe(data => {
      this.dashboard = data;
      this.dashboardName = this.dashboard.name;
      this.appComponent.title = this.dashboard.name;
      this.dataIsAvailable = true;

      const alertsId = [];
      const chartsId = [];

      this.dashboard.widgets.forEach(w => {
        if (w.template.type === 'alert') {
          alertsId.push(w.template.id);
        }
        else if (w.template.type === 'chart') {
          chartsId.push(w.template.id);
        }
      });

      this.appComponent.dataService.getChartWidgets(chartsId).subscribe(charts => {
        this.chartsElapsed = new Map();
        charts.forEach(c => {
          this.chartsElapsed.set(c, c.refreshTime);
        });
      });

      this.appComponent.dataService.getAlertWidgets(alertsId).subscribe(alerts => {
        this.alertsElapsed = new Map();
        alerts.forEach(a => {
          this.alertsElapsed.set(a, a.refreshTime);
        });
        this.getData();
      });
    });

    this.appComponent.dataService.getAllWidgetTemplates().subscribe(data => {
      this.widgetTemplates = data;
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

  deleteWidget(e: MouseEvent, widget: any) {
    e.preventDefault();
    e.stopPropagation();
    this.dashboard.widgets.splice(this.dashboard.widgets.indexOf(widget), 1);
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

  getData() {
    if (this.chartsSubscription !== undefined) {
      this.chartsSubscription.unsubscribe();
    }

    const chartsId = [];
    this.chartsElapsed.forEach((time, chart) => {
      if (time === chart.refreshTime) {
        chartsId.push(chart.id);
        this.chartsElapsed.set(chart, 0);
      } else {
        this.chartsElapsed.set(chart, time + 1000);
      }
    });

    const alertsId = [];
    this.alertsElapsed.forEach((time, alert) => {
      if (time === alert.refreshTime) {
        alertsId.push(alert.id);
        this.alertsElapsed.set(alert, 0);
      } else {
        this.alertsElapsed.set(alert, time + 1000);
      }
    });

    if (chartsId.length > 0) {
      this.appComponent.dataService.getChartsData(chartsId).subscribe(data => {
        this.retrievedData.next(data);
      });
    }

    if (alertsId.length > 0) {
      this.appComponent.dataService.getAlertsData(alertsId).subscribe(data => {
        this.retrievedData.next(data);
      });
    }

    this.chartsSubscription = interval(1000).subscribe(() => {
      this.getData();
    });
  }

  isDataRetrieved(): Observable<any> {
    return this.retrievedData.asObservable();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
