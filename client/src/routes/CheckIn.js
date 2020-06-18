import React, { useState } from "reactn";
import { Switch, Route } from "react-router-dom";
import { Container, CssBaseline } from "@material-ui/core";

// Styles
import "../styles/CheckIn/CheckIn.scss";

// Components
import { Account } from "../components/CheckIn/Account";
import { Login } from "../components/CheckIn/Login";
import { Alert } from "../components/Alert";
import { Manage } from "../components/CheckIn/Manage";

export const CheckIn = () => {
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
		<>
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
				</Switch>
			</Container>
			{alert && <Alert {...{ alert, setAlert }} />}
		</>
	);
};
