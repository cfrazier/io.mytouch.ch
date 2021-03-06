import React, { useState, useRef, useGlobal } from "reactn";
import { useForm, Controller } from "react-hook-form";
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
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TableFooter,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import httpFetch from "../services/http";

import "../styles/Account.scss";

export const Account = (props) => {
	const { group, setGroup } = props;
	const history = useHistory();
	const { register, handleSubmit, errors, control } = useForm();

	const [, setModal] = useGlobal("modal");
	const [pin, setPin] = useState(props.group.pin.split(""));
	const [people, setPeople] = useState(props.group.people);
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
		if (key === "Backspace") {
			pinInput[index].current.value = "";
			setPin((pin) => pin.map((value, pindex) => (pindex === index ? "" : value)));
			if (index > 0) pinInput[index - 1].current.focus();
		}
	};

	const handlePinFocus = (event, index) => {
		event.preventDefault();
		event.target.select();
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

	const addPerson = () => {
		setPeople((people) => [...people, { name: "", birthdate: "" }]);
	};

	const removePerson = (rowIndex) => {
		setPeople((oldPeople) => {
			if (oldPeople.length > 1) {
				const update = oldPeople.filter((person, personIndex) => rowIndex !== personIndex);
				return update;
			}
			return oldPeople;
		});
	};

	const updatePerson = (rowIndex, key, value) => {
		setPeople((oldPeople) => {
			oldPeople[rowIndex][key] = value;
			return oldPeople;
		});
	};

	const onSubmit = (updatedGroup) => {
		// Join up the PIN into something... pin-ish
		updatedGroup.pin = pin.join("");

		if (!group._id && !/\d{4}/g.test(updatedGroup.pin)) {
			setModal({
				title: "A PIN is required to continue",
				message:
					"In order to check in to your event, you will need to have a valid PIN to log into your account. Please provide a 4 digit PIN that you will remember in the space provided.",
				cancelText: "Try Again",
			});
			return;
		}

		// Save the ID so we can sync things back up
		if (group._id) updatedGroup._id = group._id;

		// Update the group
		const options = group._id
			? { method: "put", path: `/api/groups/${group._id}?pin=${group.pin}` }
			: { method: "post", path: `/api/groups` };

		httpFetch(options.method, options.path, { group: updatedGroup }, (error, response) => {
			// An actual HTTP error occurred
			if (error) {
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
				const { errors } = response.error;
				// console.log(response);
				if (errors && errors.phone)
					setModal({
						title: "Duplicate Phone Number",
						message:
							"Your group could not be created because the phone number is already in use. You may have already registered with this system, possibly for another event. Please try loggin in instead.",
						cancelText: "Close",
					});
			} else {
				// Only update the saved group if things actually worked
				setModal({
					title: "Group Updated",
					message:
						"Your group was saved to our system and can be accessed later by returning to this page and logging in using your phone number and PIN.",
					cancelText: "Continue",
					onCancel: () => {
						setGroup(response);
						history.push("/checkin/manage");
					},
				});
			}
		});
	};

	return (
		<Card className="Account">
			<CardContent>
				<div className="Header">
					<Typography variant="h4" align="center" gutterBottom>
						Group Information
					</Typography>
					<Typography variant="body2" align="center">
						We take your privacy seriously and will not share your information with
						anyone without your permission. Keeping that in mind, when you choose to
						check in with an organization, your information will be shared so they can
						contact you.
					</Typography>
				</div>
				{group && (
					<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TextField
									label="Group Name"
									name="name"
									variant="outlined"
									defaultValue={group.name}
									autoComplete="off"
									fullWidth
									required
									autoFocus
									inputRef={register({ required: true })}
									helperText={errors.name ? "A group name is required." : ""}
								/>
								<Typography variant="caption">
									Your group name can be the name of your family or the name of an
									individual.
								</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Controller
									as={TextField}
									label="Phone Number"
									name="phone"
									variant="outlined"
									type="tel"
									fullWidth
									required
									defaultValue={group.phone}
									autoComplete="off"
									control={control}
									rules={{
										required: true,
										pattern: /\d{3}-\d{3}-\d{4}/i,
									}}
									onChange={formatPhone}
									helperText={errors.phone ? "A phone number is required." : ""}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									label="Email Address"
									name="email"
									type="email"
									variant="outlined"
									autoComplete="off"
									defaultValue={group.email}
									fullWidth
									required
									inputRef={register({ required: true })}
									helperText={errors.email ? "An email is required." : ""}
								/>
							</Grid>
							<Grid item xs={12} className="PINFieldset">
								<div className="Header">
									<Typography variant="h6">4-Digit PIN</Typography>
									<Typography variant="caption">
										Please choose a four-digit PIN that you will use when
										checking in.
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
							<Grid item xs={12}>
								<div className="Header">
									<Typography variant="h6" align="center">
										Group Members
									</Typography>
									<Typography variant="body2" align="center">
										To help keep track of who is attending each event we need to
										know who will be attending with you. Make sure to include
										yourself!
									</Typography>
								</div>
								<TableContainer component={Paper}>
									<Table className="People">
										<TableHead style={{ backgroundColor: "#fafafa" }}>
											<TableRow>
												<TableCell>Group Member</TableCell>
												{people.length > 1 && <TableCell></TableCell>}
											</TableRow>
										</TableHead>
										<TableBody>
											{people.map((person, index) => (
												<TableRow key={person.name + index}>
													<TableCell>
														{person._id && (
															<input
																type="hidden"
																name={`people[${index}][_id]`}
																value={person._id}
																ref={register}
															/>
														)}
														<TextField
															label="Full Name"
															name={`people[${index}][name]`}
															inputProps={{
																readOnly:
																	person.checkedin !== undefined,
															}}
															defaultValue={person.name}
															fullWidth
															required
															size="small"
															onChange={(e) => {
																updatePerson(
																	index,
																	"name",
																	e.target.value
																);
															}}
															helperText={
																errors.people &&
																errors.people[index] &&
																errors.people[index].name
																	? "This is required"
																	: ""
															}
															inputRef={register({ required: true })}
														/>
													</TableCell>
													{people.length > 1 && (
														<TableCell
															align="center"
															padding="checkbox"
														>
															<DeleteIcon
																color="action"
																onClick={(e) => {
																	removePerson(index);
																}}
															/>
														</TableCell>
													)}
												</TableRow>
											))}
										</TableBody>
										<TableFooter>
											<TableRow>
												<TableCell colSpan="3" align="right">
													<Button color="default" onClick={addPerson}>
														Add Person
													</Button>
												</TableCell>
											</TableRow>
										</TableFooter>
									</Table>
								</TableContainer>
							</Grid>
							<Grid item xs={12} className="Actions">
								<Button
									variant="contained"
									color="primary"
									onClick={handleSubmit(onSubmit)}
								>
									Save
								</Button>
								{!group._id && (
									<Button
										color="default"
										onClick={() => {
											history.push("/checkin");
										}}
									>
										Log In
									</Button>
								)}
							</Grid>
						</Grid>
					</form>
				)}
			</CardContent>
		</Card>
	);
};
