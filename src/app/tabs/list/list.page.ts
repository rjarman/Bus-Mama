import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { BusInterface } from 'src/app/shared/Interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit, OnDestroy {
  private getBusDataUnsubscribe: Subscription;

  busData: BusInterface[];

  constructor(private serverService: ServerService) {}
  ngOnDestroy(): void {
    this.getBusDataUnsubscribe.unsubscribe();
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.getBusDataUnsubscribe = this.serverService.getBusData.subscribe(
      (response) => {
        this.busData = response.body['data'];
      }
    );
  }

  doRefresh(event) {
    setTimeout(() => {
      this.fetchData();
      event.target.complete();
    }, 2000);
  }
}
