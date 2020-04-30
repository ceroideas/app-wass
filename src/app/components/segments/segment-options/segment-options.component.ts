import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-segment-options',
  templateUrl: './segment-options.component.html',
  styleUrls: ['./segment-options.component.scss'],
})
export class SegmentOptionsComponent implements OnInit {

  constructor(private alertController: AlertController, private router: Router) { }

  ngOnInit() {}

  linkSegment(link) {
    switch (link) {
      case 'way':
        this.presentAlert(
          'Routes',
          '',
          'Press and hold on a point on the map to create the starting point. Then do the same to create point B and we will create the shortest route on foot');

          this.router.navigate(['/routes']);
        break;
      default:
        break;
    }
  }

  goSegment(pageUrl) {
    this.router.navigate([pageUrl]);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/welcome']);
  }

  async presentAlert(header, subHeader, message) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      cssClass: 'ion-alert-default',
      buttons: ['OK']
    });

    await alert.present();
  }
}
