import React, { useGlobal, useEffect } from "reactn";
import "../styles/Account.scss";
import { Container } from "@material-ui/core";

const Account = () => {
	const [breadcrumbs, setBreadcrumbs] = useGlobal("breadcrumbs");

	useEffect(() => {
		setBreadcrumbs([
			{ name: "Dashboard", path: "/admin/dashboard" },
			{ name: "Account", path: "/admin/dashboard/account" },
		]);
	}, []);
	return <Container className="Account">Account</Container>;
};

export default Account;
