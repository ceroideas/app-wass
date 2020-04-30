import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const APIURL = environment.apiURL;

const HTTPOPTIONS = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(
    private httpClient: HttpClient
  ) { }


  getAllBlogs(): Observable<any> {
    return this.httpClient.get<any>(APIURL + 'blogs')
      .pipe(
        tap(_ => this.log('blogs')),
        catchError(this.handleError('blogs', []))
      );
  }

  getBlogById(id: string): Observable<any> {
    return this.httpClient.get<any>(APIURL + 'blogs' + '/' + id)
      .pipe(
        tap(_ => this.log('blogs')),
        catchError(this.handleError('blogs', []))
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
