import React, { useGlobal } from "reactn";
import "../styles/Login.scss";
import { useHistory, Link } from "react-router-dom";
import { Container, Typography, TextField, Grid, Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import Copyright from "./Copyright";

const Login = () => {
	const history = useHistory();
	const { handleSubmit, register } = useForm();
	const [modal, setModal] = useGlobal("modal");

	const onSubmit = (data) => {
		if (modal) return;
		setModal({
			title: "An Error Occurred",
			message: "An error occurred",
			cancelText: "Close",
			onCancel: () => {
				history.push("/admin/register");
			},
		});
	};
	return (
		<Container className="Login" maxWidth="sm">
			<form className="LogInForm" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Typography component="h1" variant="h5">
							Log In
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant="outlined"
							fullWidth
							required
							label="Email Address"
							name="email"
							type="email"
							autoFocus
							inputRef={register({ required: true, pattern: /^\S+@\S+\.\S+$/ })}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant="outlined"
							fullWidth
							required
							label="Password"
							name="password"
							type="password"
							inputRef={register({ required: true, minLength: 8 })}
						/>
					</Grid>
					<Grid item xs={12}>
						<Button type="submit" fullWidth variant="contained" color="primary">
							Log In
						</Button>
					</Grid>
					<Grid item xs={6} style={{ textAlign: "center" }}>
						<Link to="/admin/">Forgot password?</Link>
					</Grid>
					<Grid item xs={6} style={{ textAlign: "center" }}>
						<Link to="/admin/register">Create an account.</Link>
					</Grid>
				</Grid>
			</form>
			<Copyright />
		</Container>
	);
};

export default Login;
