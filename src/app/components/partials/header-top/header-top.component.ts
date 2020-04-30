import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.scss'],
})
export class HeaderTopComponent implements OnInit {

  user: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.userAuth();
  }

  getProfile() {
    this.authService.profile({
      userId: this.user._id
    }).subscribe((res) => {
      console.log(res);
    }, (error) => {
      console.log(error);
    });
  }
}
