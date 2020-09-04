import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { GoogleMaps } from '@ionic-native/google-maps';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule
  ],
  declarations: [MapPage],
  providers: [Geolocation]
})
export class MapPageModule {}
