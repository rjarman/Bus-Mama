import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  @Input() id;

  constructor(
    private popoverController: PopoverController,
    private chatService: ChatService
  ) {}

  ngOnInit() {}

  select() {
    this.chatService.selectedId.next(this.id);
    this.chatService.toggleSelection.next(true);
    this.popoverController.dismiss();
  }

  delete() {
    console.log('delete');
  }

  info() {
    console.log('info');
  }
}
