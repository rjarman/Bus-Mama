import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private webSocket: WebSocket;
  replyEmitter = new Subject<{ date: string; message: string; tag: string }>();

  constructor() {
    this.webSocket = new WebSocket('ws://127.0.0.1:8080/');
    this.initSocketEvents();
  }

  private initSocketEvents() {
    this.webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.replyEmitter.next({
        message: data.message,
        date: this.dateTimeParser,
        tag: data.tag,
      });
    };
  }

  get dateTimeParser(): string {
    const dateOptions = {
      month: 'long',
      day: 'numeric',
    };
    return new Date().toLocaleDateString('en-BD', dateOptions);
  }

  sendMessage(value: { email: string; message: string }) {
    this.webSocket.send(JSON.stringify(value));
  }
}
