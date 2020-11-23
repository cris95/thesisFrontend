import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './services/data.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PushService } from './services/push.service';
import { WebSocketService } from './services/web-socket.service';
// import { PushService } from './push.service';

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

  constructor(public router: Router, public dataService: DataService,
              public pushService: PushService, public webSocketService: WebSocketService) {
    this.isButtonClicked = new BehaviorSubject<string>('');
  }

  ngOnInit(): void {
    // this.pushService.requestPermission();
    // this.pushService.receiveMessage();
    // this.message = this.pushService.currentMessage;
  }

  setButtonClicked(button: string) {
    this.isButtonClicked.next(button);
  }

  buttonClicked(): Observable<any> {
    const o = this.isButtonClicked.asObservable();
    this.setButtonClicked('');
    return o;
  }

  navigateDashboards(){
    this.router.navigate(['/dashboards']);
  }

  navigateWidgets(){
    this.router.navigate(['/widgets']);
  }

}
