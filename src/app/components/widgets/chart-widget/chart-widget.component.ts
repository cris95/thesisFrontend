import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as Plotly from 'plotly.js';
import { AppComponent } from 'src/app/app.component';
import { Subscription, interval } from 'rxjs';
import { DashboardComponent } from '../../dashboards/dashboard/dashboard.component';

@Component({
  selector: 'app-chart-widget',
  templateUrl: './chart-widget.component.html',
  styleUrls: ['./chart-widget.component.css', '../../dashboards/dashboard/dashboard.component.css']
})
export class ChartWidgetComponent implements OnInit {

  @Input() widget: any;
  chartWidget: any;
  dataIsAvailable = false;
  subscription: Subscription;

  @ViewChild('chart', { static: true }) el: ElementRef;

  constructor(public appComponent: AppComponent, public dashboardComponent: DashboardComponent) {
  }

  ngOnInit() {
    this.getChartWidget();
  }

  drawChart(d: any) {

    const chart = this.el.nativeElement;

    const data = [];

    const valueOfData = { x: [], y: [], type: '' };

    d.forEach((el, i) => {
      valueOfData.x.push(i);
      valueOfData.y.push(el);
    });

    valueOfData.type = this.chartWidget.type;
    data.push(valueOfData);

    const layout = {
      width: 270,
      height: 270,
      margin: {
        l: 40,
        b: 90,
        r: 50,
        t: 50,
      }
    };

    window.Plotly.newPlot(chart, data, layout);
  }

  getChartWidget() {
    this.appComponent.dataService.getChartWidget(this.widget.template.id).subscribe(chart => {
      this.chartWidget = chart;
      this.dataIsAvailable = true;

      this.dashboardComponent.isDataRetrieved().subscribe(data => {
        const map = new Map(Object.entries(data));
        const chartData = map.get(this.chartWidget.template.id.toString());
        if (chartData !== undefined) {
          this.drawChart(chartData);
        }
      });
    });
  }
}
