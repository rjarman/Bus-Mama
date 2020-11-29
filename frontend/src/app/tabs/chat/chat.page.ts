import { Component, AfterViewChecked, AfterViewInit } from '@angular/core';
import {
  BusInterface,
  GPS,
  InfoWindowData,
  MapGeneratedData,
  Message,
  Profile,
  ServerData,
} from 'src/app/shared/types';
import { ServerService } from 'src/app/server.service';
import { ChatService } from './chat.service';
import { CookieService } from 'ngx-cookie-service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { interval } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements AfterViewChecked, AfterViewInit {
  private busData: BusInterface[];

  private defaultCoordinates: google.maps.LatLng = new google.maps.LatLng(
    22.9659,
    89.8173
  );
  private userCoordinates: google.maps.LatLng;

  private scrollStatus;
  private sentToServerData: ServerData;

  profile: Profile;
  messages: Message[];

  sentMessage: string;
  isTyping: boolean;

  constructor(
    private serverService: ServerService,
    private cookieService: CookieService,
    private chatService: ChatService,
    private geolocation: Geolocation
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

    this.serverService.getBusDataInterval.subscribe((data) => {
      this.busData = data.body['data'];
    });

    interval(10000)
      .pipe(
        flatMap(() => {
          return this.geolocation.getCurrentPosition({
            enableHighAccuracy: false,
          });
        })
      )
      .subscribe((data) => {
        this.userCoordinates = this.getCoordinates(data['coords']);
      });
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
    });
  }

  ngAfterViewChecked() {
    if (this.scrollStatus === true) {
      document.getElementById('scrollToLast').scrollIntoView();
    } else if (this.scrollStatus === false) {
      document.getElementById('typingScroll').scrollIntoView();
    }
  }

  private getCoordinates(gps: GPS | number[]): google.maps.LatLng {
    if (Array.isArray(gps)) {
      return new google.maps.LatLng({ lat: gps[1], lng: gps[0] });
    }
    return new google.maps.LatLng(gps.latitude, gps.longitude);
  }

  private getBusGPS(busId: string): google.maps.LatLng[] {
    const gps: google.maps.LatLng[] = [];
    this.busData.forEach((data) => {
      if (busId === data.busId) {
        gps.push(this.getCoordinates(data.location.coordinates));
        return;
      }
      if (busId === 'all') {
        gps.push(this.getCoordinates(data.location.coordinates));
      }
    });
    return gps;
  }

  private async infoWindowData(
    data: google.maps.DistanceMatrixResponse,
    busId: string
  ) {
    const generatedData: MapGeneratedData = {
      busData: this.busData,
      distanceMatrixData: data,
    };
    let busCounter = 0;
    const infoData: InfoWindowData[] = [];
    if (busId !== 'all') {
      for await (const datum of generatedData.busData) {
        if (datum.busId === busId) {
          const tempData: InfoWindowData = {
            busData: datum,
            distanceMatrixData: [],
          };
          let desCounter = 0;
          for await (const dest of generatedData.distanceMatrixData
            .destinationAddresses) {
            tempData.distanceMatrixData.push({
              origin:
                generatedData.distanceMatrixData.originAddresses[busCounter],
              destination: dest,
              duration: {
                time:
                  generatedData.distanceMatrixData.rows[busCounter].elements[
                    desCounter
                  ].duration,
                inTraffic:
                  generatedData.distanceMatrixData.rows[busCounter].elements[
                    desCounter
                  ].duration_in_traffic,
              },
              distance:
                generatedData.distanceMatrixData.rows[busCounter].elements[
                  desCounter
                ].distance,
            });
            desCounter++;
          }
          busCounter++;
          infoData.push(tempData);
          break;
        }
      }
    } else {
      for await (const datum of generatedData.busData) {
        const tempData: InfoWindowData = {
          busData: datum,
          distanceMatrixData: [],
        };
        let desCounter = 0;
        for await (const dest of generatedData.distanceMatrixData
          .destinationAddresses) {
          tempData.distanceMatrixData.push({
            origin:
              generatedData.distanceMatrixData.originAddresses[busCounter],
            destination: dest,
            duration: {
              time:
                generatedData.distanceMatrixData.rows[busCounter].elements[
                  desCounter
                ].duration,
              inTraffic:
                generatedData.distanceMatrixData.rows[busCounter].elements[
                  desCounter
                ].duration_in_traffic,
            },
            distance:
              generatedData.distanceMatrixData.rows[busCounter].elements[
                desCounter
              ].distance,
          });
          desCounter++;
        }
        busCounter++;
        infoData.push(tempData);
      }
    }
    return infoData;
  }

  private generateDistanceMatrix(
    callback: (infoWindowData: InfoWindowData[]) => void,
    busId: string = 'all'
  ) {
    if (this.busData) {
      const distanceMatrix = new google.maps.DistanceMatrixService();
      const originCoordinates: google.maps.LatLng[] = [];
      this.busData.forEach((data) => {
        originCoordinates.push(this.getCoordinates(data.location.coordinates));
      });
      new Promise((resolve) => {
        this.scrollStatus = false;
        distanceMatrix.getDistanceMatrix(
          {
            destinations: [this.defaultCoordinates, this.userCoordinates],
            travelMode: google.maps.TravelMode.DRIVING,
            drivingOptions: {
              departureTime: new Date(),
              trafficModel: google.maps.TrafficModel.BEST_GUESS,
            },
            durationInTraffic: true,
            origins: this.getBusGPS(busId),
          },
          (response, status) => {
            if (status === 'OK') {
              resolve(response);
            }
          }
        );
      }).then((response: google.maps.DistanceMatrixResponse) => {
        this.infoWindowData(response, busId).then((data: InfoWindowData[]) => {
          callback(data);
          this.isTyping = false;
          document.getElementById('scrollToLast').scrollIntoView();
          this.scrollStatus = null;
        });
      });
    }
  }

  private sendToServer(messageBody: string) {
    this.sentToServerData.messages.reply.message = messageBody;
    if (this.sentToServerData.messages.send.message !== '') {
      this.serverService.sendMessage(this.sentToServerData);
    }
  }

  private replyHandler() {
    const specificBusReply = (infoWindowData: InfoWindowData[]) => {
      let messageBody = '';
      infoWindowData.forEach((datum) => {
        messageBody += `<h6>মামা আমি ${datum.distanceMatrixData[1].distance.text} দূরে, `;
        messageBody += `আসতে সময় লাগবে ${datum.distanceMatrixData[1].duration.inTraffic.text}, `;
        messageBody += `এখন আছি ${datum.distanceMatrixData[1].origin}</h6>`;
      });
      document.getElementById('messageData').innerHTML += `
          <div class="chat-bubble received" style="opacity: 100%;">
            ${messageBody}
            <p style="display: inline;">Bus-Mama at ${this.sentToServerData.messages.reply.date}</p>
            <div style="
            margin: 0 5px;
            vertical-align: middle;
            display: inline-block;
            width: 3px;
            height: 3px;
            background-color: #676767;
            border: 1px solid #676767;
            border-radius: 50%;"></div>
            <p style="
            opacity: 1;
            display: inline;
            color: cornflowerblue;
            font-weight: bold;">
            ${this.sentToServerData.messages.tag}
            </p>
          </div>`;
      this.sendToServer(messageBody);
    };
    let _clearInterval;
    new Promise((resolve) => {
      _clearInterval = setInterval(() => {
        if (this.sentToServerData.messages.reply.message !== 'hello') {
          resolve(this.sentToServerData.messages.reply.message);
        }
      }, 1);
    }).then((serverReply: string) => {
      clearInterval(_clearInterval);
      if (serverReply === 'জিপিএসটাইম') {
        this.generateDistanceMatrix((infoWindowData: InfoWindowData[]) => {
          let messageBody = '';
          let counter = 0;
          infoWindowData.forEach((datum) => {
            messageBody += `<h6>${datum.busData.departure.to} এর বাসের ${datum.distanceMatrixData[1].duration.inTraffic.text} সময় লাগবে`;
            if (infoWindowData.length - 1 === counter) {
              messageBody += ' ।</h6>';
            } else {
              messageBody += ', </h6>';
            }
            counter++;
          });
          document.getElementById('messageData').innerHTML += `
          <div class="chat-bubble received" style="opacity: 100%;">
            ${messageBody}
            <p style="display: inline;">Bus-Mama at ${this.sentToServerData.messages.reply.date}</p>
            <div style="
            margin: 0 5px;
            vertical-align: middle;
            display: inline-block;
            width: 3px;
            height: 3px;
            background-color: #676767;
            border: 1px solid #676767;
            border-radius: 50%;"></div>
            <p style="
            opacity: 1;
            display: inline;
            color: cornflowerblue;
            font-weight: bold;">
            ${this.sentToServerData.messages.tag}
            </p>
          </div>`;
          this.sendToServer(messageBody);
        });
      } else if (serverReply === 'জিপিএসলোকেশন') {
        this.generateDistanceMatrix((infoWindowData: InfoWindowData[]) => {
          let messageBody = '';
          let counter = 0;
          infoWindowData.forEach((datum) => {
            messageBody += `<h6>${datum.busData.departure.to} এর বাস এখন আছে ${datum.distanceMatrixData[1].origin}`;
            if (infoWindowData.length - 1 === counter) {
              messageBody += ' ।</h6>';
            } else {
              messageBody += ', </h6>';
            }
            counter++;
          });
          document.getElementById('messageData').innerHTML += `
          <div class="chat-bubble received" style="opacity: 100%;">
            ${messageBody}
            <p style="display: inline;">Bus-Mama at ${this.sentToServerData.messages.reply.date}</p>
            <div style="
            margin: 0 5px;
            vertical-align: middle;
            display: inline-block;
            width: 3px;
            height: 3px;
            background-color: #676767;
            border: 1px solid #676767;
            border-radius: 50%;"></div>
            <p style="
            opacity: 1;
            display: inline;
            color: cornflowerblue;
            font-weight: bold;">
            ${this.sentToServerData.messages.tag}
            </p>
          </div>`;
          this.sendToServer(messageBody);
        });
      } else if (serverReply === 'জিপিএসডিস্টেন্স') {
        this.generateDistanceMatrix((infoWindowData: InfoWindowData[]) => {
          let messageBody = '';
          infoWindowData.forEach((datum) => {
            messageBody += `<h6>${datum.busData.departure.to} এর বাস ${datum.distanceMatrixData[1].distance.text} দূরে</h6>`;
          });
          document.getElementById('messageData').innerHTML += `
          <div class="chat-bubble received" style="opacity: 100%;">
            ${messageBody}
            <p style="display: inline;">Bus-Mama at ${this.sentToServerData.messages.reply.date}</p>
            <div style="
            margin: 0 5px;
            vertical-align: middle;
            display: inline-block;
            width: 3px;
            height: 3px;
            background-color: #676767;
            border: 1px solid #676767;
            border-radius: 50%;"></div>
            <p style="
            opacity: 1;
            display: inline;
            color: cornflowerblue;
            font-weight: bold;">
            ${this.sentToServerData.messages.tag}
            </p>
          </div>`;
          this.sendToServer(messageBody);
        });
      } else if (serverReply === '#০০১') {
        this.generateDistanceMatrix((infoWindowData: InfoWindowData[]) => {
          specificBusReply(infoWindowData);
        }, '০০১');
      } else if (serverReply === '#০০২') {
        this.generateDistanceMatrix((infoWindowData: InfoWindowData[]) => {
          specificBusReply(infoWindowData);
        }, '০০২');
      } else if (serverReply === '#০০৩') {
        this.generateDistanceMatrix((infoWindowData: InfoWindowData[]) => {
          specificBusReply(infoWindowData);
        }, '০০৩');
      } else if (serverReply === '#০০৪') {
        this.generateDistanceMatrix((infoWindowData: InfoWindowData[]) => {
          specificBusReply(infoWindowData);
        }, '০০৪');
      } else if (serverReply === '#০০৫') {
        this.generateDistanceMatrix((infoWindowData: InfoWindowData[]) => {
          specificBusReply(infoWindowData);
        }, '০০৫');
      } else if (serverReply === '#০০৬') {
        this.generateDistanceMatrix((infoWindowData: InfoWindowData[]) => {
          specificBusReply(infoWindowData);
        }, '০০৬');
      } else {
        this.generateDistanceMatrix((infoWindowData: InfoWindowData[]) => {
          const messageBody = this.sentToServerData.messages.reply.message;
          document.getElementById('messageData').innerHTML += `
          <div class="chat-bubble received" style="opacity: 100%;">
            <h6>${messageBody}</h6>
            <p style="display: inline;">Bus-Mama at ${this.sentToServerData.messages.reply.date}</p>
            <div style="
            margin: 0 5px;
            vertical-align: middle;
            display: inline-block;
            width: 3px;
            height: 3px;
            background-color: #676767;
            border: 1px solid #676767;
            border-radius: 50%;"></div>
            <p style="
            opacity: 1;
            display: inline;
            color: cornflowerblue;
            font-weight: bold;">
            ${this.sentToServerData.messages.tag}
            </p>
          </div>`;
          this.sendToServer(messageBody);
        });
      }
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
          <h6>${message.reply.message}</h6>
          <p style="display: inline;">
            Bus-Mama at ${this.chatService.dateTimeParser}
            </p>
            <div style="
            margin: 0 5px;
            vertical-align: middle;
            display: inline-block;
            width: 3px;
            height: 3px;
            background-color: #676767;
            border: 1px solid #676767;
            border-radius: 50%;"></div>
            <p style="
            opacity: 1;
            display: inline;
            color: cornflowerblue;
            font-weight: bold;">
            ${message.tag}
            </p>
        </div>
        `;
    });
  }
}
