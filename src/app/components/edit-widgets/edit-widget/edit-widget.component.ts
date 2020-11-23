import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-widget',
  templateUrl: './edit-widget.component.html',
  styleUrls: ['./edit-widget.component.css']
})
export class EditWidgetComponent implements OnInit {

  types = ['alert', 'button', 'chart', 'slider', 'switch'];

  widget: any;
  metadata: any;

  chartType: string;
  dataMode: string;

  dataIsAvailable = false;

  edit = false;

  constructor(public appComponent: AppComponent, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.getMetadata();

    this.widget = {};
    this.widget.template = { type: 'alert' };

    if (this.route.snapshot.paramMap.get('id') !== null) {
      this.edit = true;
      // tslint:disable-next-line: radix
      this.widget.id = parseInt(this.route.snapshot.paramMap.get('id'));
      this.widget.template.type = this.route.snapshot.paramMap.get('type');
      this.getWidget();
    }
  }

  getWidget() {
    this.appComponent.dataService.getWidget(this.widget.id, this.widget.template.type).subscribe(data => {
      this.widget = data;
      this.chartType = data.chartType;
      this.dataMode = data.dataMode;
      this.dataIsAvailable = true;
    });
  }

  getMetadata() {
    this.appComponent.dataService.getAllEditWidgetMetadata().subscribe(data => {
      const map = new Map<string, string[]>();
      data.forEach(element => {
        if (map.get(element.widgetType) === undefined) {
          map.set(element.widgetType, []);
        }
        map.get(element.widgetType).push(element.field);

      });
      this.metadata = map;
      this.dataIsAvailable = true;
    });
  }

  saveWidget() {
    console.log(this.widget);

    this.appComponent.dataService.saveWidget(this.widget).subscribe(data => {
      if (data) {
        alert('Widget saved');
        this.appComponent.navigateWidgets();
      } else {
        alert('Error, widget not saved');
      }
    });
  }

  deleteWidget() {
    this.appComponent.dataService.deleteWidget(this.widget.template.id).subscribe(data => {
      if (data) {
        alert('Widget deleted');
        this.appComponent.navigateWidgets();
      }
      else {
        alert('Error: Widget not deleted');
      }
    });
  }

}
