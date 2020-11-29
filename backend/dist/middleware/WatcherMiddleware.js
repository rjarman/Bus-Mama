"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watcher = void 0;
exports.Watcher = function (req, res, next) {
    console.log('From Watcher: ');
    console.log(req.header);
    console.log(req.query);
    if (Object.keys(req.query).length)
        console.log(true);
    else
        console.log(false);
    next();
};
// headers: {
//     host: 'localhost:3000',
//     connection: 'keep-alive',
//     pragma: 'no-cache',
//     'cache-control': 'no-cache',
//     'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
//     accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
//     'sec-fetch-site': 'same-origin',
//     'sec-fetch-mode': 'no-cors',
//     'sec-fetch-dest': 'image',
//     referer: 'http://localhost:3000/',
//     'accept-encoding': 'gzip, deflate, br',
//     'accept-language': 'en-US,en;q=0.9,bn;q=0.8,hi;q=0.7',
//     cookie: '_isUserLogin=true'
//   }
