import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Bus } from 'src/app/shared/bus';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  LatLng,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';
import { Platform, NavController } from '@ionic/angular';
import { Dummy } from 'src/app/shared/dummy';
import { Observable } from 'rxjs';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  map;
  dummy: Dummy[] = [];
  // @ts-ignore
  @ViewChild('mapElement') mapElement;
  busList: any;
  latitude: any;
  longitude: any;

  constructor(private geoLocation: Geolocation,) {}

  ngOnInit() {
    // this.listService.getBusList().subscribe(
    //   response => {
    //     this.setMarkers(response.body['busList']);
    //   }
    // );
    this.displayMap();
    // this.getUserLocation();
  }

  // ngAfterViewInit(){
  //   this.plt.ready().then(() => {
  //     this.getUserLocation();
  //   });
  // }

  getUserLocation(){
    // This code is necessary for browser
    // Environment.setEnv({
    //   'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyCPPkR73NXFfUpOJwmwfQlBRdG8Y4A2JWc',
    //   'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyCPPkR73NXFfUpOJwmwfQlBRdG8Y4A2JWc'
    // });
    // let map: GoogleMap = this.googleMaps.create(this.mapElement.nativeElement);

    // map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {

    //   let coordinates: LatLng = new LatLng(33.6396965, -84.4304574);

    //   let position = {
    //     target: coordinates,
    //     zoom: 17
    //   };

    //   map.animateCamera(position);

    //   let markerOptions: MarkerOptions = {
    //     position: coordinates,
    //     icon: "assets/images/icons8-Marker-64.png",
    //     title: 'Our first POI'
    //   };

    //   const marker = map.addMarker(markerOptions)
    //     .then((marker: Marker) => {
    //       marker.showInfoWindow();
    //   });
    // })
    // this.geoLocation.getCurrentPosition().then((resp) => {
    //   this.latitude = resp.coords.latitude;
    //   this.longitude = resp.coords.latitude;

    //   const map = new google.maps.Map(this.mapElement.nativeElement, {
    //     center: {lat: 22.966769799999998, lng: 22.966769799999998},
    //     zoom: 6
    //   });
    //   const infoWindow = new google.maps.InfoWindow;
    //   const pos = {
    //     lat: this.latitude,
    //     lng: this.longitude
    //   };
    //   console.log(pos);
    //   infoWindow.setPosition(pos);
    //   infoWindow.setContent('Location found!');
    //   infoWindow.open(map);
    //   map.setCenter(pos);
    // }).catch((error) => {
    //   console.log('Error getting location', error);
    // });

//     const subscription = this.geoLocation.watchPosition().subscribe(position => {
//     console.log(position.coords.longitude + ' ' + position.coords.latitude);
//   });
// console.log(subscription);

// To stop notifications
// subscription.unsubscribe();
  }

  displayMap() {
    const initialCoordinate = new google.maps.LatLng(28.6117993, 77.2194934);
    const mapOptions = {
        center: initialCoordinate,
        disableDefaultUI: true,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  setMarkers(busList) {
       for (let i = 0; i < busList.length; i++) {
           if (i > 0) {
               this.addMarker(busList[i]);
           }
       }
  }

  addMarker(bus) {
      const position = new google.maps.LatLng(bus.latitude, bus.longitude);
      const marker = new google.maps.Marker({
          position, title: bus.name
      });
      marker.setMap(this.map);
    }

}
