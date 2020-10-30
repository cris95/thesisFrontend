import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private appComponent: AppComponent) {
    if (this.appComponent.user !== undefined) {
      this.appComponent.router.navigate(['/dashboards']);
    }
  }

  ngOnInit(): void {
  }

  login(user) {
    this.appComponent.dataService.login(user.username, user.password).subscribe(data => {
      if (data != null) {
        this.appComponent.user = data;
        this.appComponent.router.navigate(['/dashboards']);
      }
    });
  }

}
