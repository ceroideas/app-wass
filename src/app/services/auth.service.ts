import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const APIURL = environment.apiURL;

const HTTPOPTIONS = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) { }

  login(data): Observable<any> {
    return this.httpClient.post<any>(APIURL + 'signin', data, HTTPOPTIONS)
      .pipe(
        tap(_ => this.log('login')),
        catchError(this.handleError('login', []))
      );
  }

  logout(): Observable<any> {
    return this.httpClient.get<any>(APIURL + 'signout')
      .pipe(
        tap(_ => this.log('logout')),
        catchError(this.handleError('logout', []))
      );
  }

  register(data): Observable<any> {
    return this.httpClient.post<any>(APIURL + 'signup', data, HTTPOPTIONS)
      .pipe(
        tap(_ => this.log('register')),
        catchError(this.handleError('register', []))
      );
  }

  notifPush(data): Observable<any> {
    return this.httpClient.post<any>(APIURL + 'push/location', data, HTTPOPTIONS)
      .pipe(
        tap(_ => this.log('notifPush')),
        catchError(this.handleError('notifPush', []))
      );
  }

  profileUpdate(data): Observable<any> {
    return this.httpClient.post<any>(APIURL + 'profile/update', data, HTTPOPTIONS)
      .pipe(
        tap(_ => this.log('profileUpdate')),
        catchError(this.handleError('profileUpdate', []))
      );
  }

  passwordUpdate(data): Observable<any> {
    return this.httpClient.post<any>(APIURL + 'profile/password/update', data, HTTPOPTIONS)
      .pipe(
        tap(_ => this.log('profileUpdatePassword')),
        catchError(this.handleError('profileUpdatePassword', []))
      );
  }

  lastAccessApp() {
    this.httpClient.post(APIURL + 'profile/last-access-app', {
      userId: this.userAuth()._id
    }, HTTPOPTIONS)
      .subscribe((res) => {
        console.log('lastAccessApp');
      });
  }

  userAuth() {
    return JSON.parse(localStorage.getItem('user'));
  }

  setUserDataAuthStorage(data) {
    const userData = {
      _id: data._id,
      avatar: data.avatar,
      firstName: data.firstName,
      name: data.name,
      email: data.email,
      nationality: data.nationality,
      createdOn: data.createdOn
    };

    localStorage.setItem('user', JSON.stringify(userData));
  }

  profile(data): Observable<any> {
    return this.httpClient.post<any>(APIURL + 'profile', data, HTTPOPTIONS)
      .pipe(
        tap(_ => this.log('profile')),
        catchError(this.handleError('profile', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }

}
