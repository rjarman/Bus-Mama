import { Component, AfterViewChecked, AfterViewInit } from '@angular/core';
import { Message, Profile, ServerData } from 'src/app/shared/types';
import { ServerService } from 'src/app/server.service';
import { ChatService } from './chat.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements AfterViewChecked, AfterViewInit {
  private scrollStatus;
  private sentToServerData: ServerData;

  profile: Profile;
  messages: Message[];

  sentMessage: string;
  isTyping: boolean;

  constructor(
    private serverService: ServerService,
    private cookieService: CookieService,
    private chatService: ChatService
  ) {
    this.isTyping = false;
    this.scrollStatus = true;

    this.sentToServerData = {
      email: '',
      messages: {
        tag: '',
        send: {
          date: '',
          message: '',
        },
        reply: {
          date: '',
          message: 'hello',
        },
      },
    };
  }

  ngAfterViewInit(): void {
    this.serverService.getUserData.subscribe((response) => {
      this.profile = response.body['data'][0];
      this.messages = this.profile.messages;
      this.messageParser();
    });
    this.chatService.replyEmitter.subscribe((data) => {
      this.sentToServerData.messages.reply.message = data.message;
      this.sentToServerData.messages.reply.date = data.date;
      this.sentToServerData.messages.tag = data.tag;
      if (this.sentToServerData.messages.send.message !== '') {
        this.serverService.sendMessage(this.sentToServerData);
      }
    });
  }

  ngAfterViewChecked() {
    if (this.scrollStatus === true) {
      document.getElementById('scrollToLast').scrollIntoView();
    } else if (this.scrollStatus === false) {
      document.getElementById('typingScroll').scrollIntoView();
    }
  }

  private replyHandler() {
    let timeout;
    new Promise((resolve) => {
      this.scrollStatus = false;
      timeout = setTimeout(() => {
        document.getElementById('messageData').innerHTML += `
        <div class="chat-bubble received" style="opacity: 100%;">
          <div style="
          color: cornflowerblue;
          font-weight: bold;
          position: absolute;
          bottom: 50%; top: 50%;
          left: -15px;
          font-size: 10px;
          transform: rotate(-90deg);">
            ${this.sentToServerData.messages.tag}
          </div>
          <h6>${this.sentToServerData.messages.reply.message}</h6>
          <p>Bus-Mama at ${this.sentToServerData.messages.reply.date}</p>
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
        this.chatService.sendMessage({
          email: this.cookieService.get('email'),
          message: this.sentMessage,
        });
        this.sentToServerData.email = this.cookieService.get('email');
        this.sentToServerData.messages.send.message = this.sentMessage;
        this.sentToServerData.messages.send.date = this.chatService.dateTimeParser;
        document.getElementById('messageData').innerHTML += `
        <div class="chat-bubble send" style="opacity: 100%;">
          <h6>${this.sentMessage}</h6>
          <p>${this.profile.name} at ${this.chatService.dateTimeParser}</p>
        </div>
        `;
        this.scrollStatus = true;
        this.sentMessage = undefined;
        this.replyHandler();
      }
    }
  }

  messageParser() {
    this.messages.forEach((message) => {
      document.getElementById('messageData').innerHTML += `
      <div class="chat-bubble send" style="opacity: 100%;">
        <h6>${message.send.message}</h6>
        <p>${this.profile.name} at ${this.chatService.dateTimeParser}</p>
      </div>
        <div class="chat-bubble received" style="opacity: 100%;">
        <div style="
        color: cornflowerblue;
        font-weight: bold;
        position: absolute;
        bottom: 50%; top: 50%;
        left: -15px;
        font-size: 10px;
        transform: rotate(-90deg);">
          ${message.tag}
        </div>
          <h6>${message.reply.message}</h6>
          <p>Bus-Mama at ${this.chatService.dateTimeParser}</p>
        </div>
        `;
    });
  }
}
