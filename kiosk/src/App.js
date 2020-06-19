import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, useParams } from "react-router-dom";
import useInterval from "use-interval";
import httpFetch from "./services/http";

import "./styles/App.scss";

const App = () => {
	return (
		<Router className="App">
			<Switch>
				<Route path="/kiosk/:organizationId">
					<Kiosk />
				</Route>
				<Route path="/">Please log in to the admin to get started...</Route>
			</Switch>
		</Router>
	);
};

export default App;

const Kiosk = (props) => {
	const { organizationId } = useParams();
	const [organization, setOrganization] = useState();

	useEffect(() => {});

	const updateOrganization = () => {
		if (organizationId) {
			httpFetch("get", `/api/organization/${organizationId}/venues`)
		}
	}
	return <div className="Kiosk">{organizationId}</div>;
};
