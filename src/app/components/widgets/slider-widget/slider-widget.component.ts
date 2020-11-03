import { Component, OnInit, Input } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-slider-widget',
  templateUrl: './slider-widget.component.html',
  styleUrls: ['./slider-widget.component.css']
})
export class SliderWidgetComponent implements OnInit {

  @Input() widget: any;
  sliderWidget: any;
  dataIsAvailable = false;

  constructor(public appComponent: AppComponent) { }

  ngOnInit(): void {
    this.getSliderWidget();
  }

  getSliderWidget() {
    this.appComponent.dataService.getSliderWidget(this.widget.template.id).subscribe(data => {
      this.sliderWidget = data;
      this.dataIsAvailable = true;
    });
  }

  change(e: MatSliderChange) {
    this.appComponent.dataService.changeSliderValue(this.sliderWidget.id, e.value).subscribe(data => {
      this.sliderWidget.value = data;
    });
  }

}
