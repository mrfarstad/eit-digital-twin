
const express = require("express");	// Express is for easy server setup.
const WebSocket = require("ws");	// Websocket library.
const request = require("request");	// HTTP library.
const app = express();
const server_port = 8080;

app.use(express.json());

const sensor_server = "localhost:8000";	// Whatever this will be.
const graphite_plain = "localhost:2003";

// const ws_source = new WebSocket("ws://" + sensor_server);	// No WS server at the moment.
const ws_graphite = new WebSocket("ws://" + graphite_plain);

var temp = []

const test = [{
	time: "2012-04-23T18:25:43.511Z",
	temperature: 25.5,
	humidity: 20.3
},
{
	time: "2012-04-23T18:25:43.511Z",
	temperature: 25.5,
	humidity: 20.3
}]

const test_path_temp = "test.values.temperature";
const test_path_hum = "test.values.humidity";

/*ws.on("message", function incoming(data) {
	temp.push(data);
	console.log("Received WS:", data);
});*/

app.get("/", (req, res) => res.send("Hello there!\n" + temp))
app.post("/data", (req, res) => {
	temp.push(req.body.data);
	console.log("Received POST:", req.body.data);
	res.status(200).send();
});

app.post("/DOIT", (req, res) => {
	console.log("Received POST: DOIT");
	forward_data(temp);
	res.status(200).send();
});

function forward_data(data) {
	for (var i = 0; i < test.length; ++i) {
		point = test[i]
		ws_graphite.send(test_path_temp + " " + point.temperature + " " + point.time);
		ws_graphite.send(test_path_hum + " " + point.humidity + " " + point.time);
	}
}

// This is from https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
// Use this 
	/*request('http://url', { json: true }, (err, res, body) => {
	  if (err) { return console.log(err); }
	  console.log(body.url);
	  console.log(body.explanation);
	});*/

app.listen(server_port, () => console.log("Running on port " + server_port))
