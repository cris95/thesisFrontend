import { Component, OnInit, Input } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Subscription } from 'rxjs';
import { DashboardComponent } from '../../dashboards/dashboard/dashboard.component';

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
  dataIsAvailable = false;

  constructor(public appComponent: AppComponent, public dashboardComponent: DashboardComponent) {

    this.connect();

  }

  ngOnInit(): void {
    this.appComponent.dataService.getAlertWidget(this.widget.template.id).subscribe(alert => {
      this.alertWidget = alert;
      this.dashboardComponent.isDataRetrieved().subscribe(data => {
        const map = new Map(Object.entries(data));
        const alertData = map.get(this.alertWidget.template.id.toString());
        if (alertData !== undefined) {
          this.setValue(alertData);
        }
      });
    });

    this.appComponent.pushService.receiveMessage();

    this.appComponent.pushService.messageReceived().subscribe(payload => {
      if (payload !== null) {
        this.value = payload.data.value;
        this.threshold = 'critical';
      }
    });
  }

  connect() {
    const stompClient = this.appComponent.webSocketService.connect();

    stompClient.connect({}, frame => {

      stompClient.subscribe('/message', message => {
        const map = new Map(Object.entries(JSON.parse(message.body)));
        const alertData = map.get(this.alertWidget.template.id.toString());
        if (alertData !== undefined) {
          this.setValue(alertData);
        }
      });
    });
  }

  setValue(value: number) {
    this.value = value;
    this.dataIsAvailable = true;
    if (this.value <= this.alertWidget.low) {
      this.threshold = 'ok';
    }
    else if (this.value > this.alertWidget.low && this.value <= this.alertWidget.high) {
      this.threshold = 'warning';
    }
    else if (this.value > this.alertWidget.high) {
      this.threshold = 'critical';
    }
  }

}
