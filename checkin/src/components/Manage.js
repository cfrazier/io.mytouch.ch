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

import httpFetch from "../services/http";
import "../styles/Manage.scss";
import { Autorenew } from "@material-ui/icons";

export const Manage = (props) => {
	const { group, setGroup, setAlert } = props;
	const history = useHistory();
	const { register, handleSubmit } = useForm();

	// So much state...
	const [checkins, setCheckins] = useState([]);
	const [code, setCode] = useState("     ".split(""));
	const [errors, setErrors] = useState({});
	const [loadingVenue, setLoadingVenue] = useState(false);
	const [venue, setVenue] = useState();

	// Because the input boxes are a pain
	const codeInput = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

	// Generate the actual code
	const updateCode = (event, index) => {
		const char = codeInput[index].current.value.substr(-1).toUpperCase();
		codeInput[index].current.value = char;
		if (index < 4) codeInput[index + 1].current.focus();
		setCode((code) => code.map((value, cindex) => (cindex === index ? char : value)));
	};

	// Handle form submissions
	const onSubmit = (data) => {
		const error = {};
		data.people = data.people ? data.people : [];
		const checkin = {
			venueCode: code.join("").toLowerCase(),
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
				setCode("     ".split(""));
				for (let i = 0; i < 5; i++) {
					codeInput[i].current.value = "";
				}
				setGroup(response);
				setVenue(null);
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

	useEffect(() => {
		const joinedCode = code.join("").toLowerCase();
		if (/[a-z0-9]{5}/g.test(joinedCode)) {
			setLoadingVenue(true);
			httpFetch("get", `/api/venue?code=${joinedCode}`, null, (error, response) => {
				// HTTP error
				if (error) {
					setErrors({ venueCode: "An error occurred communicating with the system." });
					setVenue(null);
					setLoadingVenue(false);
					return console.log(error);
				}
				// Server data errors
				if (response.error) {
					const { message } = response.error;
					setLoadingVenue(false);
					setVenue(null);
					switch (message) {
						case "Venue not found.":
							setErrors({
								venueCode: "The venue code does not match an existing venue.",
							});
							break;
						default:
							setErrors({
								venueCode: "An error occurred communicating with the system.",
							});
							break;
					}
				} else {
					setErrors((oldErrors) => {
						delete oldErrors.venueCode;
						return oldErrors;
					});
					setLoadingVenue(false);
					setVenue(response);
				}
			});
		}
	}, [code]);

	useEffect(() => {
		if (group._id) {
			const { people } = group;
			setCheckins(people.filter((person) => person.checkin));
		}
	}, [group]);

	// Let's render some check-in stuff!!!
	return (
		<>
			<Card className="Manage">
				<CardContent>
					<div className="Header">
						<Typography variant="h4" align="center" gutterBottom>
							Check-In
						</Typography>
						<Typography variant="body2" align="center">
							When you arrive for your event, enter the venue code found at the
							entrance to your event. If you cannot find the venue code, please feel
							free to ask for help.
						</Typography>
					</div>
					{checkins.length > 0 && (
						<div className="CheckedIn">
							<Typography variant="h6" align="center" gutterBottom>
								Existing Check-Ins
							</Typography>
							{checkins.map((person) => (
								<div
									className="CheckedInItem"
									style={{ backgroundColor: person.checkin.venue.color }}
									key={person._id}
								>
									<div className="PersonName">{person.name}</div>
									<div className="VenueName">{person.checkin.venue.name}</div>
								</div>
							))}
						</div>
					)}
					{group && group.people.length > checkins.length && (
						<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
							<Grid container spacing={3}>
								<Grid item xs={12} className="CodeFieldset">
									<div className="Header">
										<Typography variant="h6">Venue Code</Typography>
									</div>
									<div className="Fields">
										<TextField
											inputRef={codeInput[0]}
											type="text"
											className="CodeField"
											variant="outlined"
											autoComplete="off"
											style={{ maxWidth: "3em" }}
											onInput={(e) => {
												updateCode(e, 0);
											}}
											onClick={() => {
												codeInput[0].current.select();
											}}
										/>
										<TextField
											inputRef={codeInput[1]}
											type="text"
											className="CodeField"
											variant="outlined"
											autoComplete="off"
											style={{ maxWidth: "3em" }}
											onInput={(e) => {
												updateCode(e, 1);
											}}
											onClick={() => {
												codeInput[1].current.select();
											}}
										/>
										<TextField
											inputRef={codeInput[2]}
											type="text"
											className="CodeField"
											variant="outlined"
											autoComplete="off"
											style={{ maxWidth: "3em" }}
											onInput={(e) => {
												updateCode(e, 2);
											}}
											onClick={() => {
												codeInput[2].current.select();
											}}
										/>
										<TextField
											inputRef={codeInput[3]}
											type="text"
											className="CodeField"
											variant="outlined"
											autoComplete="off"
											style={{ maxWidth: "3em" }}
											onInput={(e) => {
												updateCode(e, 3);
											}}
											onClick={() => {
												codeInput[3].current.select();
											}}
										/>
										<TextField
											inputRef={codeInput[4]}
											type="text"
											className="CodeField"
											variant="outlined"
											autoComplete="off"
											style={{ maxWidth: "3em" }}
											onInput={(e) => {
												updateCode(e, 4);
											}}
											onClick={() => {
												codeInput[4].current.select();
											}}
										/>
									</div>
									{errors.venueCode && (
										<FormHelperText align="center">
											{errors.venueCode}
										</FormHelperText>
									)}
									{loadingVenue && (
										<div className="Loading">
											<Autorenew /> Now loading venue...
										</div>
									)}
								</Grid>
								{venue && (
									<Grid item xs={12}>
										<Card className="VenueDetails">
											<CardContent>
												<Grid container spacing={3}>
													<Grid item xs={12} sm={3}>
														<div
															className="VenueBadge"
															style={{
																backgroundColor: venue.color,
															}}
														>
															{venue.available}
														</div>
													</Grid>
													<Grid item xs={12} sm={9}>
														<Typography variant="h5">
															{venue.organization.name}
														</Typography>
														<Typography variant="h6">
															{venue.name}
														</Typography>
														<Typography variant="body2">
															{venue.description}
														</Typography>
													</Grid>
												</Grid>
												<Grid item xs={12}></Grid>
											</CardContent>
										</Card>
										{venue.organization.approvals.length > 0 && (
											<Card className="Agreements">
												<CardContent>
													<div className="Header">
														<Typography variant="h6">
															Agreements
														</Typography>
														<Typography variant="body2">
															Before you may check-in, please review
															and agree to the following statements by
															checking each one. For your privacy, we
															will not save your answers, but your
															check-in will not be processed without
															these approvals.
														</Typography>
													</div>
													{venue.organization.approvals.map(
														(approval, index) => (
															<FormControlLabel
																className="ApprovalItem"
																label={approval}
																key={`approval_${index}`}
																control={
																	<Checkbox
																		name={`approval_${index}`}
																		color="primary"
																		inputRef={register({
																			required: true,
																		})}
																	/>
																}
															/>
														)
													)}
												</CardContent>
											</Card>
										)}
										<TableContainer component={Paper}>
											<Table className="People">
												<TableHead>
													<TableRow>
														<TableCell>
															<Typography variant="h6">
																Event Attendees
															</Typography>
															<Typography variant="body2">
																Select the people from your group
																who will be attending the event at
																this venue. People who are currently
																checked-in are not shown. If your
																group is attending at different
																venues, you can check-in multiple
																times.
															</Typography>
															{errors.personId && (
																<FormHelperText>
																	{errors.personId}
																</FormHelperText>
															)}
														</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{group.people.map((person, index) =>
														person.checkin ? null : (
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
															</TableRow>
														)
													)}
												</TableBody>
											</Table>
										</TableContainer>
									</Grid>
								)}

								<Grid item xs={12} className="Actions">
									{venue && (
										<Button
											variant="contained"
											color="primary"
											onClick={handleSubmit(onSubmit)}
										>
											Check In
										</Button>
									)}
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
					{!venue && (
						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								setGroup({
									name: "",
									phone: "",
									email: "",
									pin: "    ",
									people: [{ name: "", birthdate: "" }],
								});
								history.push("/checkin");
							}}
						>
							Done
						</Button>
					)}
				</CardContent>
			</Card>
		</>
	);
};
