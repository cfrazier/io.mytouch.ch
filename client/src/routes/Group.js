import React, { useState, useEffect } from "reactn";
import { Switch, Route } from "react-router-dom";
import { Container } from "@material-ui/core";

// Services
import httpFetch from "../services/http";

// Components
import { GroupEditor } from "../components/GroupEditor";

export const Group = () => {
	return (
		<Switch>
			<Route path="/group/create">
				<Create />
			</Route>
			<Route path="/group/update">
				<Update />
			</Route>
			<Route path="/group">
				<Container>
					<h1>Group Home</h1>
				</Container>
			</Route>
		</Switch>
	);
};

export const Create = () => {
	const [group, setGroup] = useState({
		name: "",
		phone: "",
		email: "",
		pin: "    ",
		people: [{ name: "", birthdate: "" }],
	});

	useEffect(() => {
		console.log(group);
	}, [group]);

	return (
		<Container className="Create">
			<GroupEditor {...{ group, setGroup }} />
		</Container>
	);
};

export const Update = () => {
	const [group, setGroup] = useState({
		name: "",
		phone: "",
		email: "",
		pin: "",
		people: [{ name: "", birthdate: "" }],
	});

	console.log(group);
	return (
		<Container className="Create">
			<GroupEditor {...{ group, setGroup }} />
		</Container>
	);
};
