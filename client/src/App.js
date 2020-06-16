import React from "reactn";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Primary Routes
import { Admin } from "./routes/Admin";
import { Home } from "./routes/Home";
import { CheckIn } from "./routes/CheckIn";
import { Kiosk } from "./routes/Kiosk";
import { Group } from "./routes/Group";
import { CssBaseline } from "@material-ui/core";

const App = () => {
	return (
		<Router className="App">
			<CssBaseline />
			<Switch>
				<Route path="/admin">
					<Admin />
				</Route>
				<Route path="/group">
					<Group />
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
