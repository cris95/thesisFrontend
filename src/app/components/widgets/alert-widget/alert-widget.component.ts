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

  stompClient: any;

  constructor(public appComponent: AppComponent, public dashboardComponent: DashboardComponent) {
  }

  ngOnInit(): void {

    this.getAlertWidget();

    // this.appComponent.pushService.receiveMessage();

    // this.appComponent.pushService.messageReceived().subscribe(payload => {
    //   if (payload !== null) {
    //     this.value = payload.data.value;
    //     this.threshold = 'critical';
    //   }
    // });
  }

  connect() {
    this.stompClient = this.appComponent.webSocketService.connect();

    this.stompClient.connect({}, frame => {

      this.stompClient.subscribe('/message', message => {
        const map = new Map(Object.entries(JSON.parse(message.body)));
        const alertData = map.get(this.alertWidget.template.id.toString());
        if (alertData !== undefined) {
          this.setValue(alertData);
        }
      });
    });
  }

  disconnect() {
    if (this.stompClient !== undefined) {
      this.stompClient.disconnect();
    }
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

  getAlertWidget() {
    this.appComponent.dataService.getWidget(this.widget.template.id, this.widget.template.type).subscribe(alert => {
      this.alertWidget = alert;
      console.log(this.alertWidget);
      this.dataIsAvailable = true;

      if (this.alertWidget.refreshTime === 0) {
        this.setValue(10);
        this.connect();
      } else {
        this.dashboardComponent.isDataRetrieved().subscribe(data => {
          const map = new Map(Object.entries(data));
          const alertData = map.get(this.alertWidget.template.id.toString());
          if (alertData !== undefined) {
            this.setValue(alertData);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

}
