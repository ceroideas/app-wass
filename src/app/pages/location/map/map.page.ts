import { Component, OnInit, ViewChild } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  LatLng,
  MarkerOptions,
  Marker,
  MarkerIcon,
  Polygon
} from '@ionic-native/google-maps/ngx';

import { Platform, NavController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, ActionSheetController  } from '@ionic/angular';

import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from '@ionic-native/background-geolocation/ngx';

import { AlertController, ModalController, Events } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { MenuService } from '../../../services/menu/menu.service';
import { Router, NavigationExtras } from '@angular/router';
import { AddNotesComponent } from '../../../components/modals/add-notes/add-notes.component';
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { LocationService } from '../../../services/location/location.service';
import { UtilsService } from '../../../services/utils.service';
import { trigger, style, animate, transition, group, query, animateChild } from '@angular/animations';
import { LastCommentsComponent } from '../../../components/modals/last-comments/last-comments.component';

declare var google;
declare var apiRTC;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  animations: [

    trigger('container', [
      transition(':enter', [
          style({opacity: '0'}),
          group([
            animate('500ms ease-out', style({opacity: '1'}))
          ])
      ]),
      transition(':leave', [
          group([
            animate('500ms ease-out', style({opacity: '0'}))
          ])
      ])
    ]),

    trigger('options', [
      transition(':enter', [
          style({opacity: '0'}),
          animate('500ms 1000ms ease-out', style({opacity: '1'}))
      ]),
      transition(':leave', [
          animate('500ms ease-in', style({opacity: '0'}))
      ])
    ])

  ]
})
export class MapPage implements OnInit {

  @ViewChild('map') element;
  imClient;
  message = '';
  preload = false;
  user: any;

  locationSuccess = [];
  latLngDefault = {
    lat: 36.698391,
    lng: -4.443494
  };
  positionBG: any;

  isNightMode = false;

  locations: any;
  places: any;
  mapRef = null;
  presentMoreOptions = false;
  map: GoogleMap;
  marker: Marker;
  constructor(
    public googleMaps: GoogleMaps,
    public platform: Platform,
    public nav: NavController,
    public geolocation: Geolocation,
    public loadingController: LoadingController,
    private backgroundGeolocation: BackgroundGeolocation,
    private alertController: AlertController,
    private authService: AuthService,
    private callNumber: CallNumber,
    private menuService: MenuService,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private events: Events,
    private modalController: ModalController,
    // private inAppBrowser: InAppBrowser,
    private locationService: LocationService,
    private utilsService: UtilsService
  ) {

    this.receiveGroupChatMessageHandler = this.receiveGroupChatMessageHandler.bind(this);
    this.sessionReadyHandler = this.sessionReadyHandler.bind(this);

    this.events.subscribe('sendMessageToGroup',(i,m)=>{
      this.imClient.sendMessageToGroupChat(i,m);
    });

    this.user = authService.userAuth();
    this.initRTC()
  }

  ngOnInit() {
    this.menuService.setActiveMenu(true);
    this.getCommunities();
  }

  getCommunities() {
    this.locationService.getCommunities().subscribe((res) => {
      this.locations = res.communities;
      this.initMap();

    }, (error) => {

    });
  }

  getPlaces() {
    this.locationService.getPlaces().subscribe((res) => {
      this.places = res.places;

      this.setPlaceMarkes(this.map, this.places);
    });
  }

  async initMap() {

    const mapOptions: GoogleMapOptions = {
      camera: {
        target: this.latLngDefault,
        zoom: 16,
        tilt: 30
      },
    };

    this.map = this.googleMaps.create('map', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {

      this.marker = this.map.addMarkerSync({
        icon: {
          url: "assets/images/wass-logo.png",
          size: {
            width: 45,
            height: 50
          }
        },
        position: this.latLngDefault
      });

      this.getPlaces();
      this.addPolygons();
      this.startBackgroundGeolocation();
    })
    .catch(error => {
      console.log(error);
    });

    this.map.one(GoogleMapsEvent.MAP_DRAG)
    .then(() => {

      if (!this.isNightMode) {
        this.stopBackgroundGeolocation();
        this.map.setMapTypeId('MAP_TYPE_SATELLITE');
      }
    });
  }

  getPosition(): void {
    this.map.getMyLocation()
    .then(response => {
      this.map.moveCamera({
        target: response.latLng
      });
      this.map.addMarker({
        title: 'My Position',
        icon: 'blue',
        animation: 'DROP',
        position: response.latLng
      });
    })
    .catch(error => {
      console.log(error);
    });
  }


  startBackgroundGeolocation() {
    this.backgroundGeolocation.isLocationEnabled()
    .then((rta) => {
      if (rta) {
        this.start();
      } else {
        this.backgroundGeolocation.showLocationSettings();
      }
    });
  }

