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
    messages: [Message];
}


/**
 * @category Bus interfaces
 */

 interface Location {
    coordinates?: [number];
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
