import React, { useGlobal, useEffect } from "reactn";
import "../styles/Dashboard.scss";
import { Container } from "@material-ui/core";

const Dashboard = () => {
	const [, setBreadcrumbs] = useGlobal("breadcrumbs");

	useEffect(() => {
		setBreadcrumbs([{ name: "Dashboard", path: "/admin/dashboard" }]);
	}, [setBreadcrumbs]);

	return <Container className="Dashboard">Dashboard Items</Container>;
};

export default Dashboard;
