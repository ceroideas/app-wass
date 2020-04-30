import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, Events } from '@ionic/angular';
import { Observable, of } from 'rxjs';
// import { WebsocketService } from '../../../services/websocket/websocket.service';
import * as io from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { MessagesService } from '../../../services/messages/messages.service';

const APIURL = environment.apiURL;
declare var moment:any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild('IonContent') content: IonContent;

  user: any;
  // socket: any;
  conversation: any;
  conversationUser: any;
  messages: any = [];
  intervalTimeout = 900;
  clearTimerId: any;
  user_input: string = '';
  start_typing: any;
  loader: boolean;

  constructor(
    public activRoute: ActivatedRoute,
    private router: Router,
    private events: Events,
    // private websocketService: WebsocketService,
    private authService: AuthService,
    private messagesService: MessagesService
    ) {

    this.user = authService.userAuth();
    this.conversationUser = JSON.parse(localStorage.getItem('user'));

    this.activRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        // this.conversation = this.router.getCurrentNavigation().extras.state.conversation[0];
        // this.conversationUser = this.router.getCurrentNavigation().extras.state.conversationUser;
      }
    });

    // this.socket = this.websocketService.socket;

    // this.socket.on('add-message', (message) => {
    //   this.messages.push(message);
    //   this.scrollDown();
    // });

    // this.socket.on('typing-message', (data) => {
    //   this.loader = true;

    //   clearTimeout(this.clearTimerId);

    //   this.clearTimerId = setTimeout(() => {
    //     this.loader = false;
    //   }, this.intervalTimeout);
    //   this.scrollDown();
    // });
  }

  ngOnInit() {
    this.getMessages();
    this.events.subscribe('receiveGroupMessage',(message)=>{
      this.messages.push(message);
      this.scrollDown();
    });
  }

  getMessages() {
    this.messagesService.getConversations("generalwasschat").subscribe((res) => {
      console.log(res);
      this.messages = res.messages.reverse();

      this.scrollDown();
    }, (error) => {
      console.log(error);
    });
  }

  sendMsg() {


    if (this.user_input !== '') {

      let message = {
        // toId: this.conversationUser._id,
        conversationId: "generalwasschat",
        author: {
          _id: this.user._id,
          firstName: this.user.firstName,
          avatar: this.user.avatar || '../assets/images/girl.png'
        },
        time: moment().format('DD-MM-Y HH:mm'),
        body: this.user_input,
        // _id: ''
      };

      // this.socket.emit('new-message', message);

      this.messages.push(message);

      this.user_input = "";
      this.scrollDown();

      this.events.publish('sendMessageToGroup','generalwasschat',message);
      this.messagesService.sendReply(message).subscribe((res) => {
        console.log(res);
      }, (error) => {
        console.log(error);
      });


      // this.messagesService.getConversations('message').subscribe((res) => {
      //   console.log(res);
      // }, (error) => {
      //   console.log(error);
      // });
      // setTimeout(() => {
      //   this.senderSends();
      // }, 500);

    }
  }
  // senderSends() {
  //   this.loader = true;
  //   setTimeout(() => {
  //     this.messages.push({
  //       author: {
  //         _id: this.conversationUser._id,
  //         firstName: this.conversationUser.firstName
  //       },
  //       body: "Sorry, didnt get what you said. Can you repeat that please"
  //     });
  //     this.loader = false;
  //     this.scrollDown();
  //   }, 2000);
  //   this.scrollDown();
  // }
  scrollDown() {
    setTimeout(() => {
      this.content.scrollToBottom(50);
    }, 50);
  }

  userTyping(event: any) {
    // this.socket.emit('write-message', {toId: this.conversationUser._id});
    this.start_typing = event.target.value;
    this.scrollDown();
  }
}
