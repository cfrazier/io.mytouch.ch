import React from "reactn";
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

const Register = () => {
	const history = useHistory();
	const { handleSubmit, errors, register } = useForm();

	const onSubmit = (data) => {
		history.push("/admin/onboard");
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
						<Button type="submit" size="large" fullWidth variant="contained" color="primary">
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
