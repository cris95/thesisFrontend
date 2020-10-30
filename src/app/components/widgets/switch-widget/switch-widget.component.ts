import { Component, OnInit, Input } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-switch-widget',
  templateUrl: './switch-widget.component.html',
  styleUrls: ['./switch-widget.component.css']
})
export class SwitchWidgetComponent implements OnInit {

  @Input() widget: any;
  switchWidget: any;
  isChecked = true;
  dataIsAvailable = false;

  constructor(public appComponent: AppComponent) { }

  ngOnInit(): void {
    this.appComponent.dataService.getSwitchWidget(this.widget.template.id).subscribe(data => {
      this.dataIsAvailable = true;
      this.switchWidget = data;
    });
  }

  switch() {
    this.appComponent.dataService.switch(this.widget.id, this.isChecked).subscribe(data => {
      this.isChecked = data;
    });
  }

}
