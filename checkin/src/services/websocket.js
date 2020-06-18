import io from "socket.io-client";

const websocket = () => {
	const clientURL = new URL(process.env.PUBLIC_URL, window.location.href);
	const hostname = clientURL.hostname;
	const serverURL = `wss://${hostname}`;

	return io(serverURL);			
}

export default websocket;