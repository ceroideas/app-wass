import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { trigger, style, animate, transition, group, query, animateChild } from '@angular/animations';
import { IonSearchbar } from '@ionic/angular';

declare var google;
@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
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
  ]
})
export class RoutesPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('searchbar') searchbar: ElementRef;

  map: any;
  labelIndexMarker = 0;
  markers = [];
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
  showInputAddress = false;
  location: any;
  destination: any;
  marker: any;
  googleAutocomplete: any;
  startAutocomplete: any;
  travelAutocomplete: any;
  autocompleteItems = [];
  geocoder: any;

  constructor(private geolocation: Geolocation) {
    this.location = {lat: 0, lng: 0};
    this.googleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.startAutocomplete = { input: '' };
    this.travelAutocomplete = { input: '' };

  }

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {

    this.geolocation.getCurrentPosition().then((resp) => {
      // let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.setLocation(resp.coords);

      let mapOptions = {
        center: this.location,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.directionsRenderer.setMap(this.map);

      this.addMarker(this.location, this.map);

      // This event listener calls addMarker() when the map is clicked.
      google.maps.event.addListener(this.map, 'click', (event) => {
        if (!this.showInputAddress && this.markers.length < 2) {
          this.addMarker(event.latLng, this.map);
        }
      });
    });
  }

  setLocation(location) {
    this.location.lat = location.latitude;
    this.location.lng = location.longitude;
  }

  calculateAndDisplayRoute(directionsService, directionsRenderer) {

    directionsService.route(
    {
      origin: {lat: this.markers[0].position.lat(), lng: this.markers[0].position.lng()},
      destination: {lat: this.markers[1].position.lat(), lng: this.markers[1].position.lng()},
      travelMode: 'DRIVING'
    },
    (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
      } else {
        alert('Directions request failed due to ' + status);
      }
    });
  }

  // Adds a marker to the map.
  addMarker(location, map) {
    let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    this.marker = new google.maps.Marker({
      position: location,
      label: labels[this.labelIndexMarker++ % labels.length],
      map
    });

    this.markers.push(this.marker);
    if (this.markers.length === 2) {
      console.log('CALCULAR');
      this.calculateAndDisplayRoute(this.directionsService, this.directionsRenderer);
    }
  }

  inputAddress() {
    this.cleanMap();
    this.showInputAddress = !this.showInputAddress;
  }

  startSearchResults() {
    if (this.startAutocomplete.input === '' || this.startAutocomplete.input.length < 4) {
      this.cleanAutocompleteItems();
      return;
    }

    this.getAddressPredictions(this.startAutocomplete.input);
  }

  travelSearchResults() {
    if (this.travelAutocomplete.input === '' || this.travelAutocomplete.input.length < 4) {
      this.cleanAutocompleteItems();
      return;
    }

    this.getAddressPredictions(this.travelAutocomplete.input);
  }

  getAddressPredictions(input) {
    this.googleAutocomplete.getPlacePredictions({ input, componentRestrictions: {country: "es"} },
    (predictions, status) => {
      this.cleanAutocompleteItems();
      predictions.map((prediction) => {
        this.autocompleteItems.push(prediction);
      });
    });
  }

  selectSearchResult(item) {
    this.cleanAutocompleteItems();

    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      console.log(results);

      if (status === 'OK' && results[0]) {
        let position = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
        };
        this.addMarker(position, this.map);
      }
    });
  }

  cleanAutocompleteItems() {
    this.autocompleteItems = [];
  }

  cleanMap() {
    this.labelIndexMarker = 0;
    this.directionsRenderer.setDirections({routes: []});
    this.markers.map((market) => {
      market.setMap(null);
    });
    this.markers = [];
    this.cleanInputAddress();
  }

  cleanInputAddress() {
    this.startAutocomplete.input = '';
    this.travelAutocomplete.input = '';
  }
}
