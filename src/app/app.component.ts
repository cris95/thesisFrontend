import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';
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
    const o = this.isButtonClicked.asObservable();
    this.setButtonClicked('');
    return o;
  }

}
