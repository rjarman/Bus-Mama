import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ServerService } from '../server.service';
import { BusInterface } from '../shared/types';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit, OnDestroy {
  private getBusDataUnsubscribe: Subscription;

  busData: BusInterface[];

  constructor(
    private serverService: ServerService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.getBusDataUnsubscribe.unsubscribe();
  }

  onInput() {
    const searchbar = document.getElementById('search');
    searchbar.addEventListener('input', handleInput);
    function handleInput(event) {
      const items = Array.from(
        document.getElementById('search-items').children
      );
      const query = event.target.value.toLowerCase();
      requestAnimationFrame(() => {
        items.forEach((item) => {
          const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
          // @ts-ignore
          item.style.display = shouldShow ? 'block' : 'none';
        });
      });
    }
  }

  fetchData() {
    this.getBusDataUnsubscribe = this.serverService.getBusData.subscribe(
      (response) => {
        this.busData = response.body['data'];
      }
    );
  }
}
