import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-edit-widgets',
  templateUrl: './edit-widgets.component.html',
  styleUrls: ['./edit-widgets.component.css'],
})
export class EditWidgetsComponent implements OnInit {

  constructor(public appComponent: AppComponent) {
    if (this.appComponent.user === undefined) {

      this.appComponent.dataService.login('admin', 'admin').subscribe(data => {
        this.appComponent.user = data;
        this.appComponent.router.navigate(['/dashboards']);
      });

      // this.appComponent.router.navigate(['/login']);
    }
  }

  types = ['alert', 'button', 'chart', 'slider', 'switch'];
  type: string;

  metadata: any;

  ngOnInit(): void {
    this.getMetadata();
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
    });
  }

}
