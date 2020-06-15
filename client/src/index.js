import React, { setGlobal } from "reactn";
import ReactDOM from "react-dom";
import "./styles/index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const clientURL = new URL(process.env.PUBLIC_URL, window.location.href);
const { hostname } = clientURL;
const serverURL = `https://${hostname}`;

setGlobal({ clientURL, hostname, serverURL });

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
