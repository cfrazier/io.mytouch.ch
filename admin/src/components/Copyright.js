import React from "reactn";
import "../styles/App.scss";
import { Typography, Container } from "@material-ui/core";
import { Link } from "react-router-dom";

const Copyright = () => {
	return (
		<Container className="Copyright">
			<Typography variant="body2" color="textSecondary" align="center">
				A service of the{" "}
				<Link to="https://fmcsc.org">Free Methodist Church in Southern California</Link>.{" "}
				<br></br>Copyright © {new Date().getFullYear()}.
			</Typography>
		</Container>
	);
};

export default Copyright;
