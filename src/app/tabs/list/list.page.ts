import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/server.service';
import { BusInterface } from 'src/app/shared/Interfaces';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  busData: [BusInterface];

  constructor(private serverService: ServerService) { }

  ngOnInit() {
    this.serverService.getBusData().subscribe(
      response => {
        this.busData = response.body['data'];
        console.log(this.busData);
      }
    );
  }

}