  start() {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 0, // Precisión
      stationaryRadius: 1,
      distanceFilter: 1,
      debug: false,
      stopOnTerminate: false,
      // Android only section
      locationProvider: 1,
      startForeground: true,
      interval: 1000,
      fastestInterval: 1000,
      activitiesInterval: 1000,
    };
    this.backgroundGeolocation
      .configure(config)
      .then(() => {

      this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
        this.positionBG = {lat: location.latitude, lng: location.longitude};

        this.calculatePosition(this.positionBG);
        // this.backgroundGeolocation.finish();
      });
    });

    this.backgroundGeolocation.start();
  }

  stopBackgroundGeolocation() {
    this.backgroundGeolocation.stop();
  }

  setPositionMarket(latLng) {

    this.map.moveCamera({
      target: latLng
    });

    this.marker.setPosition(latLng);
    console.log('SetPosition');
    // this.map.addMarker({
    //   position: {lat: 36.72221882726922, lng: -4.366100908605972},
    //   icon: '',
    //   title: 'Hello friend!\nI had a bad experience in this area',
    //   snippet: 'Warning'
    // }).then((m) => {
    //   m.showInfoWindow();
    // });
  }


  calculatePosition(myPosition) {

    this.setPositionMarket(myPosition);

    this.locations.forEach((location) => {

      let paths = [];
      let alert: any;

      location.locations.map((latLng) => {
        paths.push(new google.maps.LatLng(latLng.lat, latLng.lng));
      });

      alert = new google.maps.Polygon({
        paths
      });

      if (google.maps.geometry.poly.isLocationOnEdge(new google.maps.LatLng(myPosition.lat, myPosition.lng), alert, 0.0001)) {

        if (location.success) {
          return false;
        }

        location.success = true;

        this.presentAlert('You are in ' + location.street + ',',
        'Take precaution',
        'You are near an area in which you must be careful.');

        this.authService.notifPush({
          lat: myPosition.lat,
          lng: myPosition.lng,
          playerID: localStorage.getItem('playerID'),
          pushToken: localStorage.getItem('pushToken'),
        })
        .subscribe(res => {
        }, (err) => {
        });

        return false;
      }
    });


    // this.getLatLngGM(myPosition);

    // 0.021 -> 2k
    // 0.001 -> 100m
  }

  addPolygons() {
    this.locations.map((location, index) => {
      this.map.addPolygon({
        points: location.locations,
        strokeColor : location.color,
        strokeWidth: 1,
        fillColor : location.color,
        clickable: true,
        key: location._id,
        locationStreet: location.street,
        zIndex: index
      }).then((p: Polygon) => {
        p.on(GoogleMapsEvent.POLYGON_CLICK).subscribe((latLng) => {
          this.modalLastComments({
            communityId: p.get('key'),
            communityName: p.get('locationStreet'),
          });
          // this.poligonSelect.street = p.get('locationStreet');
          // this.presentAlert('POLYGON_CLICK key - zIndex -> ' + p.get('key') + ' - ' + p.getZIndex(),
          // '',
          // '');
        });
      });
    });
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

  callSecurity() {

    this.utilsService.callEmergency();
  }

  moreOptions() {
    this.presentMoreOptions = !this.presentMoreOptions;
  }

  itemMoreOptions(item) {
    switch (item) {
      case 'messages':
        this.router.navigate(['/messages/chat']);
        break;

      case 'stopLocation':
        this.stopBackgroundGeolocation();
        break;

      case 'addNote':
        this.modalAddNotes();
        break;

      case 'emergencyCall':
        this.callSecurity();
        break;

      default:
        break;
    }
  }

  async modalAddNotes() {
    const modal = await this.modalController.create({
      component: AddNotesComponent,
      componentProps: {
        userId: this.user._id,
      }
    });
    return await modal.present();
  }

  async modalLastComments(community) {
    const modal = await this.modalController.create({
      component: LastCommentsComponent,
      componentProps: {
        userId: this.user._id,
        community,
      }
    });
    return await modal.present();
  }

  openLink() {
    window.open('http://www.renfe.com/viajeros/');
    // const browser = this.inAppBrowser.create('', '_self', 'location=yes');

  }

  nightMode() {
    this.isNightMode = !this.isNightMode;

    if (this.isNightMode) {
      let nightMode: GoogleMapOptions = {
        styles: this.utilsService.nightMode()
      };
      this.map.setOptions(nightMode);
    } else {
      let standart: GoogleMapOptions = {
        styles: []
      };
      this.map.setOptions(standart);
    }
  }

  setPlaceMarkes(map, places) {

    places.map((place, index) => {
      map.addMarker({
      position: {lat: place.position.lat, lng: place.position.lng},
      icon: {
        url: "assets/images/icon-location-places.png",
        size: {
          width: 45,
          height: 50
        }
      },
      place,
    }).then((m: Marker) => {

      m.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        let p = m.get('place');
        this.placeDetail(p);
      });
    });
    });
  }

  placeDetail(place) {
    const navigationExtras: NavigationExtras = {
      state: {
        postDetail: place
      }
    };
    this.router.navigate(['/place/detail'], navigationExtras);
  }

  lastComments() {

  }

  reviewCommunity() {
  }
  // Deshuso...

  // getLatLngGM(myPosition) {
  //   const dataMap = this.dataMap();
  //   let alert = [];

  //   dataMap[0].province.locations.map((location) => {
  //     location.polygons.map((latLng) => {
  //       alert.push(new google.maps.LatLng(latLng.lat, latLng.lng));
  //     });

  //     let distance = this.googleIsLocationOnEdge(myPosition, alert);

  //     if (distance) {
  //       this.message = 'Si se ha encontrado nada';
  //       this.presentAlert('You are in ' + location.street, 'Take precaution', 'You are near an area in which you must be careful.');
  //     } else {
  //       this.message = 'No se ha encontrado nada';
  //     }
  //   });
  // }

  // async googleIsLocationOnEdge(myPosition, alert) {

  //   let warning = new google.maps.Polygon({
  //     paths: alert,
  //   });
  //   // 0.0001
  //   const result = await google.maps.geometry.poly.isLocationOnEdge(new google.maps.LatLng(myPosition.lat, myPosition.lng), warning, 0.0001) ? true : false;
  //   return result;
  // }


  initRTC()
  {
    let id = JSON.parse(localStorage.getItem('user'))['_id'];
    apiRTC.init({
      apiKey: "cf611d40947f26e415a693f322528dd5",
      apiCCId : id,
      onReady: this.sessionReadyHandler
    });
  }

   sessionReadyHandler() {

    let user = JSON.parse(localStorage.getItem('user'));

    this.imClient = apiRTC.session.createIMClient();
    this.imClient.nickname = user.firstName;
    this.imClient.setUserData({photoURL: user.avatar});

    this.imClient.joinGroupChat("generalwasschat");

    console.log(this.imClient);

    // if (this.user.type == "V") {
    //   this.api.getGroups().map(res=>res.json())
    //   .subscribe(data=>{
    //     for (var i = 0; i < data.length; ++i) {
    //       this.imClient.joinGroupChat(data[i].group_id);
    //     }
    //   })
    // }else{
    //   this.imClient.joinGroupChat(this.user.id);
    // }

    apiRTC.addEventListener("receiveGroupChatMessage", this.receiveGroupChatMessageHandler);

    apiRTC.addEventListener('connectedUsersListUpdate',(e)=>{
      console.log('connectedUsersListUpdate',e);
      // if (document.getElementById('list-of-girls')) {
      //   if (e.detail.usersList) {
      //     let elem = e.detail.usersList;

      //     for (var i = 0; i < elem.length; ++i) {
      //       console.log('elem',elem[i]);
      //       let userElem = document.getElementById('status-'+elem[i]);
      //       if (userElem) {
      //         if (e.detail.status == 'online') {

      //           userElem.innerHTML = "<span class='dotOnline'></span> Online";
      //           userElem.classList.remove("offline");
      //           userElem.classList.add("online");

      //         }else{
                
      //           userElem.innerText = "Offline";
      //           userElem.classList.add("offline");
      //           userElem.classList.remove("online");

      //         }
      //       }
      //     }
      //   }
      // }
    })
  }

  receiveGroupChatMessageHandler(e)
  {
    console.log(e);
    this.events.publish('receiveGroupMessage',e.detail.message);
    // if (document.getElementById('girlGroup-'+e.detail.groupChatId)) {
    //   if (document.querySelector('#messages')) {

    //     var internal = null;
        
    //     var ele = document.querySelector('#messages');
    //     let msg = e.detail.message;
    //     let girl;
    //     if (msg.indexOf('79069ebea2be91426d2ef29b23f0a0fd1eef7716') != -1) {
    //       msg = msg.replace("79069ebea2be91426d2ef29b23f0a0fd1eef7716", "");
    //       girl = "girl";
    //       console.log("girl:79069ebea2be91426d2ef29b23f0a0fd1eef7716");
    //     }

    //     if (msg.indexOf('girlifyCode') != -1) {
    //       msg = msg.replace("girlifyCode", "");
    //       let newmsg = msg.split("|");
    //       internal = newmsg[0];
    //       msg = newmsg[1];
    //     }

    //     this.api.getUserPhoto(e.detail.senderId).map(res=>res.json())
    //     .subscribe(data=>{
    //       let crown = "../assets/imgs/transparent.png";

    //       if (data[1] == 1) {
    //         crown = '../assets/imgs/level1.png';
    //       }
    //       else if (data[1] == 2) {
    //         crown = '../assets/imgs/level2.png';
    //       }
    //       else if (data[1] == 3) {
    //         crown = '../assets/imgs/level3.png';
    //       }
    //       var html = ele.innerHTML+'<div class="message">\
    //       <img src="'+crown+'" alt="" class="crown" />\
    //       <span class="circle-picture" style="background-image: url('+data[0]+')"></span>\
    //       <div data-show="null" data-message_id="'+internal+'"><span class="name '+girl+'" data-id="'+e.detail.senderId+'" data-name="'+e.detail.senderNickname+'">'+e.detail.senderNickname+': </span>'+(this.imagify(msg))+'</div></div>';
    //       ele.innerHTML = html;
    //       this.events.publish('scrollToBottomFixed');
    //     })
    //   }else{
    //     console.log('New Message',e.detail.message);
    //   }
    // }
  }
}
