const http = require("http");
const app = require("./app");

const port = process.env.PORT || 3000;

app.set('port', port);

const server = http.createServer(app);

// const server = http.createServer((req, res) => {
//     res.end('hello');
// });

server.listen(port);