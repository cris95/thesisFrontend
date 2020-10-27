import { Component, OnInit, Input } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { interval, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-alert-widget',
  templateUrl: './alert-widget.component.html',
  styleUrls: ['./alert-widget.component.css']
})
export class AlertWidgetComponent implements OnInit {

  @Input() widget: any;
  alertWidget: any;

  value: number;
  threshold: string;
  refreshTime: number;
  subscription: Subscription;

  constructor(public appComponent: AppComponent) { }

  ngOnInit(): void {
    this.appComponent.dataService.getAlertWidget(this.widget.template.id).subscribe(data => {
      console.log(data);
      this.alertWidget = data;
    });
    this.getTemperature(this.widget.template.id);
  }

  getTemperature(id: number) {

    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }

    this.appComponent.dataService.getTemperature(id).subscribe(data => {
      this.value = data.value;
      if (this.value <= data.low) {
        this.threshold = 'ok';
      }
      else if (this.value > data.low && this.value <= data.high) {
        this.threshold = 'warning';
      }
      else if (this.value > data.high) {
        this.threshold = 'danger';
      }
      this.subscription = interval(data.refreshTime).subscribe(() => {
        this.getTemperature(this.widget.template.id);
      });

    });
  }


}
