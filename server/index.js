const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const mongoose = require("mongoose");
const path = require("path");
const socketIO = require("socket.io");

const Routes = require("./routes");
const { User } = require("../lib/models/user");

const config = require("../config.json");

const main = () => {
	// Set up the database
	const db = initDB();

	// Start everything else once the DB is initialized
	db.once("open", () => {
		// Set up the web server app
		const app = initHTTP();
		// Set up routing
		initRoutes(app);
	});
};

// Set up the basic web server with HTTPS
const initHTTP = (callback) => {
	// Create the Express app
	const app = express();
	const { port, hostname, ssl } = config.server;

	// Get CORS out of the way
	app.use(
		cors({
			origin: [new RegExp(`${config.server.hostname}(\:[0-9]+)?`)],
			credentials: true,
		})
	);

	// support json encoded bodies
	app.use(
		bodyParser.json({
			limit: "10mb",
			extended: true,
		})
	);
	app.use(cookieParser());

	// support encoded bodies
	app.use(
		bodyParser.urlencoded({
			extended: true,
		})
	);

	// Only set up the HTTPS server if it's explicitly set to avoid issues
	const server = config.server.https
		? https.createServer(
				{
					key: fs.readFileSync(
						path.join(__dirname) + `/../${ssl.keyPath}`
					),
					cert: fs.readFileSync(
						path.join(__dirname) + `/../${ssl.certPath}`
					),
				},
				app
		  )
		: http.createServer(app);

	// Set up the WebSocket connection
	const wss = socketIO(server);

	wss.on("connection", (ws) => {
		console.log("WebSocket connection started.");

		// Set up WS actions
		ws.on("action", (data) => {
			console.log("Doing action");
		});
	});

	wss.on("disconnect", () => {
		console.log("Client disconnected");
	});

	server.listen(port, () => {
		console.log(
			`Server listening on port ${port}! Go to ${
				config.server.https ? "https" : "http"
			}://${hostname}:${port}/`
		);
	});

	// Return the express application
	return app;
};

// Set up the connection to the database
const initDB = () => {
	// Make a connection to MongoDB
	mongoose.connect(config.db.url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	});

	// Create an async connection
	const db = mongoose.connection;

	// Log once we're connected
	db.once("open", () => {
		console.log("Database connection established");
		// Check for an existing user and organization
		User.findOne({}, (error, result) => {
			if (error)
				return console.log(
					"An error occurred while confirming the database connection."
				);
			// Create a new user in the DB so we can log in
			if (!result) {
				const newUser = new User(config.default.user);
				newUser.save((error, user) => {
					if (error)
						return console.log(
							"An error occurred initializing the database."
						);
					console.log("Database initialized with user");
					// Let's create the default organization now
					const newOrg = new Organization(
						config.default.organization
					);
					newOrg.users.push(newUser._id);
					newOrg.save();
				});
			}
		});
	});

	// Return the DB connection
	return db;
};

const initRoutes = (app) => {
	// Set up the authenticator middleware
	app.use(Routes.user.authenticate);

	// Set up the front-end static client
	app.use(express.static(path.join(__dirname, "/../client/build")));

	// Set up routing
	app.post("/api/organizations/:organizationId/users", Routes.user.create);
	app.get("/api/users/:userId", Routes.user.read);
	app.put("/api/users/:userId", Routes.user.update);
	app.delete("/api/users/:userId", Routes.user.delete);
	app.get("/api/users/reset", Routes.user.resetPassword);

	// Default static files
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname + "/../client/build/index.html"));
	});
};

main();
