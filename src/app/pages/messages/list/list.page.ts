import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { MessagesService } from '../../../services/messages/messages.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  conversations: any = [];
  conversationUsers: any = [];
  user: any;
  preload = true;

  constructor(
    private router: Router,
    private messagesService: MessagesService,
    private authService: AuthService
    ) {

      this.user = authService.userAuth();
    }

  ngOnInit() {
    this.getConversations();
  }

  getConversationMessages(index) {
    const navigationExtras: NavigationExtras = {
      state: {
        conversation: this.conversations[index],
        conversationUser: this.conversationUsers[index],
      }
    };
    this.router.navigate(['/messages/chat'], navigationExtras);
  }

  getConversations() {
    // this.messagesService.getConversations({
    //   _id: this.user._id
    // }).subscribe((res) => {
    //   console.log(res);
    //   this.conversations = res.conversations;
    //   this.conversationUsers = res.conversationUsers;
    //   console.log(this.conversationUsers);
    //   this.preload = false;
    // }, (error) => {
    //   console.log(error);
    // });
  }
}
