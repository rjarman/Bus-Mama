var today =  new Date();

const userMessageCollection = 'user_messages';
const busMessageCollection = 'bus_messages';
const chatCollection = 'all_chat'

const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require('mongodb');

const app = express();

// database
const dbURL_Online = 'mongodb+srv://rafsun:2dLmTv11sHBcLNvb@cluster0-vcndv.gcp.mongodb.net/test?retryWrites=true&w=majority'
const dbURL_Local = 'mongodb://127.0.0.1:27017/';
const mongoClient = mongodb.MongoClient;

function addMessage(message, collectionName){
    mongoClient.connect(dbURL_Online, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        if(err){
            console.log("(send)database not connected!");
            return;
        }else {
            console.log('connected!')
        }
        const db = client.db('Bus_Mama');

        const collection = db.collection(collectionName);
        collection.insertOne(message, (err, result) => {
            if(err){
                console.log('failed!');
            }else{
                console.log('ok! ');
            }
        });
        client.close();
    });
}

function joinCollections(userMessage, busMessage, reply){

    busMessage.userInfo.name = 'Bus Mama';
    busMessage.chatInfo.messageType = 'received';
    busMessage.chatInfo.message = reply;

    const combined = {
        user: userMessage,
        reply: busMessage
    }

    addMessage(combined, userMessageCollection);
}

// app.use((req, res, next) => {
//     console.log("1st middleware");
//     next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    next();
});

app.post("/tabs/tabs/chat/userSendMessage", (req, res, next) => {
    const sentMessage = req.body;
    const replyMessage = JSON.parse(JSON.stringify(sentMessage));

    const message = 'Thank you for texting me!';

    joinCollections(sentMessage, replyMessage, message);
    res.status(201).json({
        message: message
    });
});

app.use("/tabs/tabs/list", (req, res, next) => {
    const buses = [
        {
            busNumber: '01',
            latitude: 28.6117993,
            longitude: 77.2194934,
            departureFrom: 'BSMRSTU',
            departureTo: 'Nobinbag',
            departureTime: '10am',
            image: '../../assets/buses/1.jpg',
            description: 'A bus (contracted from omnibus, with variants multibus, motorbus, autobus, etc.) is....'
        },
        {
            busNumber: '02',
            latitude: 28.6132098,
            longitude: 77.245437,
            departureFrom: 'BSMRSTU',
            departureTo: 'Nobinbag',
            departureTime: '10am',
            image: '../../assets/buses/1.jpg',
            description: 'A bus (contracted from omnibus, with variants multibus, motorbus, autobus, etc.) is....'
        },
        {
            busNumber: '03',
            latitude: 21.1699005,
            longitude: 72.7955734,
            departureFrom: 'BSMRSTU',
            departureTo: 'Nobinbag',
            departureTime: '10am',
            image: '../../assets/buses/1.jpg',
            description: 'A bus (contracted from omnibus, with variants multibus, motorbus, autobus, etc.) is....'
        },
        {
            busNumber: '04',
            latitude: 32.2263696,
            longitude: 76.325326,
            departureFrom: 'BSMRSTU',
            departureTo: 'Nobinbag',
            departureTime: '10am',
            image: '../../assets/buses/1.jpg',
            description: 'A bus (contracted from omnibus, with variants multibus, motorbus, autobus, etc.) is....'
        },
        {
            busNumber: '05',
            latitude: 18.926873,
            longitude: 72.8326132,
            departureFrom: 'BSMRSTU',
            departureTo: 'Nobinbag',
            departureTime: '10am',
            image: '../../assets/buses/1.jpg',
            description: 'A bus (contracted from omnibus, with variants multibus, motorbus, autobus, etc.) is....'
        },
        {
            busNumber: '06',
            latitude: 27.315948,
            longitude: 88.6047829,
            departureFrom: 'BSMRSTU',
            departureTo: 'Nobinbag',
            departureTime: '10am',
            image: '../../assets/buses/1.jpg',
            description: 'A bus (contracted from omnibus, with variants multibus, motorbus, autobus, etc.) is....'
        }
    ];
    res.status(200).json({
        message: "data fetched successfully!",
        busList: buses
    });
});

app.use("/tabs/tabs/chat", (req, res, next) => {
    
    mongoClient.connect(dbURL_Online, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        if(err){
            console.log("(read)database not connected!");
            return;
        }else {
            console.log('connected!')
        }
        client.db('Bus_Mama').collection(userMessageCollection).find().toArray((err, result) => {
            if(err){
                console.log("error in reading data");
                return;
            }else {
                console.log('data read!')
            }
            res.status(200).json({
                status: "successfully fetched messages!",
                data: result
            });
            // a = result;
            
        });
        client.close();
    });

    
});

app.use("/tabs/tabs/drawer", (req, res, next) => {
    const userDrawerData = {
        userName: 'Rafsun Jany Arman',
        email: 'armanrafsunjany@gmail.com',
        photo: '../../assets/profile/rafsun.JPG',
        coverPhoto: '../../assets/buses/1.jpg'
    };

    res.status(200).json({
        status: 'success!',
        data: userDrawerData
    });
});

// Hardware API

app.post("/setGPS", (req, res, next) => {
    console.log(req.body.gps);
    res.status(200).json({
        status: "bus data added!",
        data: req.body
    });
});

module.exports = app;