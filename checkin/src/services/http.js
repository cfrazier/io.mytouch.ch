const clientURL = new URL(process.env.PUBLIC_URL, window.location.href);
const { hostname } = clientURL;
const serverURL = `https://${hostname}`;
const options = {
	mode: "cors", // no-cors, *cors, same-origin
	cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
	credentials: "include", // include, *same-origin, omit
	headers: {
		"Content-Type": "application/json",
		//'Content-Type': 'application/x-www-form-urlencoded'
	},
	redirect: "follow", // manual, *follow, error
	referrerPolicy: "no-referrer", // no-referrer, *client
};

const httpFetch = (method, route, objBody, callback) => {
	// Set up the JSON body
	const body = objBody ? JSON.stringify(objBody) : null;
	// Send out the request
	fetch(serverURL + route, { ...options, method, body })
		.then((response) => {
			// JSONify the response
			response.json().then((data) => {
				callback(null, data);
			});
		})
		.catch((error) => {
			// Oh no! An error!
			callback(error, null);
			console.log(error);
		});
};

export default httpFetch;
