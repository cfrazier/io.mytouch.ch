import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, useParams } from "react-router-dom";
import useInterval from "use-interval";
import httpFetch from "./services/http";

import "./styles/App.scss";

const App = () => {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route path="/kiosk/:organizationId">
						<Kiosk />
					</Route>
					<Route path="/">Please log in to the admin to get started...</Route>
				</Switch>
			</Router>
		</div>
	);
};

export default App;

export const Kiosk = (props) => {
	const { organizationId } = useParams();
	const [venues, setVenues] = useState();

	const clientURL = new URL(process.env.PUBLIC_URL, window.location.href);
	const { hostname } = clientURL;
	const serverURL = `https://${hostname}`;

	const updateOrganization = () => {
		if (organizationId) {
			httpFetch(
				"get",
				`/api/organizations/${organizationId}/venues`,
				null,
				(error, response) => {
					if (error) return console.log(error);
					if (response.error) return console.log(response.error);
					setVenues(response);
				}
			);
		}
	};

	useInterval(updateOrganization, 5000);

	return (
		<div className="Kiosk">
			{venues ? (
				<div className="Active">
					<table>
						<thead>
							<tr>
								<th className="Name">Check in at {serverURL}/checkin</th>
								<th className="Code">Code</th>
								<th className="Available">Available</th>
							</tr>
						</thead>
						<tbody>
							{venues.map((venue) => (
								<tr key={`venue_${venue._id}`} className="Venue">
									<td>
										<div className="Name">{venue.name}</div>
										<div className="Description">{venue.description}</div>
									</td>
									<td>{venue.code.toUpperCase()}</td>
									<td>
										<div
											className="Badge"
											style={{ backgroundColor: venue.color }}
										>
											{venue.available}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="Loading">Loading</div>
			)}
		</div>
	);
};
