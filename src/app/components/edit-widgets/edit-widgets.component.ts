import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-edit-widgets',
  templateUrl: './edit-widgets.component.html',
  styleUrls: ['./edit-widgets.component.css'],
})
export class EditWidgetsComponent implements OnInit {

  widget: any;

  displayedWidgets = ['Description', 'Type'];
  widgetTemplatesDataSource = new MatTableDataSource<any>();

  constructor(public appComponent: AppComponent) {
    if (this.appComponent.user === undefined) {
      this.appComponent.dataService.login('admin', 'admin').subscribe(data => {
        this.appComponent.user = data;
        this.appComponent.router.navigate(['/dashboards']);
      });
      // this.appComponent.router.navigate(['/login']);
    }
    this.appComponent.moreIconVisible = false;
    this.appComponent.editIconVisible = false;
    this.appComponent.title = 'Edit widgets';
  }

  ngOnInit(): void {
    this.getWidgetTemplates();
  }

  getWidgetTemplates() {
    this.appComponent.dataService.getAllWidgetTemplates().subscribe(data => {
      this.widgetTemplatesDataSource = new MatTableDataSource(data);
    });
  }

  openWidget(widget: any){
    this.appComponent.router.navigate(['/widget', { id: widget.id, type: widget.type }]);
  }

  createWidget(){
    this.appComponent.router.navigate(['/widget']);
  }

}
