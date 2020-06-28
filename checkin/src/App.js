import React, { useState } from "reactn";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Container, CssBaseline } from "@material-ui/core";

// Styles
import "./styles/CheckIn.scss";

// Components
import { Account } from "./components/Account";
import { Login } from "./components/Login";
import { Manage } from "./components/Manage";
import Modal from "./components/Modal";

const App = () => {
	// State
	const [group, setGroup] = useState({
		name: "",
		phone: "",
		email: "",
		pin: "    ",
		people: [{ name: "", birthdate: "" }],
	});

	return (
		<Router className="App">
			<Container component="main" maxWidth="sm" className="CheckIn">
				<CssBaseline />
				<Switch>
					<Route path="/checkin/account">
						<Account {...{ group, setGroup }} />
					</Route>
					<Route path="/checkin/manage">
						<Manage {...{ group, setGroup }} />
					</Route>
					<Route path="/checkin">
						<Login {...{ setGroup }} />
					</Route>
					<Route path="/">
						<Redirect to="/checkin" />
					</Route>
				</Switch>
			</Container>
			<Modal />
			<div
				className="Reset"
				onClick={() => {
					setGroup({
						name: "",
						phone: "",
						email: "",
						pin: "    ",
						people: [{ name: "", birthdate: "" }],
					});
					window.location = "/checkin";
				}}
			>
				&nbsp;
			</div>
		</Router>
	);
};

export default App;
