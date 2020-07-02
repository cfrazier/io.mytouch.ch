import React, { useGlobal } from "reactn";
import "../styles/Register.scss";
import { useHistory, Link } from "react-router-dom";
import {
	Container,
	Typography,
	TextField,
	Grid,
	Button,
	FormControlLabel,
	Checkbox,
	FormHelperText,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import Copyright from "./Copyright";
import httpFetch from "../services/http";

const Register = () => {
	const history = useHistory();
	const { handleSubmit, errors, register } = useForm();

	const [modal, setModal] = useGlobal("modal");
	const [, setUser] = useGlobal("user");

	const onSubmit = (data) => {
		httpFetch("post", "/api/users", { user: data }, (error, response) => {
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
					if (response.error.errors.email) {
						if (modal) return;
						setModal({
							title: "Duplicate Email",
							message:
								"An account with the provided email address already exists in the system. To reset the password for an existing account, visit the login page and select 'Forgot password?'",
							cancelText: "Try Again",
							completeText: "Log In",
							onComplete: () => {
								history.push("/admin/");
							},
						});
					}
				} else {
					// Now we need to actually log in!
					httpFetch(
						"get",
						`/api/login/?email=${encodeURIComponent(
							data.email
						)}&password=${encodeURIComponent(data.password)}`,
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
									console.log(response.error);
								} else {
									setUser(response);
									if (modal) return;
									setModal({
										title: "Welcome!",
										message:
											"Your account was created and you are now ready to begin the next step: setting up your first organization and meeting venue. Just click 'Continue' below to get started.",
										cancelText: "continue",
										onCancel: () => {
											history.push("/admin/dashboard");
										},
									});
								}
							}
						}
					);
				}
			}
		});
		// history.push("/admin/onboard");
	};

	return (
		<Container className="Register" maxWidth="sm">
			<form className="RegisterForm" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Typography component="h1" variant="h5">
							Register
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant="outlined"
							fullWidth
							required
							label="Your Name"
							name="name"
							type="text"
							autoFocus
							inputRef={register({ required: true })}
							helperText={errors.name ? "This field is required." : null}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant="outlined"
							fullWidth
							required
							label="Email Address"
							name="email"
							type="email"
							inputRef={register({ required: true, pattern: /^\S+@\S+\.\S+$/ })}
							helperText={errors.email ? "A valid email address is required." : null}
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
							helperText={
								errors.password
									? "Please provide a strong password - at least 8 characters."
									: null
							}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControlLabel
							label="I agree to the terms of service."
							control={
								<Checkbox
									name="agreement"
									color="primary"
									value="agree"
									required
									inputRef={register({
										required: true,
										validate: (value) => value === "agree",
									})}
								/>
							}
						/>
						{errors.agreement ? (
							<FormHelperText>
								You must agree to the terms of service to continue.
							</FormHelperText>
						) : null}
					</Grid>
					<Grid item xs={12}>
						<Button
							type="submit"
							size="large"
							fullWidth
							variant="contained"
							color="primary"
						>
							Register
						</Button>
					</Grid>
					<Grid item xs={12} style={{ textAlign: "center" }}>
						<Link to="/admin">Alread have an account? Log in.</Link>
					</Grid>
				</Grid>
			</form>
			<Copyright />
		</Container>
	);
};

export default Register;
