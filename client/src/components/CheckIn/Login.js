import React, { useState, useRef } from "reactn";
import { Link, useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import "../../styles/CheckIn/Login.scss";

import { Button, Card, CardContent, Grid, TextField, Typography } from "@material-ui/core";

export const Login = (props) => {
	const history = useHistory();
	const { handleSubmit, errors, control } = useForm();

	const [pin, setPin] = useState("    ".split(""));
	const pinInput = [useRef(null), useRef(null), useRef(null), useRef(null)];

	const onSubmit = (data) => {
		data.pin = pin.join();
	};

	const updatePIN = (event, index) => {
		const num = String.fromCharCode(event.charCode);
		if (index < 3) pinInput[index + 1].current.focus();
		if (/\d/g.test(num)) {
			setPin((pin) => pin.map((value, pindex) => (pindex === index ? num : value)));
		}
	};

	const formatPhone = ([e]) => {
		const {
			target: { value },
		} = e;
		// Numbers only
		const clean = value.replace(/\D/g, "");
		let output = "";
		// Do some formatting
		output += clean.length >= 3 ? `${clean.substring(0, 3)}` : clean;
		output += clean.length >= 4 ? `-${clean.substring(3, 6)}` : clean.substring(3);
		output += clean.length >= 7 ? `-${clean.substring(6)}` : "";
		return output;
	};

	return (
		<Card className="Login">
			<CardContent>
				<div className="Header">
					<Typography variant="h4" align="center" gutterBottom>
						Check In
					</Typography>
					<Typography variant="body2" align="center">
						Before checking in, we need to know hwo you are so we can access your group
						information. If you have not already registered, you can{" "}
						<Link to="/checkin/register">get started here</Link>.
					</Typography>
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Controller
								as={TextField}
								label="Phone Number"
								name="phone"
								type="tel"
								defaultValue=""
								fullWidth
								control={control}
								rules={{
									required: true,
									pattern: /\d{3}-\d{3}-\d{4}/i,
								}}
								onChange={formatPhone}
								helperText={errors.phone ? "A phone number is required." : ""}
							/>
						</Grid>
						<Grid item xs={12} className="PINFieldset">
							<div className="Header">
								<Typography variant="h6">4-Digit PIN</Typography>
								<Typography variant="caption">
									The PIN you selected during registration.
								</Typography>
							</div>
							<div className="Fields">
								<TextField
									as={TextField}
									inputRef={pinInput[0]}
									type="number"
									className="PINField"
									value={pin[0]}
									variant="outlined"
									autoComplete="off"
									style={{ maxWidth: "3em" }}
									onKeyPress={(e) => {
										updatePIN(e, 0);
									}}
								/>
								<TextField
									as={TextField}
									inputRef={pinInput[1]}
									type="number"
									className="PINField"
									value={pin[1]}
									variant="outlined"
									autoComplete="off"
									style={{ maxWidth: "3em" }}
									onKeyPress={(e) => {
										updatePIN(e, 1);
									}}
								/>
								<TextField
									as={TextField}
									inputRef={pinInput[2]}
									type="number"
									className="PINField"
									value={pin[2]}
									variant="outlined"
									autoComplete="off"
									style={{ maxWidth: "3em" }}
									onKeyPress={(e) => {
										updatePIN(e, 2);
									}}
								/>
								<TextField
									as={TextField}
									inputRef={pinInput[3]}
									type="number"
									className="PINField"
									value={pin[3]}
									variant="outlined"
									autoComplete="off"
									style={{ maxWidth: "3em" }}
									onKeyPress={(e) => {
										updatePIN(e, 3);
									}}
								/>
							</div>
						</Grid>
						<Grid item xs={12} className="Actions">
							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit(onSubmit)}
							>
								Log In
							</Button>
							<Button
								color="default"
								onClick={() => {
									history.push("/checkin/register");
								}}
							>
								Register
							</Button>
						</Grid>
					</Grid>
				</form>
			</CardContent>
		</Card>
	);
};
