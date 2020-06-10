import React, { useGlobal, useState, useEffect } from "reactn";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
	Container
} from "@material-ui/core";

const App = () => {
	const [user] = useGlobal("user");
	const [ws] = useGlobal("ws");

	useEffect(() => {
		ws.on("doSomething", (data) => { console.log(data) });
	}, []);

	useEffect(() => {
		ws.emit("action", { thing: true });
		console.log(user);
	}, [user]);

	return (
		<div className="App">
			<Router>
				<Container>
					{user.name}
					<MyButton></MyButton>
				</Container>
			</Router>
		</div>
	);
}

const MyButton = () => {
	const [user, setUser] = useGlobal("user");
	const changeUser = () => {
		setUser({
			name: "Donald Sutherland"
		});
	}
	return (
		<button onClick={changeUser}>Click me!</button>
	)
}

export default App;
