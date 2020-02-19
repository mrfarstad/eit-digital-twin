
const express = require("express");	// Express is for easy server setup.
const WebSocket = require("ws");	// Websocket library.
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

app.listen(server_port, () => console.log("Running on port " + server_port))
