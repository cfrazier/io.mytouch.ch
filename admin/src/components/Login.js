import React, { useGlobal } from "reactn";
import "../styles/Login.scss";
import { useHistory, Link } from "react-router-dom";
import { Container, Typography, TextField, Grid, Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import Copyright from "./Copyright";
import httpFetch from "../services/http";

const Login = () => {
	const history = useHistory();
	const { handleSubmit, register } = useForm();
	const [user, setUser] = useGlobal("user");
	const [modal, setModal] = useGlobal("modal");

	const onSubmit = (data) => {
		httpFetch(
			"get",
			`/api/login?email=${encodeURIComponent(data.email)}&password=${encodeURIComponent(
				data.password
			)}`,
			null,
			(error, response) => {
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
							title: "We Could Not Find Your Account",
							message:
								"We checked and couldn't find an account that matched your email and password combination. Would you like to try again or register for a new account?",
							cancelText: "Try Again",
							completeText: "Register",
							onComplete: () => {
								history.push("/admin/register");
							},
						});
					} else {
						setUser(response, () => {
							history.push("/admin/dashboard");
						});
					}
				}
			}
		);
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
						<Button
							type="submit"
							size="large"
							fullWidth
							variant="contained"
							color="primary"
						>
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
