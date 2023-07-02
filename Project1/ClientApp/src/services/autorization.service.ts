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

    const Token = localStorage.getItem('token');
    if (Token != null) {
      let params = new HttpParams()
        .append("token", Token);

      http.get<string>(baseUrl + 'test/autorize', { params }).subscribe((responce) => {
        this.UserAutorizeSource.next('Ви авторизовані');
        localStorage.setItem('token', responce);
        this.isAutorize = true;
      });
    }
  }

  public Login(login: string, pass: string) {
    let params = new HttpParams()
      .append("login", login)
      .append("pass", pass);

    this.http.get<string>(this.baseUrl + 'test/login', { params }).subscribe((responce) => {
      this.UserAutorizeSource.next('Ви авторизовані');
      localStorage.setItem('token', responce);
      this.isAutorize = true;
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
