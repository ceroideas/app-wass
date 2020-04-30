import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { CommentsService } from '../../../services/comment/comment.service';

@Component({
  selector: 'app-last-comments',
  templateUrl: './last-comments.component.html',
  styleUrls: ['./last-comments.component.scss'],
})
export class LastCommentsComponent implements OnInit {

  comments = [];
  commentSelect: any;
  userId: string;
  community: any;
  reviewsAverage = 0;

  constructor(
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    public toastController: ToastController,
    private commentsService: CommentsService,
    private navParams: NavParams,
    private alertController: AlertController
  ) {

    this.userId = navParams.get('userId');
    this.community = navParams.get('community');
  }

  ngOnInit() {
    this.getLastComments();
  }

  getLastComments() {
  this.commentsService.lastComments(50, this.community.communityId).subscribe((res) => {
      this.comments = res.comments;
      this.averageReviews(this.comments);
    }, (error) => {
    });
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  modalDismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  averageReviews(comments) {
    let sum = 0;
    comments.map((comment) => {
      sum = sum + comment.rate;
    });
    return comments.length ? this.reviewsAverage = sum / comments.length : 0;
  }

  presentAlertReport(comment) {
    this.commentSelect = comment;
    this.presentAlert('Report comment', 'Are you sure you want to report this comment?');
  }

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      cssClass: 'ion-alert-default',
      buttons: [
        {
          text: 'Report',
          handler: () => {
            this.sendReport();
          }
        }
      ]
    });

    await alert.present();
  }

  sendReport() {
    this.commentsService.setReport({
      userId: this.userId,
      commentId: this.commentSelect._id,
    }).subscribe((res) => {
      console.log(res);
    }, (error) => {
    });
  }
}
