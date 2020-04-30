import { Component, ViewChild } from '@angular/core';

import { Platform, IonRouterOutlet, MenuController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { UtilsService } from './services/utils.service';

declare var apiRTC: any


const SENDERID = environment.senderId;
const ONESIGNALAPPID = environment.oneSignalAppId;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  imClient;

  /* get a reference to the used IonRouterOutlet
  assuming this code is placed in the component
  that hosts the main router outlet, probably app.components */
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menuController: MenuController,
    private alertController: AlertController,
    private callNumber: CallNumber,
    private oneSignal: OneSignal,
    private authService: AuthService,
    private utilsService: UtilsService

  ) {
    this.initializeApp();
    this.backButtonEvent();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.hide();
      this.splashScreen.hide();

      if (localStorage.getItem('token')) {

        if (this.platform.is('cordova')) {
          this.setupPush();
        }

        this.authService.lastAccessApp();

        this.router.navigate(['/map']);
      }

    });
  }
  // active hardware back button
  backButtonEvent() {

    this.platform.backButton.subscribe(async () => {

      if (this.router.url === '/welcome' || this.router.url === '/map') {
        navigator['app'].exitApp();
      }  else {
        this.routerOutlet.pop();
      }
    });
  }

  goPage(pageUrl) {
    this.menuController.close();
    this.router.navigate([pageUrl]);
  }

  securityCall() {
    this.menuController.close();
    this.utilsService.callEmergency();
  }

  signOut() {
    localStorage.clear();
    this.menuController.close();
    this.router.navigate(['/welcome']);
  }

  setupPush() {
    this.oneSignal.startInit(ONESIGNALAPPID, SENDERID);

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    this.oneSignal.handleNotificationReceived().subscribe(data => {
      let msg = data.payload.body;
      let title = data.payload.title;
      let additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
    });

    this.oneSignal.handleNotificationOpened().subscribe(data => {
      // Just a note that the data is a different place here!
      let additionalData = data.notification.payload.additionalData;

      this.showAlert('Notification opened', 'You already read this before', additionalData.task);
    });

    this.oneSignal.endInit();

    this.oneSignal.getIds().then((identity) => {
      localStorage.setItem('playerID', identity.userId);
      localStorage.setItem('pushToken', identity.pushToken);
    });
  }


  async showAlert(title, msg, task) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Action: ${task}`,
          handler: () => {
            // E.g: Navigate to a specific screen
          }
        }
      ]
    });
    alert.present();
  }
}
