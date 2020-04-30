import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { CommentsService } from '../../../services/comment/comment.service';
import { LocationService } from '../../../services/location/location.service';

@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrls: ['./add-notes.component.scss'],
})
export class AddNotesComponent implements OnInit {

  comment = '';
  communityIndex = '';
  userId: string;
  communities: any;
  rate = 0;
  constructor(
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    public toastController: ToastController,
    private commentsService: CommentsService,
    private navParams: NavParams,
    private locationService: LocationService
    ) {
      this.userId = navParams.get('userId');
    }

  ngOnInit() {
    this.getCommunities();
  }

  getCommunities() {
    this.locationService.getCommunities().subscribe((res) => {
      this.communities = res.communities;
    }, (error) => {
    });
  }

  async onFormSubmit() {
    if (this.comment === '' || this.communityIndex === '' || this.rate === 0) { return; }
    this.commentsService.addComment({
      comment: this.comment,
      communityId: this.communities[this.communityIndex]._id,
      communityName: this.communities[this.communityIndex].street,
      userId: this.userId,
      rate: this.rate,
    })
      .subscribe(res => {
        if (res.success) {
          this.presentToast('Comment success full added');
        } else {
          this.presentToast('Ups! There was an error adding the comment');
        }
        this.actionSheetController.dismiss();
      }, (err) => {
        console.log(err);
      });

    this.modalDismiss();
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
}
