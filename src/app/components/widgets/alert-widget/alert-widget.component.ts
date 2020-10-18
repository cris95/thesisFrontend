import { Component, OnInit, Input } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-alert-widget',
  templateUrl: './alert-widget.component.html',
  styleUrls: ['./alert-widget.component.css']
})
export class AlertWidgetComponent implements OnInit {

  @Input() widget: any;

  value: number;

  constructor(public appComponent: AppComponent) { }

  ngOnInit(): void {
    this.getTemperature(this.widget.id);
  }

  getTemperature(id: number){
    this.appComponent.dataService.getTemperature(id).subscribe(data => {
      this.value = data;
    });
  }


}
