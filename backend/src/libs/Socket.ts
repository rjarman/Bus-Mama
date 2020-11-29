import { Http2Server } from 'http2';

export class Socket {
  private io: any;
  constructor(private server: Http2Server) {
    this.io = require('socket.io')(server);
    this.initEmit();
  }

  initEmit() {
    this.io.on('connection', (socket: any) => {
      console.log('a user is connected!');
      socket.on('connected person', (data: string) => {
        if (data !== '') {
          console.log(data);
        }
      });
      socket.on('disconnected person', (data: string) => {
        console.log('disconnected: ', data);
      });
      socket.on('disconnect', () => {
        console.log('a user is disconnected!');
      });
    });
  }
}
