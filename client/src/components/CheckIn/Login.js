import React, { useState, useRef } from "reactn";
import { Link, useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import "../../styles/CheckIn/Login.scss";

import { Button, Card, CardContent, Grid, TextField, Typography } from "@material-ui/core";
import httpFetch from "../../services/http";

export const Login = (props) => {
	const { setGroup, setAlert } = props;
	const history = useHistory();
	const { handleSubmit, errors, control } = useForm();

	const [pin, setPin] = useState("    ".split(""));
	const pinInput = [useRef(null), useRef(null), useRef(null), useRef(null)];

	const onSubmit = (data) => {
		data.pin = pin.join("");
		if (data.phone && /\d{4}/g.test(data.pin)) {
			httpFetch(
				"get",
				`/api/groups/1?phone=${data.phone}&pin=${data.pin}`,
				null,
				(error, response) => {
					if (error) {
						console.log(error);
						return setAlert({
							title: "A System Error Occurred",
							message:
								"It happens sometimes... there was a problem communicating with the server so your information couldn't be processed. Please try again later.",
							button: "OK",
						});
					}
					const { error: resError, message } = response;
					// Check for some errors
					if (resError) {
						console.log(resError);
						// Set an alert message
						switch (message) {
							case "Group not found.":
								return setAlert({
									title: "We Couldn't Find You...",
									message:
										"We couldn't find a group that matches both the phone number and PIN. If you haven't registered yet, please click the register link below to get started.",
									button: "OK",
								});
							default:
								return setAlert({
									title: "A System Error Occurred",
									message:
										"It happens sometimes... there was a problem communicating with the server so your information couldn't be processed. Please try again later.",
									button: "OK",
								});
						}
					}
					// We've got a group!
					setGroup(response);
					return setAlert({
						title: `Welcome Back, ${response.name}!`,
						message:
							"We're glad to have you back. To complete your check-in process, you will need a venue code, usually displayed at the entrance of the venue. If you need assistance, please feel free to ask for help.",
						button: "OK",
						onClose: () => {
							history.push("/checkin/manage");
						},
					});
				}
			);
		}
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
									history.push("/checkin/account");
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
