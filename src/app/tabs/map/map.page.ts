import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ServerService } from 'src/app/server.service';
import { Subscription, interval } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import {
  BusInterface,
  GPS,
  MapGeneratedData,
  InfoWindowData,
} from 'src/app/shared/types';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('googleMapContainer', { static: false })
  googleMapContainer: ElementRef;

  private busData: [BusInterface];
  private trackedBus: BusInterface;
  private trackBusId: string;

  private getBusDataUnsubscribe: Subscription;
  private getBusDataIntervalUnsubscribe: Subscription;
  private getTrackBusDataUnsubscribe: Subscription;
  private watchPositionUnsubscribe: Subscription;

  // map
  private defaultCoordinates: google.maps.LatLng = new google.maps.LatLng(
    22.9659,
    89.8173
  );
  private userCoordinates: google.maps.LatLng;
  private googleMap: google.maps.Map;
  private mapOptions: google.maps.MapOptions;
  private userMapMarker: google.maps.Marker;
  private busMapMarker: { busId: string; marker: google.maps.Marker }[] = [];

  constructor(
    private geolocation: Geolocation,
    private activatedRouter: ActivatedRoute,
    private serverService: ServerService
  ) {
    this.trackBusId = this.activatedRouter.snapshot.paramMap.get('busId');
  }

  ngOnDestroy(): void {
    this.getBusDataIntervalUnsubscribe.unsubscribe();
    this.watchPositionUnsubscribe.unsubscribe();
  }

  ngOnInit() {
    this.getBusDataIntervalUnsubscribe = this.serverService.getBusDataInterval.subscribe(
      (data) => {
        this.busData = data.body['data'];
      }
    );

    let isTracked = false;
    let isRenderedStreet = true;
    if (this.trackBusId) {
      this.toggleLoading(true);
      this.getTrackBusDataUnsubscribe = this.serverService
        .getTrackBusData(this.trackBusId)
        .subscribe((info) => {
          this.trackedBus = info.body['data'][0];
          if (isRenderedStreet) {
            this.renderStreet();
            isRenderedStreet = false;
          }
          isTracked = true;
          this.toggleLoading(false);
        });
    } else {
      if (isTracked) {
        this.getTrackBusDataUnsubscribe.unsubscribe();
      }
      this.toggleLoading(false);
    }

    this.watchPositionUnsubscribe = interval(10000)
      .pipe(
        flatMap(() => {
          return this.geolocation.getCurrentPosition({
            enableHighAccuracy: false,
          });
        })
      )
      .subscribe((data) => {
        localStorage.setItem('lat', data.coords.latitude.toString());
        localStorage.setItem('lng', data.coords.longitude.toString());
        this.userCoordinates = this.getCoordinates(data['coords']);
        this.setGoogleMap();
        this.generateDistanceMatrix();
      });
  }

  ngAfterViewInit() {
    this.toggleLoading(false);
    const cachedCoordinates = this.getCoordinates([
      Number(localStorage.getItem('lng')),
      Number(localStorage.getItem('lat')),
    ]);
    if (cachedCoordinates) {
      this.initMap(cachedCoordinates);
    } else {
      this.initMap();
    }
    this.getBusDataUnsubscribe = this.serverService.getBusData.subscribe(
      (data) => {
        this.busData = data.body['data'];
        this.setGoogleMap(true);
        this.addMarkerEvent();
        this.getBusDataUnsubscribe.unsubscribe();
      }
    );
  }

  private toggleLoading(state: boolean) {
    if (state) {
      document.getElementById('mapLoading').style.display = '';
      document.getElementById('map').style.display = 'none';
    } else {
      document.getElementById('mapLoading').style.display = 'none';
      document.getElementById('map').style.display = '';
    }
  }

  private get getBusGPS(): google.maps.LatLng[] {
    const gps: google.maps.LatLng[] = [];
    this.busData.forEach((data) => {
      gps.push(this.getCoordinates(data.location.coordinates));
    });
    return gps;
  }

  private getCoordinates(gps: GPS | number[]): google.maps.LatLng {
    if (Array.isArray(gps)) {
      return new google.maps.LatLng({ lat: gps[1], lng: gps[0] });
    }
    return new google.maps.LatLng(gps.latitude, gps.longitude);
  }

  private initMap(
    cachedCoordinates: google.maps.LatLng = this.defaultCoordinates
  ) {
    // zoom : 18
    this.mapOptions = {
      center: cachedCoordinates,
      zoom: 7,
      fullscreenControl: false,
      clickableIcons: true,
      disableDefaultUI: true,
    };
    this.userMapMarker = new google.maps.Marker({
      position: cachedCoordinates,
      map: this.googleMap,
      icon: {
        url: '../../../../assets/icon/person.png',
      },
      animation: google.maps.Animation.BOUNCE,
    });
    this.googleMap = new google.maps.Map(
      this.googleMapContainer.nativeElement,
      this.mapOptions
    );
    this.userMapMarker.setMap(this.googleMap);
  }

  private setGoogleMap(isBus: boolean = false) {
    if (isBus) {
      this.busData.forEach((data) => {
        const tempMarker = new google.maps.Marker({
          position: this.getCoordinates(data.location.coordinates),
          map: this.googleMap,
          icon: {
            url: '../../../../assets/icon/bus.png',
          },
          animation: google.maps.Animation.DROP,
        });
        this.busMapMarker.push({ busId: data.busId, marker: tempMarker });
        tempMarker.setMap(this.googleMap);
      });
      return;
    }
    this.googleMap.setOptions({ center: this.userCoordinates });
    this.userMapMarker.setPosition(this.userCoordinates);
  }

  private generateDistanceMatrix() {
    const distanceMatrix = new google.maps.DistanceMatrixService();
    const originCoordinates: google.maps.LatLng[] = [];
    this.busData.forEach((data) => {
      originCoordinates.push(this.getCoordinates(data.location.coordinates));
    });
    new Promise((resolve) => {
      distanceMatrix.getDistanceMatrix(
        {
          destinations: [this.defaultCoordinates, this.userCoordinates],
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: google.maps.TrafficModel.BEST_GUESS,
          },
          durationInTraffic: true,
          origins: this.getBusGPS,
        },
        (response, status) => {
          if (status === 'OK') {
            resolve(response);
          }
        }
      );
    }).then((response: google.maps.DistanceMatrixResponse) => {
      this.infoWindowData(response);
    });
  }

  private async infoWindowData(data: google.maps.DistanceMatrixResponse) {
    const generatedData: MapGeneratedData = {
      busData: this.busData,
      distanceMatrixData: data,
    };
    let busCounter = 0;
    for await (const datum of generatedData.busData) {
      const tempData: InfoWindowData = {
        busData: datum,
        distanceMatrixData: [],
      };
      let desCounter = 0;
      for await (const dest of generatedData.distanceMatrixData
        .destinationAddresses) {
        tempData.distanceMatrixData.push({
          origin: generatedData.distanceMatrixData.originAddresses[busCounter],
          destination: dest,
          duration: {
            time:
              generatedData.distanceMatrixData.rows[busCounter].elements[
                desCounter
              ].duration,
            inTraffic:
              generatedData.distanceMatrixData.rows[busCounter].elements[
                desCounter
              ].duration_in_traffic,
          },
          distance:
            generatedData.distanceMatrixData.rows[busCounter].elements[
              desCounter
            ].distance,
        });
        desCounter++;
      }
      busCounter++;
      localStorage.setItem(datum.busId, JSON.stringify(tempData));
    }
  }

  private generateInfoWindow(
    infoWindowData: InfoWindowData
  ): google.maps.InfoWindow {
    let trafficStyleDefaultCoordinates: string;
    let trafficStyleUserCoordinates: string;
    let infoWindowInnerHTML: string;

    /**
     * @for_default_coordinates
     */
    if (
      infoWindowData.distanceMatrixData[0].duration.inTraffic.value >
      infoWindowData.distanceMatrixData[0].duration.time.value
    ) {
      trafficStyleDefaultCoordinates = 'red';
    } else {
      trafficStyleDefaultCoordinates = 'green';
    }

    /**
     * @for_user_coordinates
     */

    if (
      infoWindowData.distanceMatrixData[1].duration.inTraffic.value >
      infoWindowData.distanceMatrixData[1].duration.time.value
    ) {
      trafficStyleUserCoordinates = 'red';
    } else {
      trafficStyleUserCoordinates = 'green';
    }

    infoWindowInnerHTML = `
      <ion-grid style="padding: 0;margin-top: 10px;">
        <ion-row>
          <ion-col size="12" style="padding: 0;">
            <ion-avatar style="position: absolute;left: 50%;right: 50%;transform: translate(-50%, -50%);margin-top: 25px;">
              <img src="${infoWindowData.busData.image}" alt="logo" width="50px" height="50px">
            </ion-avatar>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="6" style="padding: 0;">
            <p style="margin-top: 50px;text-align: center;">
              From
            </p>
            <p style="margin-top: -12px;text-align: center;">
              <strong><em>${infoWindowData.distanceMatrixData[0].origin}</em></strong>
            </p>
          </ion-col>
          <ion-col size="6" style="padding: 0;">
            <p style="margin-top: 50px;text-align: center;">
              To
            </p>
            <p style="margin-top: -12px;text-align: center;">
              <strong><em>${infoWindowData.distanceMatrixData[0].destination}</em></strong>
            </p>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" style="margin-bottom: 3px;padding: 0;">
            <div style="border-bottom: 1px solid #B0B3B5;"></div>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" style="padding: 0;">
            <p style="margin-top: 0px;text-align: center;">
              you are currently at
            </p>
            <p style="margin-top: -12px;text-align: center;">
              <strong><em>${infoWindowData.distanceMatrixData[1].destination}</em></strong>
            </p>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" style="padding: 0;">
            <p style="margin-top: -5px;text-align: center;text-decoration: underline;color: green;">
              current status
            </p>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="2" style="padding: 0;"></ion-col>
          <ion-col size="5" style="padding: 0;">
            <p style="margin-top: -10px;text-align: center;"><em>BSMRSTU</em></p>
          </ion-col>
          <ion-col size="5" style="padding: 0;">
            <p style="margin-top: -10px;text-align: center;"><em>your position</em></p>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="2.3" style="padding: 0;">
            <p style="margin-top: -10px;text-align: left;">
              <em>DST</em>
            </p>
          </ion-col>
          <ion-col size="4.7" style="padding: 0;">
            <p style="margin-top: -10px;text-align: center;">
              <strong style="color: red;"><em>${infoWindowData.distanceMatrixData[0].distance.text}</em></strong>
            </p>
          </ion-col>
          <ion-col size="4.7" style="padding: 0;">
            <p style="margin-top: -10px;text-align: center;">
              <strong style="color: red;"><em>${infoWindowData.distanceMatrixData[1].distance.text}</em></strong>
            </p>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="2.3" style="padding: 0;">
            <p style="margin-top: -10px;text-align: left;">
              <em>AVG</em>
            </p>
          </ion-col>
          <ion-col size="4.7" style="padding: 0;">
            <p style="margin-top: -10px;text-align: center;">
              <strong><em>${infoWindowData.distanceMatrixData[0].duration.time.text}</em></strong>
            </p>
          </ion-col>
          <ion-col size="4.7" style="padding: 0;">
            <p style="margin-top: -10px;text-align: center;">
              <strong><em>${infoWindowData.distanceMatrixData[1].duration.time.text}</em></strong>
            </p>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="2.3" style="padding: 0;">
            <p style="margin-top: -10px;text-align: left;">
              <em>TFC</em>
            </p>
          </ion-col>
          <ion-col size="4.7" style="padding: 0;">
            <p style="margin-top: -10px;text-align: center;">
              <strong style="color: ${trafficStyleDefaultCoordinates};">
                <em>${infoWindowData.distanceMatrixData[0].duration.inTraffic.text}</em>
              </strong>
            </p>
          </ion-col>
          <ion-col size="4.7" style="padding: 0;">
            <p style="margin-top: -10px;text-align: center;">
              <strong style="color: ${trafficStyleUserCoordinates};">
                <em>${infoWindowData.distanceMatrixData[1].duration.inTraffic.text}</em>
              </strong>
            </p>
          </ion-col>
        </ion-row>
      </ion-grid>`;

    return new google.maps.InfoWindow({
      content: infoWindowInnerHTML,
      position: this.getCoordinates(
        infoWindowData.busData.location.coordinates
      ),
      pixelOffset: new google.maps.Size(0, -50),
      maxWidth: 300,
    });
  }

  private addMarkerEvent(): void {
    this.busMapMarker.forEach((marker) => {
      google.maps.event.addListener(marker.marker, 'click', () => {
        this.generateInfoWindow(
          JSON.parse(localStorage.getItem(marker.busId))
        ).open(this.googleMap);
      });
    });
  }

  private renderStreet() {
    const directionsService = new google.maps.DirectionsService();
    /**
     * @rendering_from_user_to_bus
     */
    directionsService.route(
      {
        destination: this.getCoordinates(this.trackedBus.location.coordinates),
        origin: this.userCoordinates,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS,
        },
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status === 'OK') {
          new google.maps.DirectionsRenderer({
            markerOptions: { visible: false },
            polylineOptions: { strokeWeight: 7, strokeColor: '#f28482' },
            preserveViewport: true,
            directions: result,
          }).setMap(this.googleMap);
        }
      }
    );
    /**
     * @rendering_from_bus_to_BSMRSTU
     */
    directionsService.route(
      {
        destination: this.defaultCoordinates,
        origin: this.getCoordinates(this.trackedBus.location.coordinates),
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS,
        },
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status === 'OK') {
          new google.maps.DirectionsRenderer({
            markerOptions: { visible: false },
            polylineOptions: { strokeWeight: 7, strokeColor: '#90be6d' },
            preserveViewport: true,
            directions: result,
          }).setMap(this.googleMap);
        }
      }
    );
  }
}
