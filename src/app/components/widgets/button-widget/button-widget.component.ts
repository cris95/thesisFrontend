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

  isChecked = true;

  constructor(public appComponent: AppComponent) { }

  ngOnInit(): void {
    this.appComponent.dataService.getButtonWidget(this.widget.template.id).subscribe(data => {
      this.buttonWidget = data;
    });
  }

  switch() {
    this.appComponent.dataService.switch(this.widget.id, this.isChecked).subscribe(data => {
      this.isChecked = data;
    });
  }

}
