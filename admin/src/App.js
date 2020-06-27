import React from "reactn";
import "./styles/App.scss";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Admin from "./components/Admin";
import Modal from "./components/Modal";
import Login from "./components/Login";
import Register from "./components/Register";
import Onboard from "./components/Onboard";

const App = () => {
	return (
		<Router>
			<CssBaseline />
			<Switch>
				<Route path="/admin/dashboard">
					<Admin />
				</Route>
				<Route path="/admin/register">
					<Register />
				</Route>
				<Route path="/admin/onboard">
					<Onboard />
				</Route>
				<Route path="/admin">
					<Login />
				</Route>
			</Switch>
			<Modal />
		</Router>
	);
};

export default App;
