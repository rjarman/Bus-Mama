import {Message} from "./message";
/*
name: string;
    profilePhoto: string;
    messageType: string;
    message: string;
    date: string;
    time: string;

*/


var today =  new Date()

export const MESSAGES: Message[] = [
    {
        name: 'Rafsun',
        profilePhoto: '../../assets/profile/rafsun.JPG',
        messageType: 'send',
        message: 'Finedffdfsdfsaddsfgsdfsgrdfedgwrtgefedgfbrgfhgdgbdsffgeegwefawegtrgvwrfverwrerwte ert ererfewrf!',
        date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
        time: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    },
    {
        name: 'Adeeb',
        profilePhoto: '../../assets/profile/rafsun.JPG',
        messageType: 'received',
        message: 'Hi!',
        date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
        time: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    },
    {
        name: 'Rafsun',
        profilePhoto: '../../assets/profile/rafsun.JPG',
        messageType: 'send',
        message: 'How are you ?',
        date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
        time: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    },
    {
        name: 'Adeeb',
        profilePhoto: '../../assets/profile/rafsun.JPG',
        messageType: 'received',
        message: 'Fine',
        date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
        time: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    },
    {
        name: 'Rafsun',
        profilePhoto: '../../assets/profile/rafsun.JPG',
        messageType: 'send',
        message: 'How are you ?',
        date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
        time: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    },
    {
        name: 'Adeeb',
        profilePhoto: '../../assets/profile/rafsun.JPG',
        messageType: 'received',
        message: 'Finedffdfsdfsaddsfgsdfsgrdfedgwrtgefedgfbrgfhgdgbdsffgeegwefawegtrgvwrfverwrerwte ert ererfewrf',
        date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
        time: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    },
    {
        name: 'Rafsun',
        profilePhoto: '../../assets/profile/rafsun.JPG',
        messageType: 'send',
        message: 'How are you ?',
        date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
        time: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    },
    {
        name: 'Adeeb',
        profilePhoto: '../../assets/profile/rafsun.JPG',
        messageType: 'received',
        message: 'Finedffdfsdfsaddsfgsdfsgrdfedgwrtgefedgfbrgfhgdgbdsffgeegwefawegtrgvwrfverwrerwte ert ererfewrf',
        date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
        time: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    },
    {
        name: 'Rafsun',
        profilePhoto: '../../assets/profile/rafsun.JPG',
        messageType: 'send',
        message: 'How are you ?',
        date: today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate(),
        time: today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    }
]
