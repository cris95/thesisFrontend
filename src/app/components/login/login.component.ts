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

  constructor(private appComponent: AppComponent, private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
  }

  login(user){
    this.dataService.login(user.username, user.password).subscribe(data => {
      if (data != null) {
        this.appComponent.user = data;
        this.router.navigate(['/dashboards']);
      }
    });
  }

}
