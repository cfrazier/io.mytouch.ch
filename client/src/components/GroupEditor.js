import React, { useState, useEffect } from "reactn";
import MaskedInput from "react-input-mask";
import { useForm, Controller } from "react-hook-form";
import "../styles/GroupEditor.scss";

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

export const GroupEditor = (props) => {
	const { group, setGroup } = props;
	const [people, setPeople] = useState(group.people);
	const { register, handleSubmit, errors, control } = useForm();

	const onSubmit = (data) => {
		setGroup(data);
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
		<Card className="GroupEditor">
			<CardContent>
				<div className="Header">
					<Typography variant="h5">Your Group Information</Typography>
					<Typography variant="body2">
						We take your privacy seriously and will not share your information with
						anyone without your permission. Keeping that in mind, when you choose to
						check in with an organization, your information will be shared so they can
						contact you per our terms.
					</Typography>
				</div>
				{group && (
					<form onSubmit={handleSubmit(onSubmit)}>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<TextField
									label="Group Name"
									name="name"
									fullWidth
									inputRef={register({ required: true })}
									helperText={errors.name ? "A group name is required." : ""}
								/>
								<Typography variant="caption">
									Your group name can be the name of your family or the name of an
									individual.
									{errors.name && (
										<span className="Error">A group name is required.</span>
									)}
								</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Controller
									as={TextField}
									label="Phone Number"
									name="phone"
									type="tel"
									fullWidth
									defaultValue=""
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
									fullWidth
									inputRef={register}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Controller
									as={TextField}
									control={control}
									label="4-Digit PIN"
									name="pin"
									type="number"
									fullWidth
									autoComplete="off"
									defaultValue=""
									rules={{
										required: true,
										pattern: /[0-9]{4}/i,
										maxLength: 4,
									}}
									helperText={errors.pin ? "A 4-digit PIN is required." : ""}
								/>
							</Grid>
							<Grid item xs={12}>
								<TableContainer component={Paper}>
									<Table className="People">
										<TableHead>
											<TableRow>
												<TableCell>Group Member</TableCell>
												<TableCell>Birthdate</TableCell>
												<TableCell></TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{people.map((person, index) => (
												<TableRow key={person.name + index}>
													<TableCell>
														<TextField
															label="Full Name"
															name={`people[${index}][name]`}
															defaultValue={person.name}
															fullWidth
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
																errors.people[index].name
																	? "This is required"
																	: ""
															}
															inputRef={register({ required: true })}
														/>
													</TableCell>
													<TableCell align="right">
														<TextField
															label="Birthdate"
															name={`people[${index}][birthdate]`}
															type="date"
															defaultValue={person.birthdate}
															fullWidth
															size="small"
															InputLabelProps={{
																shrink: true,
															}}
															helperText={
																errors.people &&
																errors.people[index].birthdate
																	? "This is required"
																	: ""
															}
															onChange={(e) => {
																updatePerson(
																	index,
																	"birthdate",
																	e.target.value
																);
															}}
															inputRef={register({ required: true })}
														/>
													</TableCell>
													<TableCell align="center" padding="checkbox">
														{people.length > 1 && (
															<DeleteIcon
																color="action"
																onClick={(e) => {
																	removePerson(index);
																}}
															/>
														)}
													</TableCell>
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
							<Grid item xs={12}>
								<Button
									variant="contained"
									color="primary"
									onClick={handleSubmit(onSubmit)}
								>
									Submit
								</Button>
							</Grid>
						</Grid>
					</form>
				)}
			</CardContent>
		</Card>
	);
};
