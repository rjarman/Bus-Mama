import { Component, OnInit, AfterViewChecked, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from 'src/app/config';
import { Message, Profile } from 'src/app/shared/Interfaces';
import { ServerService } from 'src/app/server.service';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { ChatService } from './chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy {

  profile: Profile;
  messages: [Message];

  sentMessage: string;
  isTyping: boolean;

  bindingId: any;
  private selectedIdSubscriber: Subscription;
  private deselectPressedSubscriber: Subscription;
  private selectedMessage;

  sentToServerData = {
    _id: '001',
    send: {
      date: Date.now().toString(),
      message: this.sentMessage
    },
    reply: {
      date: Date.now().toString(),
      message: 'hello'
    }
  };

  private scrollStatus;

  constructor(
    private serverService: ServerService,
    private httpClient: HttpClient,
    private popoverController: PopoverController,
    private chatService: ChatService
    ) {
      console.log('constructor')
    this.isTyping = false;
    this.bindingId = [];
    this.selectedMessage = new Set();
    this.scrollStatus = true;
  }
  ngOnDestroy(): void {
    console.log('ngOnDestroy')
    this.selectedIdSubscriber.unsubscribe();
    this.deselectPressedSubscriber.unsubscribe();
  }
  ngOnInit(): void {
    console.log('ngOnInit')
    this.selectedIdSubscriber = this.chatService.selectedId.subscribe(id => {
      this.toggleSelection(id);
      this.bindingClickEvent();
    });

    this.chatService.toggleSelection.subscribe(status => {
      if (status) {
        document.getElementById('messageHolder').setAttribute('disabled', 'true');
       }
    });

    this.chatService.selectAllPressed.subscribe(status => {
      if (status) {
        this.bindingId.forEach(id => {
          document.getElementById(id).style.opacity = '.5';
          this.selectedMessage.add(id);
          document.getElementById('messageHolder').setAttribute('disabled', 'true');
        });
      }
    });

    this.deselectPressedSubscriber = this.chatService.deselectPressed.subscribe(status => {
      if (status) {
        this.selectedMessage.forEach(id => {
          document.getElementById(id).style.opacity = '1';
          document.getElementById(id).removeEventListener('click', () => {
            this.toggleSelection(id);
          });
        });
      }
    });
   }

  ngAfterViewInit(): void {
    this.serverService.getUserData().subscribe(
      response => {
        this.profile = response.body['data'][0];
        this.messages = this.profile.messages;
        this.messageParser();
        this.bindEvent();
      }
    );
  }

  ngAfterViewChecked() {
    if (this.scrollStatus === true) {
      document.getElementById('scrollToLast').scrollIntoView();
    } else if (this.scrollStatus === false) {
       document.getElementById('typingScroll').scrollIntoView();
    }
  }

  private toggleSelection(id: string) {
    const opacity = document.getElementById(id).style.opacity;
    if (opacity === '1') {
      document.getElementById(id).style.opacity = '.5';
      this.selectedMessage.add(id);
     } else {
      document.getElementById(id).style.opacity = '1';
      this.selectedMessage.delete(id);
    }
  }

  private async openPopover(e, clickedId) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: e,
      translucent: true,
      componentProps: {id: clickedId}
    });
    return popover.present();
  }

  private dateTimeParser(dateTime: string) {
    const tempDateTime = new Date(dateTime);
    const date = tempDateTime.toDateString();
    const timeSplit = tempDateTime.toTimeString().split(':');
    const time = timeSplit[0] + ':' + timeSplit[1];
    return [date, time];
  }

  private bindEvent() {
    this.bindingId.forEach(id => {
      document.getElementById(id).addEventListener('touchcancel', (event) => {
        this.openPopover(event, id);
      });
    });
  }

  private bindingClickEvent() {
    this.bindingId.forEach(id => {
      document.getElementById(id).addEventListener('click', () => {
        this.toggleSelection(id);
      });
    });
  }

  private replyHandler() {
    let timeout;
    new Promise(resolve => {
      this.scrollStatus = false;
      timeout = setTimeout(() => {
        document.getElementById('messageData').innerHTML += `
        <div class="chat-bubble received" id='${this.sentToServerData._id}2' style="opacity: 100%;">
        <h6>${ this.sentToServerData.reply.message }</h6>
        <p>Bus-Mama at ${ this.dateTimeParser(this.sentToServerData.reply.date)[1] }</p>
        </div>`;
        resolve();
      }, 3000);
    }).then(() => {
      this.bindingId.push(this.sentToServerData._id + '1');
      this.bindingId.push(this.sentToServerData._id + '2');

      this.bindEvent();
      this.isTyping = false;
      clearTimeout(timeout);

      document.getElementById('scrollToLast').scrollIntoView();
      this.scrollStatus = null;
    });
  }


  sendMessage() {
    let flag = false;
    if (this.sentMessage !== undefined) {
      if (this.sentMessage[0].charCodeAt(0) === 10 || this.sentMessage[0].charCodeAt(0) === 32) {
        const emptyChecker = new Set(this.sentMessage);
        emptyChecker.forEach(data => {
          if (data.charCodeAt(0) !== 10 && data.charCodeAt(0) !== 32) {
            flag = true;
            return;
          } else { this.sentMessage = undefined; }
        });
      } else { flag = true; }
      if (flag) {
        this.isTyping = true;
        document.getElementById('messageData').innerHTML += `
        <div class="chat-bubble send" id='${this.sentToServerData._id}1' style="opacity: 100%;">
        <h6>${this.sentMessage}</h6>
        <p>${this.profile.name} at ${this.dateTimeParser(this.sentToServerData.send.date)[1]}</p>
        </div>
        `;
        this.scrollStatus = true;
        this.sentMessage = undefined;
        this.replyHandler();
        // this.httpClient.post(URL.chat, sentToServerData, {observe: 'response'}).subscribe(response => {
          // });
      }
    }
  }

  messageParser() {
    this.messages.forEach(message => {
      document.getElementById('messageData').innerHTML += `
      <div class="chat-bubble send" id='${message._id}1'" style="opacity: 100%;">
        <h6>${message.send.message}</h6>
        <p>${this.profile.name} at ${this.dateTimeParser(message.send.date)[1]}</p>
      </div>
        <div class="chat-bubble received" id='${message._id}2' style="opacity: 100%;">
          <h6>${ message.reply.message }</h6>
          <p>Bus-Mama at ${ this.dateTimeParser(message.reply.date)[1] }</p>
        </div>
        `;
      this.bindingId.push(message._id + '1');
      this.bindingId.push(message._id + '2');
    });
  }
}
