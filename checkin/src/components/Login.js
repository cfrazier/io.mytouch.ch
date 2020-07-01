import React, { useState, useRef, useGlobal, useEffect } from "reactn";
import { Link, useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import "../styles/Login.scss";

import { Button, Card, CardContent, Grid, TextField, Typography } from "@material-ui/core";
import httpFetch from "../services/http";

export const Login = (props) => {
	const { setGroup } = props;
	const history = useHistory();
	const { handleSubmit, errors, control, getValues } = useForm();

	const [modal, setModal] = useGlobal("modal");
	const [pin, setPin] = useState("    ".split(""));
	const pinInput = [useRef(null), useRef(null), useRef(null), useRef(null)];

	const handlePinChange = (event, index) => {
		event.preventDefault();
		const {
			target: { value },
		} = event;
		const key = value.substr(-1);
		if (/[0-9]/g.test(key)) {
			pinInput[index].current.value = key;
			setPin((pin) => pin.map((value, pindex) => (pindex === index ? key : value)));
			if (index < 3) pinInput[index + 1].current.focus();
		} else {
			pinInput[index].current.value = "";
		}
	};

	const handlePinKeyDown = (event, index) => {
		const { key } = event;
		if (key == "Backspace") {
			pinInput[index].current.value = "";
			setPin((pin) => pin.map((value, pindex) => (pindex === index ? "" : value)));
			if (index > 0) pinInput[index - 1].current.focus();
		}
	};

	const handlePinFocus = (event, index) => {
		event.preventDefault();
		event.target.select();
	};

	const resetPIN = (e) => {
		e.preventDefault();
		const phone = getValues("phone");
		if (/\d{3}-\d{3}-\d{4}/i.test(phone)) {
			httpFetch("get", `/api/groups/reset?phone=${phone}`, null, (error, response) => {
				if (error) {
					console.log(error);
					return setModal({
						title: "A System Error Occurred",
						message:
							"It happens sometimes... there was a problem communicating with the server so your information couldn't be processed. Please try again later.",
						cancelText: "OK",
					});
				}
				if (response.error) {
					return setModal({
						title: "We Couldn't Reset Your PIN",
						message:
							"We weren't able to find a phone number that matches the one provided. Please check the phone number and try again.",
						cancelText: "OK",
					});
				}
				return setModal({
					title: "Your PIN Was Reset",
					message:
						"Your PIN was reset and an email sent to the email address you provided during registration. It may take a minute for the email to be delivered, so please wait a moment before requesting another PIN reset.",
					cancelText: "OK",
				});
			});
		}
	};

	const formatPhone = ([event]) => {
		const {
			target: { value },
		} = event;
		// Numbers only
		const clean = value.replace(/\D/g, "");
		let output = "";
		// Do some formatting
		output += clean.length >= 3 ? `${clean.substring(0, 3)}` : clean;
		output += clean.length >= 4 ? `-${clean.substring(3, 6)}` : clean.substring(3);
		output += clean.length >= 7 ? `-${clean.substring(6)}` : "";
		return output;
	};

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
						return setModal({
							title: "A System Error Occurred",
							message:
								"It happens sometimes... there was a problem communicating with the server so your information couldn't be processed. Please try again later.",
							cancelText: "OK",
						});
					}
					const { error: resError, message } = response;
					// Check for some errors
					if (resError) {
						// Set an alert message
						switch (message) {
							case "Group not found.":
								return setModal({
									title: "We Couldn't Find You...",
									message:
										"We couldn't find a group that matches both the phone number and PIN. If you haven't registered yet, please click the register link below to get started.",
									cancelText: "OK",
								});
							default:
								return setModal({
									title: "A System Error Occurred",
									message:
										"It happens sometimes... there was a problem communicating with the server so your information couldn't be processed. Please try again later.",
									cancelText: "OK",
								});
						}
					}
					// We've got a group!
					setGroup(response);
					return setModal({
						title: `Welcome Back, ${response.name}!`,
						message:
							"We're glad to have you back. To complete your check-in process, you will need a venue code, usually displayed at the entrance of the venue. If you need assistance, please feel free to ask for help.",
						cancelText: "OK",
						onCancel: () => {
							history.push("/checkin/manage");
						},
					});
				}
			);
		}
	};

	return (
		<Card className="Login">
			<CardContent>
				<div className="Header">
					<Typography variant="h4" align="center" gutterBottom>
						Check In
					</Typography>
					<Typography variant="body2" align="center">
						Before checking in, we need to know who you are so we can access your group
						information. If you have not already registered, you can{" "}
						<Link to="/checkin/register">get started here</Link>.
					</Typography>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Controller
								as={TextField}
								label="Phone Number"
								name="phone"
								variant="outlined"
								type="tel"
								defaultValue=""
								fullWidth
								required
								autoFocus
								control={control}
								rules={{
									required: true,
									pattern: /\d{3}-\d{3}-\d{4}/i,
								}}
								onChange={formatPhone}
								helperText={errors.phone ? "A phone number is required." : ""}
							/>
							<Typography variant="caption">
								If you need to reset your PIN, please enter your phone number and{" "}
								<Link to="/checkin" onClick={resetPIN}>
									click here.
								</Link>
							</Typography>
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
									inputRef={pinInput[0]}
									type="number"
									className="PINField"
									variant="outlined"
									autoComplete="off"
									style={{ maxWidth: "3em" }}
									onChange={(e) => {
										handlePinChange(e, 0);
									}}
									onFocus={(e) => {
										handlePinFocus(e, 0);
									}}
									onKeyDown={(e) => {
										handlePinKeyDown(e, 0);
									}}
								/>
								<TextField
									inputRef={pinInput[1]}
									type="number"
									className="PINField"
									variant="outlined"
									autoComplete="off"
									style={{ maxWidth: "3em" }}
									onChange={(e) => {
										handlePinChange(e, 1);
									}}
									onFocus={(e) => {
										handlePinFocus(e, 1);
									}}
									onKeyDown={(e) => {
										handlePinKeyDown(e, 1);
									}}
								/>
								<TextField
									inputRef={pinInput[2]}
									type="number"
									className="PINField"
									variant="outlined"
									autoComplete="off"
									style={{ maxWidth: "3em" }}
									onChange={(e) => {
										handlePinChange(e, 2);
									}}
									onFocus={(e) => {
										handlePinFocus(e, 2);
									}}
									onKeyDown={(e) => {
										handlePinKeyDown(e, 2);
									}}
								/>
								<TextField
									inputRef={pinInput[3]}
									type="number"
									className="PINField"
									variant="outlined"
									autoComplete="off"
									style={{ maxWidth: "3em" }}
									onChange={(e) => {
										handlePinChange(e, 3);
									}}
									onFocus={(e) => {
										handlePinFocus(e, 3);
									}}
									onKeyDown={(e) => {
										handlePinKeyDown(e, 3);
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
