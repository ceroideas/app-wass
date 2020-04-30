import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { BlogService } from '../../../services/blog/blog.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  preload = true;
  posts: any;

  constructor(private router: Router, private blogService: BlogService, private toastController: ToastController) { }

  ngOnInit() {
    this.getAllPost();
  }

  getAllPost() {
    this.blogService.getAllBlogs().subscribe((res) => {
      if (res.success) {
        this.preload = false;
        this.posts = res.blogs;
      }
    }, (error) => {
      this.preload = false;
      this.presentToast('Impossible to access post');
    });
  }

  blogDetail(post) {
    const navigationExtras: NavigationExtras = {
      state: {
        postDetail: post
      }
    };
    this.router.navigate(['/blog/detail'], navigationExtras);
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  firstImage(post) {
    return post.images[0].img ? post.images[0].img : '';
  }
}
