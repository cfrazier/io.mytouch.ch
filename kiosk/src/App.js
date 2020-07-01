import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, useParams } from "react-router-dom";
import useInterval from "use-interval";
import httpFetch from "./services/http";

import "./styles/App.scss";

const App = () => {
	const clientURL = new URL(process.env.PUBLIC_URL, window.location.href);
	const { hostname } = clientURL;
	const serverURL = `https://${hostname}`;
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route path="/kiosk/organizations/:organizationId/venues/:venueId">
						<VenueKiosk />
					</Route>
					<Route path="/kiosk/organizations/:organizationId">
						<OrganizationKiosk />
					</Route>
					<Route path="/kiosk/:organizationId">
						<OrganizationKiosk />
					</Route>
					<Route path="/">Please log in to the admin to get started...</Route>
				</Switch>
			</Router>
			<div className="Notice">Get started at {serverURL}</div>
		</div>
	);
};

export default App;

export const OrganizationKiosk = (props) => {
	const { organizationId } = useParams();
	const [venues, setVenues] = useState();

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
		<div className="OrganizationKiosk">
			{venues ? (
				<div className="Active">
					<table>
						<tbody>
							{venues.map(
								(venue) =>
									!venue.hidden && (
										<tr key={`venue_${venue._id}`} className="Venue">
											<td className="Main">
												<div className="Name">{venue.name}</div>
												<div className="Description">
													{venue.description}
												</div>
											</td>
											<td className="Code">{venue.code.toUpperCase()}</td>
											<td className="Available">
												<div
													className="Badge"
													style={{ backgroundColor: venue.color }}
												>
													{venue.available}
												</div>
											</td>
										</tr>
									)
							)}
						</tbody>
					</table>
				</div>
			) : (
				<div className="Loading">Loading</div>
			)}
		</div>
	);
};

export const VenueKiosk = (props) => {
	const { organizationId, venueId } = useParams();
	const [venue, setVenue] = useState();

	const updateOrganization = () => {
		if (organizationId) {
			httpFetch(
				"get",
				`/api/organizations/${organizationId}/venues/${venueId}`,
				null,
				(error, response) => {
					if (error) return console.log(error);
					if (response.error) return console.log(response.error);
					setVenue(response);
				}
			);
		}
	};

	useInterval(updateOrganization, 5000);

	return (
		<div className="VenueKiosk">
			{venue ? (
				<div className="Kiosk">
					<div className="Available" style={{ backgroundColor: venue.color }}>
						{venue.available}
					</div>
					<div className="Meta">
						<div className="Name">{venue.name}</div>
						<div className="Description">{venue.description}</div>
						<div className="Code">{venue.code.toUpperCase()}</div>
						<div className="Caption">Venue Code</div>
					</div>
				</div>
			) : (
				<div className="Loading">Loading</div>
			)}
		</div>
	);
};
