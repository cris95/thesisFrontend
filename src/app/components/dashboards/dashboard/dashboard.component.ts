import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridType, CompactType, DisplayGrid, GridsterConfig } from 'angular-gridster2';
import { AppComponent } from 'src/app/app.component';
import { Subscription, interval, BehaviorSubject, Observable } from 'rxjs';
import { LoginComponent } from '../../login/login.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  options: GridsterConfig;
  dashboard: any;
  dashboardName: string;
  templates: Map<string, any[]>;

  alertWidgets: any[];
  chartWidgets: any[];
  elapsed: Map<any, number>;
  dataSubscription: Subscription;
  retrievedData: BehaviorSubject<any>;

  subscription: Subscription;

  dataIsAvailable = false;

  constructor(public appComponent: AppComponent, private route: ActivatedRoute) {
    if (this.appComponent.user === undefined) {

      this.appComponent.dataService.login('admin', 'admin').subscribe(data => {
        this.appComponent.user = data;
        this.appComponent.router.navigate(['/dashboards']);
      });

      // this.appComponent.router.navigate(['/login']);
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

    if (this.subscription === undefined) {
      this.subscription = this.appComponent.buttonClicked().subscribe((value) => {
        if (value === 'editDashboard') {
          this.setEditable(true);
        }
        else if (value === 'deleteDashboard') {
          this.deleteDashboard(this.dashboard);
        }
      });
    }

    this.getDashboard();

    this.getAllWidgetTemplates();

  }

  getDashboard() {
    const id = this.route.snapshot.paramMap.get('id');
    this.appComponent.dataService.getDashboard(id).subscribe(data => {
      this.dashboard = data;
      this.dashboardName = this.dashboard.name;
      this.appComponent.title = this.dashboard.name;
      this.dataIsAvailable = true;

      const ids = [];
      this.dashboard.widgets.forEach(w => {
        if (w.template.type === 'alert' || w.template.type === 'chart') {
          ids.push(w.template.id);
        }
      });
      this.elapsed = new Map();
      this.appComponent.dataService.getWidgets(ids).subscribe(widgets => {
        widgets.forEach(w => {
          this.elapsed.set(w, w.refreshTime);
        });
        this.getWidgetsData();
      });
    });
  }

  getAllWidgetTemplates() {
    this.appComponent.dataService.getAllWidgetTemplates().subscribe(data => {
      this.templates = new Map();
      data.forEach(template => {
        if (this.templates.get(template.type) === undefined) {
          this.templates.set(template.type, []);
        }
        this.templates.get(template.type).push(template);
      });
      this.dataIsAvailable = true;
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
      this.ngOnInit();
    });
  }

  getWidgetsData() {
    if (this.dataSubscription !== undefined) {
      this.dataSubscription.unsubscribe();
    }

    const templatesId = [];

    this.elapsed.forEach((time, w) => {
      if (time === w.refreshTime) {
        templatesId.push(w.template.id);
        this.elapsed.set(w, 0);
      } else {
        this.elapsed.set(w, time + 1000);
      }
    });

    if (templatesId.length > 0) {
      this.appComponent.dataService.getWidgetsData(templatesId).subscribe(data => {
        this.retrievedData.next(data);
      });
    }

    this.dataSubscription = interval(1000).subscribe(() => {
      this.getWidgetsData();
    });
  }

  isDataRetrieved(): Observable<any> {
    return this.retrievedData.asObservable();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }

}
