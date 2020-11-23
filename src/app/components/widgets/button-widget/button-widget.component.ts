import { Component, OnInit, Input } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-button-widget',
  templateUrl: './button-widget.component.html',
  styleUrls: ['./button-widget.component.css']
})
export class ButtonWidgetComponent implements OnInit {

  @Input() widget: any;
  buttonWidget: any;
  dataIsAvailable = false;

  constructor(public appComponent: AppComponent) { }

  ngOnInit(): void {
    this.getButtonWidget();
  }

  click() {
    this.appComponent.dataService.clickButtonWidget(this.buttonWidget.id).subscribe(data => {
      alert('success');
    });
  }

  getButtonWidget(){
    this.appComponent.dataService.getWidget(this.widget.template.id, this.widget.template.type).subscribe(data => {
      this.buttonWidget = data;
      this.dataIsAvailable = true;
    });
  }

}
