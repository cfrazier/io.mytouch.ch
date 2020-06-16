import React, { useState, useEffect } from "reactn";
import httpFetch from "../services/http";

export const Kiosk = () => {
	const [venue, setVenue] = useState();
	const [errorMessage, setErrorMessage] = useState();

	useEffect(() => {
		httpFetch(
			"get",
			"/api/organizations/5ee29b67f705972be82f742b/venues/5ee6bf3c32aa634c0cb2057d",
			null,
			(error, response) => {
				if (error) {
					console.log(error);
					return setErrorMessage(
						"Something went very, very wrong. Despair!"
					);
				}
				setVenue(response);
			}
		);
	}, []);

	return (
		<div className="Kiosk">
			<h1>Kiosk</h1>
			{venue && <p>{venue.name}</p>}
			{errorMessage && <p>{errorMessage}</p>}
		</div>
	);
};
