interface Bus {
  busNumber: string;
  latitude: number;
  longitude: number;
  departureFrom: string;
  departureTo: string;
  departureTime: string;
  image: string;
  description: string;
}

const BUSES: Bus[] = [
  {
    busNumber: '01',
    latitude: 28.6117993,
    longitude: 77.2194934,
    departureFrom: 'BSMRSTU',
    departureTo: 'Nobinbag',
    departureTime: '10am',
    image: '../../assets/buses/1.jpg',
    description:
      'A bus (contracted from omnibus, with variants multibus, motorbus, autobus, etc.) is....',
  },
  {
    busNumber: '02',
    latitude: 28.6132098,
    longitude: 77.245437,
    departureFrom: 'BSMRSTU',
    departureTo: 'Nobinbag',
    departureTime: '10am',
    image: '../../assets/buses/1.jpg',
    description:
      'A bus (contracted from omnibus, with variants multibus, motorbus, autobus, etc.) is....',
  },
  {
    busNumber: '03',
    latitude: 21.1699005,
    longitude: 72.7955734,
    departureFrom: 'BSMRSTU',
    departureTo: 'Nobinbag',
    departureTime: '10am',
    image: '../../assets/buses/1.jpg',
    description:
      'A bus (contracted from omnibus, with variants multibus, motorbus, autobus, etc.) is....',
  },
  {
    busNumber: '04',
    latitude: 32.2263696,
    longitude: 76.325326,
    departureFrom: 'BSMRSTU',
    departureTo: 'Nobinbag',
    departureTime: '10am',
    image: '../../assets/buses/1.jpg',
    description:
      'A bus (contracted from omnibus, with variants multibus, motorbus, autobus, etc.) is....',
  },
  {
    busNumber: '05',
    latitude: 18.926873,
    longitude: 72.8326132,
    departureFrom: 'BSMRSTU',
    departureTo: 'Nobinbag',
    departureTime: '10am',
    image: '../../assets/buses/1.jpg',
    description:
      'A bus (contracted from omnibus, with variants multibus, motorbus, autobus, etc.) is....',
  },
  {
    busNumber: '06',
    latitude: 27.315948,
    longitude: 88.6047829,
    departureFrom: 'BSMRSTU',
    departureTo: 'Nobinbag',
    departureTime: '10am',
    image: '../../assets/buses/1.jpg',
    description:
      'A bus (contracted from omnibus, with variants multibus, motorbus, autobus, etc.) is....',
  },
];

interface Dummy {
  message: string;
  busList: Bus[];
}

/**
 * @category Profile interfaces
 */

export interface Message {
  _id: string;
  send: {
    date?: string;
    message: string;
  };
  reply?: {
    date?: string;
    message: string;
  };
  tag?: string;
}

export interface Profile {
  email: string;
  name: string;
  image: string;
  messages: Message[];
}

/**
 * @category Bus interfaces
 */

interface Location {
  coordinates?: number[];
}

interface Departure {
  from?: string;
  to?: string;
  startTime?: string;
  endTime?: string;
}

export interface BusInterface {
  busId: string;
  location: Location;
  gpsTime: number;
  departure: Departure;
  image: string;
  description: string;
}

/**
 * @category GPS interfaces
 */

export interface GPS {
  latitude: number;
  longitude: number;
}

/**
 * @category MapGeneratedData interfaces
 */

export interface MapGeneratedData {
  busData: BusInterface[];
  distanceMatrixData: google.maps.DistanceMatrixResponse;
}

interface ValueFormat {
  text: string;
  value: number;
}

interface MatrixData {
  origin: string;
  destination: string;
  distance: ValueFormat;
  duration: {
    time: ValueFormat;
    inTraffic: ValueFormat;
  };
}
export interface InfoWindowData {
  busData: BusInterface;
  distanceMatrixData: MatrixData[];
}

// interface Message {
//   name: string;
//   profilePhoto: string;
//   messageType: string;
//   message: string;
//   date: string;
//   time: string;
// }
// /*
// name: string;
//     profilePhoto: string;
//     messageType: string;
//     message: string;
//     date: string;
//     time: string;

// */

// var today = new Date();

// export const MESSAGES: Message[] = [
//   {
//     name: 'Rafsun',
//     profilePhoto: '../../assets/profile/rafsun.JPG',
//     messageType: 'send',
//     message:
//       'Finedffdfsdfsaddsfgsdfsgrdfedgwrtgefedgfbrgfhgdgbdsffgeegwefawegtrgvwrfverwrerwte ert ererfewrf!',
//     date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
//     time:
//       today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
//   },
//   {
//     name: 'Adeeb',
//     profilePhoto: '../../assets/profile/rafsun.JPG',
//     messageType: 'received',
//     message: 'Hi!',
//     date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
//     time:
//       today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
//   },
//   {
//     name: 'Rafsun',
//     profilePhoto: '../../assets/profile/rafsun.JPG',
//     messageType: 'send',
//     message: 'How are you ?',
//     date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
//     time:
//       today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
//   },
//   {
//     name: 'Adeeb',
//     profilePhoto: '../../assets/profile/rafsun.JPG',
//     messageType: 'received',
//     message: 'Fine',
//     date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
//     time:
//       today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
//   },
//   {
//     name: 'Rafsun',
//     profilePhoto: '../../assets/profile/rafsun.JPG',
//     messageType: 'send',
//     message: 'How are you ?',
//     date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
//     time:
//       today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
//   },
//   {
//     name: 'Adeeb',
//     profilePhoto: '../../assets/profile/rafsun.JPG',
//     messageType: 'received',
//     message:
//       'Finedffdfsdfsaddsfgsdfsgrdfedgwrtgefedgfbrgfhgdgbdsffgeegwefawegtrgvwrfverwrerwte ert ererfewrf',
//     date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
//     time:
//       today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
//   },
//   {
//     name: 'Rafsun',
//     profilePhoto: '../../assets/profile/rafsun.JPG',
//     messageType: 'send',
//     message: 'How are you ?',
//     date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
//     time:
//       today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
//   },
//   {
//     name: 'Adeeb',
//     profilePhoto: '../../assets/profile/rafsun.JPG',
//     messageType: 'received',
//     message:
//       'Finedffdfsdfsaddsfgsdfsgrdfedgwrtgefedgfbrgfhgdgbdsffgeegwefawegtrgvwrfverwrerwte ert ererfewrf',
//     date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
//     time:
//       today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
//   },
//   {
//     name: 'Rafsun',
//     profilePhoto: '../../assets/profile/rafsun.JPG',
//     messageType: 'send',
//     message: 'How are you ?',
//     date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
//     time:
//       today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
//   },
// ];
