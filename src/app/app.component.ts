import { Component, ViewChild } from '@angular/core';
import { GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid } from 'angular-gridster2';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { DashboardsComponent } from './components/dashboards/dashboards.component';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string;
  user: any;
  moreIconVisible: boolean;
  editIconVisible: boolean;
  widgetsIconVisible: boolean;
  readOnly = true;

  private isButtonClicked: BehaviorSubject<string>;

  constructor(public router: Router, public dataService: DataService) {
    this.isButtonClicked = new BehaviorSubject<string>('');
  }

  ngOnInit(): void {

  }

  setButtonClicked(button: string){
    this.isButtonClicked.next(button);
  }

  buttonClicked(): Observable<any>{
    return this.isButtonClicked.asObservable();
  }

}
