import { Component, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Message, Profile } from 'src/app/shared/types';
import { ServerService } from 'src/app/server.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements AfterViewChecked, AfterViewInit {
  profile: Profile;
  messages: Message[];

  sentMessage: string;
  isTyping: boolean;

  sentToServerData = {
    _id: '001',
    send: {
      date: Date.now().toString(),
      message: '',
    },
    reply: {
      date: Date.now().toString(),
      message: 'hello',
    },
  };

  private scrollStatus;

  constructor(private serverService: ServerService) {
    this.isTyping = false;
    this.scrollStatus = true;
  }

  ngAfterViewInit(): void {
    this.serverService.getUserData.subscribe((response) => {
      this.profile = response.body['data'][0];
      this.messages = this.profile.messages;
      this.messageParser();
    });
  }

  ngAfterViewChecked() {
    if (this.scrollStatus === true) {
      document.getElementById('scrollToLast').scrollIntoView();
    } else if (this.scrollStatus === false) {
      document.getElementById('typingScroll').scrollIntoView();
    }
  }

  private dateTimeParser(dateTime: string) {
    const tempDateTime = new Date(dateTime);
    const date = tempDateTime.toDateString();
    const timeSplit = tempDateTime.toTimeString().split(':');
    const time = timeSplit[0] + ':' + timeSplit[1];
    return [date, time];
  }

  private replyHandler() {
    let timeout;
    new Promise((resolve) => {
      this.scrollStatus = false;
      timeout = setTimeout(() => {
        document.getElementById('messageData').innerHTML += `
        <div class="chat-bubble received" id='${
          this.sentToServerData._id
        }2' style="opacity: 100%;">
        <h6>${this.sentToServerData.reply.message}</h6>
        <p>Bus-Mama at ${
          this.dateTimeParser(this.sentToServerData.reply.date)[1]
        }</p>
        </div>`;
        resolve();
      }, 3000);
    }).then(() => {
      this.isTyping = false;
      clearTimeout(timeout);

      document.getElementById('scrollToLast').scrollIntoView();
      this.scrollStatus = null;
    });
  }

  sendMessage() {
    let flag = false;
    if (this.sentMessage !== undefined) {
      if (
        this.sentMessage[0].charCodeAt(0) === 10 ||
        this.sentMessage[0].charCodeAt(0) === 32
      ) {
        const emptyChecker = new Set(this.sentMessage);
        emptyChecker.forEach((data) => {
          if (data.charCodeAt(0) !== 10 && data.charCodeAt(0) !== 32) {
            flag = true;
            return;
          } else {
            this.sentMessage = undefined;
          }
        });
      } else {
        flag = true;
      }
      if (flag) {
        this.isTyping = true;
        document.getElementById('messageData').innerHTML += `
        <div class="chat-bubble send" id='${
          this.sentToServerData._id
        }1' style="opacity: 100%;">
        <h6>${this.sentMessage}</h6>
        <p>${this.profile.name} at ${
          this.dateTimeParser(this.sentToServerData.send.date)[1]
        }</p>
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
    this.messages.forEach((message) => {
      document.getElementById('messageData').innerHTML += `
      <div class="chat-bubble send" id='${
        message._id
      }1'" style="opacity: 100%;">
        <h6>${message.send.message}</h6>
        <p>${this.profile.name} at ${
        this.dateTimeParser(message.send.date)[1]
      }</p>
      </div>
        <div class="chat-bubble received" id='${
          message._id
        }2' style="opacity: 100%;">
          <h6>${message.reply.message}</h6>
          <p>Bus-Mama at ${this.dateTimeParser(message.reply.date)[1]}</p>
        </div>
        `;
    });
  }
}
