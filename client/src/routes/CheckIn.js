import React, { useState } from "reactn";
import { Switch, Route } from "react-router-dom";
import { Container, CssBaseline } from "@material-ui/core";

// Styles
import '../styles/CheckIn/CheckIn.scss';

// Components
import { Editor } from "../components/CheckIn/Editor";
import { Login } from "../components/CheckIn/Login";
import { Alert } from "../components/Alert";

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
	const [checkins, setCheckins] = useState([]);

	return (
		<>
			<Container component="main" maxWidth="sm" className="CheckIn">
				<CssBaseline />
				<Switch>
					<Route path="/checkin/register">
						<Editor {...{ group, setGroup, setAlert }} />
					</Route>
					<Route path="/checkin">
						<Login />
					</Route>
				</Switch>
			</Container>
			{alert && <Alert {...{ alert, setAlert }} />}
		</>
	);
};
