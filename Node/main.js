
const express = require("express");	// Express is for easy server setup.
const WebSocket = require("ws");	// Websocket library.
const request = require("request");	// HTTP library.
const app = express();
const server_port = 8080;

app.use(express.json());

sensor_server = "localhost:8000";	// Whatever this will be.

// const ws = new WebSocket("ws://" + sensor_server, {});	// No WS server at the moment.

var temp = []

/*ws.on("message", function incoming(data) {
	temp.push(data);
	console.log("Received WS:", data);
});*/

app.get("/", (req, res) => res.send("Hello there!\n" + temp))
app.post("/data", (req, res) => {
	temp.push(req.body.data);
	console.log("Received POST:", req.body.data);
	res.status(200).send()
});

// This is from https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
// Use this 
	/*request('http://url', { json: true }, (err, res, body) => {
	  if (err) { return console.log(err); }
	  console.log(body.url);
	  console.log(body.explanation);
	});*/

app.listen(server_port, () => console.log("Running on port " + server_port))
