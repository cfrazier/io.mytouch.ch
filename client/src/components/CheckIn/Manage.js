import React, { useState, useRef, useEffect } from "reactn";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import {
	Button,
	Card,
	CardContent,
	Grid,
	TextField,
	Typography,
	Table,
	TableContainer,
	Paper,
	TableRow,
	TableCell,
	TableBody,
	Checkbox,
	TableHead,
	FormControlLabel,
	FormHelperText,
} from "@material-ui/core";

import httpFetch from "../../services/http";
import "../../styles/CheckIn/Manage.scss";
import { Close } from "@material-ui/icons";

export const Manage = (props) => {
	const { group, setGroup, setAlert } = props;
	const history = useHistory();
	const { register, handleSubmit } = useForm();

	const [errors, setErrors] = useState({});
	const [code, setCode] = useState("     ".split(""));
	const codeInput = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

	const updateCode = (event, index) => {
		const char = String.fromCharCode(event.charCode).toLowerCase();
		if (index < 4) codeInput[index + 1].current.focus();
		setCode((code) => code.map((value, cindex) => (cindex === index ? char : value)));
	};

	const onSubmit = (data) => {
		const error = {};
		data.people = data.people ? data.people : [];
		const checkin = {
			venueCode: code.join(""),
			groupId: group._id,
			personId: data.people.filter((id) => id !== false),
		};
		// Check for a venueCode
		if (!/[a-z0-9]{5}/g.test(checkin.venueCode))
			error.venueCode = "Please provide the code for the venue.";
		// Check that someone was selected to attend
		if (checkin.personId.length === 0)
			error.personId = "Please select at least one person to check into this venue.";
		if (Object.keys(error).length > 0) return setErrors(error);
		setErrors({});
		httpFetch("post", "/api/checkin", checkin, (error, response) => {
			if (error) {
				setAlert({
					title: "An Error Occurred",
					message:
						"Unfortunately, this happens sometimes. There was a problem communicating with the server and your information wasn't saved correctly. You can close this window and try again.",
					button: "Close",
				});
				return console.log(error);
			}
			// A server error occurred
			if (response.error) {
				switch (response.error.message) {
					case "Group not found.":
						setAlert({
							title: "Your Group Wasn't Found",
							message:
								"This is a weird one. Despite our best efforts, it looks like your group data has some issues and the information for the people in your group has been corrupted. Please update your group information.",
							button: "Close",
						});

						break;
					case "Person not found.":
						setAlert({
							title: "A Person in Your Group is Invalid",
							message:
								"This is a weird one. Despite our best efforts, it looks like your group data has some issues and the information for the people in your group has been corrupted. Please update your group information.",
							button: "Close",
						});

						break;
					case "Venue not found.":
						setAlert({
							title: "Incorrect Venue Code",
							message:
								"It appears that the venue code provided is not assigned to any venue in our records. Please check the code and try again.",
							button: "Close",
						});

						break;
					case "Venue full.":
						setAlert({
							title: "The Venue is Full",
							message:
								"The venue you chose does not have enough open seats for your selected group. Please ask an attendant for information about additional venue options.",
							button: "Close",
						});

						break;
					default:
						setAlert({
							title: "There Was a Problem",
							message: response.error.message,
							button: "Close",
						});
						break;
				}
			} else {
				// Only update the saved group if things actually worked
				setGroup(response);
				setCode("     ".split(""));
				setAlert({
					title: "Check-In Received",
					message:
						"Your group was saved to our system and can be accessed later by returning to this page and logging in using your phone number and PIN.",
					button: "Continue",
					onClose: () => {
						console.log(response);
					},
				});
			}
		});
	};

	useEffect(() => {
		if (!group._id) return history.push("/checkin");
	}, [group._id, history]);
	return (
		<>
			<Card className="Manage">
				<CardContent>
					<div className="Header">
						<Typography variant="h4" align="center" gutterBottom>
							Check-In
						</Typography>
						<Typography variant="body2" align="center">
							To complete the check-in process, enter the venue code found at the
							entrance to your event. If you cannot find the venue code, please feel
							free to ask for help.
						</Typography>
					</div>
					{group && (
						<form onSubmit={handleSubmit(onSubmit)}>
							<Grid container spacing={3}>
								<Grid item xs={12} className="CodeFieldset">
									<div className="Header">
										<Typography variant="h6">Venue Code</Typography>
									</div>
									<div className="Fields">
										<TextField
											as={TextField}
											inputRef={codeInput[0]}
											type="text"
											className="CodeField"
											value={code[0].toUpperCase()}
											variant="outlined"
											autoComplete="off"
											style={{ maxWidth: "3em" }}
											onKeyPress={(e) => {
												updateCode(e, 0);
											}}
										/>
										<TextField
											as={TextField}
											inputRef={codeInput[1]}
											type="text"
											className="CodeField"
											value={code[1].toUpperCase()}
											variant="outlined"
											autoComplete="off"
											style={{ maxWidth: "3em" }}
											onKeyPress={(e) => {
												updateCode(e, 1);
											}}
										/>
										<TextField
											as={TextField}
											inputRef={codeInput[2]}
											type="text"
											className="CodeField"
											value={code[2].toUpperCase()}
											variant="outlined"
											autoComplete="off"
											style={{ maxWidth: "3em" }}
											onKeyPress={(e) => {
												updateCode(e, 2);
											}}
										/>
										<TextField
											as={TextField}
											inputRef={codeInput[3]}
											type="text"
											className="CodeField"
											value={code[3].toUpperCase()}
											variant="outlined"
											autoComplete="off"
											style={{ maxWidth: "3em" }}
											onKeyPress={(e) => {
												updateCode(e, 3);
											}}
										/>
										<TextField
											as={TextField}
											inputRef={codeInput[4]}
											type="text"
											className="CodeField"
											value={code[4].toUpperCase()}
											variant="outlined"
											autoComplete="off"
											style={{ maxWidth: "3em" }}
											onKeyPress={(e) => {
												updateCode(e, 4);
											}}
										/>
									</div>
									{errors.venueCode && (
										<FormHelperText align="center">
											{errors.venueCode}
										</FormHelperText>
									)}
								</Grid>
								<Grid item xs={12}>
									<div className="Header">
										<Typography variant="h6" align="center">
											Event Attendees
										</Typography>
										<Typography variant="body2" align="center">
											Select the people from your group who will be attending
											the event at this venue. If your group is attending at
											different venues, you can check-in multiple times.
										</Typography>
										{errors.personId && (
											<FormHelperText align="center">
												{errors.personId}
											</FormHelperText>
										)}
									</div>
									<TableContainer component={Paper}>
										<Table className="People">
											<TableHead style={{ backgroundColor: "#fafafa" }}>
												<TableRow>
													<TableCell>Individual</TableCell>
													<TableCell>Venue</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{group.people.map((person, index) =>
													person.checkin ? (
														<TableRow
															key={person.name + index}
															className="CheckedIn"
															style={{
																backgroundColor:
																	person.checkin.venue.color,
															}}
														>
															<TableCell>{person.name}</TableCell>
															<TableCell>
																{person.checkin.venue.name}
															</TableCell>
														</TableRow>
													) : (
														<TableRow key={person.name + index}>
															<TableCell>
																<FormControlLabel
																	label={person.name}
																	control={
																		<Checkbox
																			name={`people[${index}]`}
																			value={person._id}
																			color="primary"
																			inputRef={register}
																			inputProps={{
																				"aria-label":
																					"primary checkbox",
																			}}
																		/>
																	}
																/>
															</TableCell>
															<TableCell></TableCell>
														</TableRow>
													)
												)}
											</TableBody>
										</Table>
									</TableContainer>
								</Grid>
								<Grid item xs={12} className="Actions">
									<Button
										variant="contained"
										color="primary"
										onClick={handleSubmit(onSubmit)}
									>
										Check In
									</Button>
									<Button
										color="default"
										onClick={() => {
											history.push("/checkin/account");
										}}
									>
										Update Account
									</Button>
								</Grid>
							</Grid>
						</form>
					)}
				</CardContent>
			</Card>
		</>
	);
};
