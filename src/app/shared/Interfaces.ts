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
