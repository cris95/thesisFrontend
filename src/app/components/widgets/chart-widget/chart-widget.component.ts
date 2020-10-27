import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as Plotly from 'plotly.js';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-chart-widget',
  templateUrl: './chart-widget.component.html',
  styleUrls: ['./chart-widget.component.css']
})
export class ChartWidgetComponent implements OnInit {

  @Input() widget: any;

  @ViewChild('chart', { static: true }) el: ElementRef;

  constructor(public appComponent: AppComponent) {
  }

  ngOnInit() {

    this.appComponent.dataService.getData(this.widget.template.id).subscribe(data => {
      console.log('Data ' + data);
      this.drawChart(data);
    });

  }

  drawChart(d: any) {

    const chart = this.el.nativeElement;

    const data = [];

    const valueOfData = { x: [], y: [], type: '' };

    d.values.forEach((el, i) => {
      valueOfData.x.push(i);
      valueOfData.y.push(el);
    });

    valueOfData.type = d.type;
    data.push(valueOfData);

    const layout = {
      width: 300,
      height: 300,
      margin: {
        l: 40,
        b: 90,
        r: 50,
        t: 50,
      }
    };

    Plotly.plot(chart, data, layout);
  }

}
