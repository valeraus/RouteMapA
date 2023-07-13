import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { getBaseUrl } from "../main";
@Injectable()
export class AutorizationService {

  private UserAutorizeSource = new Subject<string>();
  public UserAutorize$ = this.UserAutorizeSource.asObservable();

  private UserAutorizeError = new Subject<string>();
  public UserError$ = this.UserAutorizeError.asObservable();

  private UserLogoutSource = new Subject<string>();
  public UserLogout$ = this.UserLogoutSource.asObservable();

  public isAutorize = false;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {

    const token = localStorage.getItem('token');
    if (token != null) {
      let params = { token: token }

      http.post<any>(this.baseUrl + 'Authorization/Update', params).subscribe((responce) => {
        this.UserAutorizeSource.next('Ви авторизовані');
        localStorage.setItem('token', responce);
        this.isAutorize = true;
      });
    }
  }

  public Login(email: string, password: string) {
    let params = {
      email: email,
      password: password
    }

    this.http.post<any>(this.baseUrl + 'authorization/login', params).subscribe((responce) => {
      this.UserAutorizeSource.next('Ви авторизовані');
      localStorage.setItem('token', responce);
      this.isAutorize = true;
      console.log(10);
    },

      (error) => {
        this.UserAutorizeError.next('Не вдалось авторазивутаись')
      })
  }
  public Logout() {
    this.UserLogoutSource.next('Виконаний вихід');
    localStorage.removeItem('token');
    this.isAutorize = false;
  }
}
