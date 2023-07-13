import { Component, OnInit } from '@angular/core';
import { AutorizationService } from '../../services/autorization.service'
@Component({
  selector: 'app-autorization',
  templateUrl: './autorization.component.html',
  styleUrls: ['./autorization.component.css']
})
export class AutorizationComponent implements OnInit {

  email: string = "";
  password: string = "";
  status: string = "";
  public authservices: AutorizationService; 

  constructor(authservices: AutorizationService) {
    this.authservices = authservices;
    if (authservices.isAutorize)
    {
      this.status = 'Ви авторизовані';
    }
  }

  ngOnInit(): void {
    this.authservices.UserAutorize$.subscribe((str) => {
      this.status = str;
    });
    this.authservices.UserError$.subscribe((str) => {
      this.status = str;
    });
    this.authservices.UserLogout$.subscribe((str) => {
      this.status = str;
    });
  }
  Login() {
    this.authservices.Login(this.email, this.password);
  }
  Logout() {
    this.authservices.Logout();
  }
}
