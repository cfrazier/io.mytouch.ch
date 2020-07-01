import React, { useState, useRef, useEffect, useGlobal } from "reactn";
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
	Divider,
} from "@material-ui/core";

import httpFetch from "../services/http";
import "../styles/Manage.scss";
import { Autorenew, Person } from "@material-ui/icons";

export const Manage = (props) => {
	const history = useHistory();
	const { register, handleSubmit, errors, setError, clearError } = useForm();
	const { group, setGroup } = props;

	// So much state...
	const [modal, setModal] = useGlobal("modal");
	const [checkins, setCheckins] = useState([]);
	const [checkinsLength, setCheckinsLength] = useState(0);
	const [code, setCode] = useState("     ".split(""));
	const [loadingVenue, setLoadingVenue] = useState(false);
	const [venue, setVenue] = useState();

	// Because the input boxes are a pain
	const codeInput = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

	// Generate the actual code
	const updateCode = (event, index) => {
		const { key } = event;
		event.preventDefault();
		if (key === "Backspace") {
			codeInput[index].current.value = "";
			if (index > 0) codeInput[index - 1].current.focus();
			return;
		}
		if (/[a-zA-Z]/g.test(key)) {
			codeInput[index].current.value = key.toUpperCase();
			setCode((code) => code.map((value, cindex) => (cindex === index ? key.toUpperCase() : value)));
			if (index < 4) codeInput[index + 1].current.focus();
		}
	};

	// Handle form submissions
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
			setError("venueCode", "notMatch", "Please provide the code for the venue.");
		// Check that someone was selected to attend
		if (checkin.personId.length === 0)
			return setError(
				"personId",
				"notMatch",
				"Please select at least one person to check into this venue."
			);
		httpFetch("post", "/api/checkin", checkin, (error, response) => {
			if (error) {
				if (!modal)
					setModal({
						title: "An Error Occurred",
						message:
							"Unfortunately, this happens sometimes. There was a problem communicating with the server and your information wasn't saved correctly. You can close this window and try again.",
						cancelText: "Close",
					});
				return console.log(error);
			}
			// A server error occurred
			if (response.error) {
				switch (response.error.message) {
					case "Group not found.":
						if (!modal)
							setModal({
								title: "Your Group Wasn't Found",
								message:
									"This is a weird one. Despite our best efforts, it looks like your group data has some issues and the information for the people in your group has been corrupted. Please update your group information.",
								cancelText: "Close",
							});

						break;
					case "Person not found.":
						setModal({
							title: "A Person in Your Group is Invalid",
							message:
								"This is a weird one. Despite our best efforts, it looks like your group data has some issues and the information for the people in your group has been corrupted. Please update your group information.",
							cancelText: "Close",
						});

						break;
					case "Venue not found.":
						setModal({
							title: "Incorrect Venue Code",
							message:
								"It appears that the venue code provided is not assigned to any venue in our records. Please check the code and try again.",
							cancelText: "Close",
						});

						break;
					case "Venue full.":
						setModal({
							title: "The Venue is Full",
							message:
								"The venue you chose does not have enough open seats for your selected group. Please ask an attendant for information about additional venue options.",
							cancelText: "Close",
						});

						break;
					default:
						setModal({
							title: "There Was a Problem",
							message: response.error.message,
							cancelText: "Close",
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
				setModal({
					title: "Check-In Received",
					message:
						"Your group was saved to our system and can be accessed later by returning to this page and logging in using your phone number and PIN.",
					cancelText: "Continue",
					onCancel: () => {
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
		const joinedCode = code.join("");
		console.log(joinedCode);
		if (/[A-Z]{5}/g.test(joinedCode)) {
			setLoadingVenue(true);
			httpFetch("get", `/api/venue?code=${joinedCode}`, null, (error, response) => {
				// HTTP error
				if (error) {
					setError(
						"venueCode",
						"notMatch",
						"An error occurred communicating with the system."
					);
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
							setError(
								"venueCode",
								"notMatch",
								"The venue code does not match an existing venue."
							);
							break;
						default:
							setError(
								"venueCode",
								"notMatch",
								"An error occurred communicating with the system."
							);
							break;
					}
				} else {
					clearError("venueCode");
					setLoadingVenue(false);
					setVenue(response);
				}
			});
		}
	}, [code]);

	useEffect(() => {
		if (group._id) {
			const { people } = group;
			let newCheckins = [];
			let checkinsLength = 0;
			people.forEach((person) => {
				if (!person.checkin) return;
				checkinsLength++;
				const venueIndex = newCheckins.findIndex(
					(venue) => person.checkin.venue._id === venue._id
				);
				console.log(venueIndex);
				if (venueIndex === -1) {
					newCheckins.push({
						...person.checkin.venue,
						checkins: [person.name],
					});
				} else {
					newCheckins[venueIndex].checkins.push(person.name);
				}
			});
			setCheckinsLength(checkinsLength);
			setCheckins(newCheckins);
		}
	}, [group]);

	useEffect(() => {
		console.log(errors);
	}, [errors]);
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
							<Typography variant="body2" align="center" gutterBottom>
								To gain entrance to this event, please show this screen to the door
								attendant.
							</Typography>
							{checkins.map((checkin) => (
								<Card
									className="CheckedInVenue"
									key={checkin._id}
									variant="outlined"
								>
									<CardContent>
										<Grid container spacing={3}>
											<Grid item xs={12} sm={3}>
												<div
													className="VenueCheckinCount"
													style={{ backgroundColor: checkin.color }}
												>
													{checkin.checkins.length}
												</div>
											</Grid>
											<Grid item xs={12} sm={9}>
												<Typography variant="h6">{checkin.name}</Typography>
												<Typography variant="caption" gutterBottom>
													{checkin.description}
												</Typography>
												<Divider></Divider>
												{checkin.checkins.map((personName) => (
													<div className="PersonName" key={personName}>
														<Person></Person>
														{personName}
													</div>
												))}
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
						<Grid container spacing={3}>
							{group && group.people.length > checkinsLength && (
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
											autoFocus
											style={{ maxWidth: "3em" }}
											onKeyDown={(e) => {
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
											onKeyDown={(e) => {
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
											onKeyDown={(e) => {
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
											onKeyDown={(e) => {
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
											onKeyDown={(e) => {
												updateCode(e, 4);
											}}
											onClick={() => {
												codeInput[4].current.select();
											}}
										/>
									</div>
									{errors.venueCode && (
										<FormHelperText align="center">
											{errors.venueCode.message}
										</FormHelperText>
									)}
									{loadingVenue && (
										<div className="Loading">
											<Autorenew /> Now loading venue...
										</div>
									)}
								</Grid>
							)}
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
													<Typography variant="h6">Agreements</Typography>
													<Typography variant="body2">
														Before you may check-in, please review and
														agree to the following statements by
														checking each one. For your privacy, we will
														not save your answers, but your check-in
														will not be processed without these
														approvals.
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
																	name={`approval[${index}]`}
																	color="primary"
																	inputRef={register({
																		required: true,
																	})}
																/>
															}
														/>
													)
												)}
												{errors.approval && (
													<FormHelperText>
														You must check all of the above to continue.
													</FormHelperText>
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
															Select the people from your group who
															will be attending the event at this
															venue. People who are currently
															checked-in are not shown. If your group
															is attending at different venues, you
															can check-in multiple times.
														</Typography>
														{errors.personId && (
															<FormHelperText>
																{errors.personId.message}
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
										Log Out
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
				</CardContent>
			</Card>
		</>
	);
};
