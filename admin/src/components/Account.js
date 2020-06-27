import React, { useGlobal, useEffect } from "reactn";
import "../styles/Account.scss";
import {
	Container,
	Card,
	Toolbar,
	Typography,
	CardContent,
	Grid,
	TextField,
	CardActions,
	Button,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import httpFetch from "../services/http";

const Account = () => {
	const { handleSubmit, register, watch, errors } = useForm();
	const [user, setUser] = useGlobal("user");
	const [modal, setModal] = useGlobal("modal");
	const [breadcrumbs, setBreadcrumbs] = useGlobal("breadcrumbs");

	const password = watch("user[password]");

	const onSubmit = (data) => {
		const { user } = data;
		if (user.password === "") delete user.password;
		httpFetch("put", `/api/users/${user._id}`, { user }, (error, response) => {
			if (error) {
				if (modal) return;
				setModal({
					title: "An Error Occurred",
					message:
						"There was an error communicating with the server. Please check your Internet connection to make sure everything is working correctly.",
					cancelText: "Try Again",
				});
			} else {
				if (response.error) {
					if (modal) return;
					setModal({
						title: "Update Problems",
						message: `There was a problem with your update: ${response.error.message}`,
						cancelText: "Try Again",
					});
				} else {
					setUser(response);
					if (modal) return;
					setModal({
						title: "Update Complete",
						message: "Your account details were saved correctly. If you changed your password, make sure to keep track of the change.",
						cancelText: "Close",
					});
				}
			}
		});
	};

	useEffect(() => {
		setBreadcrumbs([
			{ name: "Dashboard", path: "/admin/dashboard" },
			{ name: "Account", path: "/admin/dashboard/account" },
		]);
	}, [setBreadcrumbs]);

	return (
		<Container className="Account">
			<Card>
				<form className="AccountForm" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
					<input type="hidden" name="user[_id]" ref={register} value={user._id} />
					<Toolbar className="Toolbar">
						<Typography variant="h6" component="div" className="Title">
							User Details
						</Typography>
					</Toolbar>
					<CardContent>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TextField
									variant="standard"
									fullWidth
									required
									autoFocus
									defaultValue={user.name}
									label="User Name"
									name="user[name]"
									type="text"
									inputRef={register({ required: true })}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="standard"
									fullWidth
									required
									defaultValue={user.email}
									label="Email Address"
									name="user[email]"
									type="email"
									inputRef={register({ required: true })}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									variant="standard"
									fullWidth
									label="Password"
									name="user[password]"
									type="password"
									inputRef={register}
									helperText="Leave blank to keep your current password."
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									variant="standard"
									fullWidth
									label="Confirm Password"
									name="confirm"
									type="password"
									inputRef={register({
										validate: (value) => value === password,
									})}
									helperText={errors.confirm ? "Passwords must match" : ""}
								/>
							</Grid>
						</Grid>
					</CardContent>
					<CardActions className="Actions">
						<Button type="submit" color="primary">
							Update
						</Button>
					</CardActions>
				</form>
			</Card>
		</Container>
	);
};

export default Account;
