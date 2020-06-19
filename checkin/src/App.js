import React, { useState } from "reactn";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Container, CssBaseline } from "@material-ui/core";

// Styles
import "./styles/CheckIn.scss";

// Components
import { Account } from "./components/Account";
import { Login } from "./components/Login";
import { Alert } from "./components/Alert";
import { Manage } from "./components/Manage";

const App = () => {
	// State
	const [group, setGroup] = useState({
		name: "",
		phone: "",
		email: "",
		pin: "    ",
		people: [{ name: "", birthdate: "" }],
	});

	const [alert, setAlert] = useState();

	return (
		<Router className="App">
			<Container component="main" maxWidth="sm" className="CheckIn">
				<CssBaseline />
				<Switch>
					<Route path="/checkin/account">
						<Account {...{ group, setGroup, setAlert }} />
					</Route>
					<Route path="/checkin/manage">
						<Manage {...{ group, setGroup, setAlert }} />
					</Route>
					<Route path="/checkin">
						<Login {...{ setGroup, setAlert }} />
					</Route>
					<Route path="/">
						<Redirect to="/checkin" />
					</Route>
				</Switch>
			</Container>
			{alert && <Alert {...{ alert, setAlert }} />}
		</Router>
	);
};

export default App;
