import React from "react";
import "./styles/App.scss";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard";

const App = () => {
	return (
		<Router className="App">
			<CssBaseline />
			<Switch>
				<Route path="/admin/dashboard">
					<Dashboard />
				</Route>
				<Route path="/admin/register">Set up a new account</Route>
				<Route path="/admin">Login</Route>
			</Switch>
		</Router>
	);
};

export default App;
