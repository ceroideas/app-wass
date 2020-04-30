import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import * as io from 'socket.io-client';
import { AuthService } from '../../services/auth.service';
const APIURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {

    user: any;
    socket: any;

    constructor(private authService: AuthService) {
        this.user = authService.userAuth();
        this.socket = io.connect(APIURL, {reconnection: true , query: "userId="+this.user._id});
    }

    // joinRoom(data) {
    //     console.log(data);
    //     this.socket.emit('join', data);
    // }

    // sendMessage(data) {
    //     this.socket.emit('message', data);
    // }

    // newMessageReceived() {
    //     const observable = new Observable<{ user: String, message: String}>(observer => {
    //     this.socket.on('new message', (data) => {
    //         observer.next(data);
    //     });
    //     return () => {
    //         this.socket.disconnect();
    //     };
    //     });
    //     return observable;
    // }

    // typing(data) {
    //     this.socket.emit('typing', data);
    // }

    // receivedTyping() {
    //     const observable = new Observable<{ isTyping: boolean}>(observer => {
    //     this.socket.on('typing', (data) => {
    //         observer.next(data);
    //     });
    //     return () => {
    //         this.socket.disconnect();
    //     };
    //     });
    //     return observable;
    // }
}
