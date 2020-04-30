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

export class MessagesService {

    constructor(
      private httpClient: HttpClient
    ) { }

    sendReply(data): Observable<any> {
        return this.httpClient.post<any>(APIURL + 'conversations/new', data, HTTPOPTIONS)
        .pipe(
            tap(_ => this.log('conversations/new')),
            catchError(this.handleError('conversations/new', []))
        );
    }

    // getConversations(data): Observable<any> {
    //     return this.httpClient.post<any>(APIURL + 'conversations', data, HTTPOPTIONS)
    //     .pipe(
    //         tap(_ => this.log('conversations')),
    //         catchError(this.handleError('conversations', []))
    //     );
    // }

    getConversations(id: string): Observable<any> {
      return this.httpClient.get<any>(APIURL + 'conversations' + '/' + id)
        .pipe(
          tap(_ => this.log('conversations')),
          catchError(this.handleError('conversations', []))
        );
    }    

    // getConversationMessages(data): Observable<any> {
    //     return this.httpClient.post<any>(APIURL + 'conversations/messages', data, HTTPOPTIONS)
    //     .pipe(
    //         tap(_ => this.log('messages')),
    //         catchError(this.handleError('messages', []))
    //     );
    // }

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