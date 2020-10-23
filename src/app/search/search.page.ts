import { Component, OnInit } from '@angular/core';
import { SearchService } from '../tabs/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  busList: any;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    // this.listService.getBusList().subscribe(
    //   response => {
    //     this.busList = response.body['busList'];
    //   }
    // );
    // this.searchService.getFilteredResult();
  }

  onInput() {
    this.searchService.getFilteredResult();
  }
}
