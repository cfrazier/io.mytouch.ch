import React, { useGlobal, useState, useEffect } from "reactn";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Container } from "@material-ui/core";

// Primary Routes
import { Admin } from "./routes/Admin";
import { Home } from "./routes/Home";
import { CheckIn } from "./routes/CheckIn";
import { Kiosk } from "./routes/Kiosk";
import { Registration } from "./routes/Registration";

const App = () => {
	return (
		<Router className="App">
			<Switch>
				<Route path="/admin">
					<Admin />
				</Route>
				<Route path="/register">
					<Registration />
				</Route>
				<Route path="/checkin">
					<CheckIn />
				</Route>
				<Route path="/kiosk">
					<Kiosk />
				</Route>
				<Route path="/">
					<Home />
				</Route>
			</Switch>
		</Router>
	);
};

export default App;
