import React, { useGlobal, useEffect, useState } from "reactn";
import "../styles/Venue.scss";
import { useHistory, useParams, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
	Container,
	Typography,
	Grid,
	Card,
	CardContent,
	CardActions,
	Button,
	TextField,
	Toolbar,
	Tooltip,
	IconButton,
	Table,
	Paper,
	TableContainer,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Checkbox,
	Link,
	TableFooter,
	Divider,
} from "@material-ui/core";
import { Delete as DeleteIcon, Airplay } from "@material-ui/icons";
import { TwitterPicker } from "react-color";

const List = () => {
	const history = useHistory();
	const { register, handleSubmit, watch } = useForm();
	const { organizationId, venueId } = useParams();
	const [organizations, setOrganizations] = useGlobal("organizations");
	const [venues, setVenues] = useGlobal("venues");

	const organization = organizations.find((org) => org._id === organizationId);

	const selected = watch("selected");
	const [breadcrumbs, setBreadcrumbs] = useGlobal("breadcrumbs");
	const [modal, setModal] = useGlobal("modal");

	const onSubmit = (data) => {
		if (modal) return;
		setModal({
			title: "Delete Selected Venues(s)?",
			message:
				"Are you certain that you would like to delete the selected venue(s)? You will not be able to reverse this once completed without working directly with a system administrator.",
			cancelText: "Cancel",
			completeText: "Delete",
			onComplete: () => {},
		});
	};

	return (
		<Paper className="Venues">
			<form onSubmit={handleSubmit(onSubmit)}>
				<Toolbar className="Toolbar">
					<Typography className="Title" variant="h6">
						Venues
					</Typography>
					{(selected && selected.length) > 0 && (
						<Tooltip title="Delete">
							<IconButton onClick={handleSubmit(onSubmit)}>
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					)}
				</Toolbar>
				<TableContainer>
					<Table>
						<colgroup>
							{venues.length > 0 && <col />}
							<col width="30%" />
							<col />
							<col width="10%" />
							<col width="10%" />
						</colgroup>
						<TableHead className="TableHead">
							<TableRow>
								{venues.length > 0 && <TableCell padding="checkbox"></TableCell>}
								<TableCell>Venue</TableCell>
								<TableCell>Description</TableCell>
								<TableCell align="right">Code</TableCell>
								<TableCell align="right">Capacity</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{venues.map((venue, index) => (
								<TableRow
									key={venue._id}
									className={
										selected && selected.includes(venue._id)
											? "Venue Selected"
											: "Venue"
									}
								>
									{venues.length > 0 && (
										<TableCell padding="checkbox">
											<Checkbox
												name="selected"
												inputRef={register}
												value={venue._id}
											/>
										</TableCell>
									)}
									<TableCell
										className="Clickable"
										onClick={() => {
											history.push(
												`/admin/dashboard/organizations/${organization._id}/venues/${venue._id}`
											);
										}}
									>
										<div
											className="ColorChip"
											style={{ backgroundColor: venue.color }}
										>
											&nbsp;
										</div>
										{venue.name}
									</TableCell>
									<TableCell
										className="Clickable"
										onClick={() => {
											history.push(
												`/admin/dashboard/organizations/${organization._id}/venues/${venue._id}`
											);
										}}
									>
										{venue.description}
									</TableCell>
									<TableCell align="right">{venue.code.toUpperCase()}</TableCell>
									<TableCell align="right">
										{venue.available}/{venue.capacity}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan="5" className="Actions">
									<Button
										component={RouterLink}
										to={`/admin/dashboard/organizations/${organizationId}/venues/new`}
										color="primary"
									>
										Create
									</Button>
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>
			</form>
		</Paper>
	);
};

const Update = () => {
	const { handleSubmit, register } = useForm();

	const { organizationId, venueId } = useParams();
	const [user] = useGlobal("user");
	const [organizations, setOrganizations] = useGlobal("organizations");
	const [venues, setVenues] = useGlobal("venues");

	const organization = organizations.find((org) => org._id === organizationId);
	const venue =
		venueId === "new"
			? {
					name: "New Venue",
					available: 100,
					capacity: 100,
					description: "",
					address: {
						street1: "",
						street2: "",
						city: "",
						state: "",
						postal: "",
						country: "",
					},
					color: "#40dadd",
					organizationId: organizationId,
			  }
			: venues.find((ven) => ven._id === venueId);

	const [showPicker, setShowPicker] = useState(false);
	const [color, setColor] = useState(venue.color);

	const [breadcrumbs, setBreadcrumbs] = useGlobal("breadcrumbs");
	const [modal, setModal] = useGlobal("modal");

	const history = useHistory();

	const onSubmit = (data) => {
		console.log(data);
		if (modal) return;
		setModal({
			title: "Venue Updated",
			message:
				"The update was successful. Please make sure to reload the check-in app to see changes.",
			cancelText: "Close",
		});
	};

	useEffect(() => {
		setBreadcrumbs([
			{ name: "Dashboard", path: "/admin/dashboard" },
			{ name: "Organizations", path: "/admin/dashboard/organizations" },
			{ name: organization.name, path: `/admin/dashboard/organizations/${organizationId}` },
			{
				name: venue.name,
				path: `/admin/dashboard/organizations/${organizationId}/venues/${venueId}`,
			},
		]);
	}, [setBreadcrumbs]);

	return (
		<Container className="Venue">
			<Grid container spacing={3}>
				<Grid item xs={12} lg={8}>
					<Card>
						<form
							className="VenueForm"
							onSubmit={handleSubmit(onSubmit)}
							autoComplete="off"
						>
							<Toolbar className="Toolbar">
								<Typography variant="h6" component="div" className="Title">
									Venue Details
								</Typography>
								<Typography variant="h6" component="div">
									{venue.available}/{venue.capacity}
								</Typography>
							</Toolbar>
							<CardContent>
								<Grid container spacing={3} className="Venue">
									<Grid item xs={12}>
										{venue._id && (
											<input
												type="hidden"
												value={venue._id}
												name="venue[_id]"
												ref={register}
											/>
										)}
										<TextField
											variant="standard"
											fullWidth
											required
											defaultValue={venue.name}
											label="Venue Name"
											name="venue[name]"
											type="text"
											inputRef={register({ required: true })}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="standard"
											fullWidth
											defaultValue={venue.description}
											label="Description"
											name="venue[description]"
											type="text"
											inputRef={register}
											helperText="A short description to help people find this venue."
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											variant="standard"
											fullWidth
											required
											defaultValue={venue.capacity}
											label="Capacity"
											name="venue[capacity]"
											type="number"
											inputRef={register({ required: true })}
											helperText="The maximum number of people allowed in this venue."
										/>
									</Grid>
									<Grid item xs={6}>
										<TextField
											variant="outlined"
											fullWidth
											autoComplete="off"
											name="venue[color]"
											type="text"
											value={color}
											inputRef={register}
											onFocus={() => {
												setShowPicker(true);
											}}
											inputProps={{
												style: {
													backgroundColor: color,
													color: "#fff",
													borderRadius: "5px",
												},
											}}
											helperText="Click to select a color."
										/>
										{showPicker && (
											<TwitterPicker
												color="#2ccce4"
												onChange={(value) => {
													setColor(value.hex);
													setShowPicker(false);
												}}
											/>
										)}
									</Grid>
								</Grid>
								<Grid container spacing={3} className="Address">
									<Grid item xs={12}>
										<Typography variant="h6">Address</Typography>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="standard"
											fullWidth
											required
											defaultValue={venue.address.street1}
											label="Street Address 1"
											name="venue[address][street1]"
											type="text"
											inputRef={register({ required: true })}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="standard"
											fullWidth
											defaultValue={venue.address.street2}
											label="Street Address 2"
											name="venue[address][street2]"
											type="text"
											inputRef={register}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											variant="standard"
											fullWidth
											required
											defaultValue={venue.address.city}
											label="City"
											name="venue[address][city]"
											type="text"
											inputRef={register({ required: true })}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											variant="standard"
											fullWidth
											required
											defaultValue={venue.address.state}
											label="State"
											name="venue[address][state]"
											type="text"
											inputRef={register({ required: true })}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											variant="standard"
											fullWidth
											required
											defaultValue={venue.address.postal}
											label="ZIP Code"
											name="venue[address][postal]"
											type="text"
											inputRef={register({ required: true })}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											variant="standard"
											fullWidth
											required
											defaultValue={venue.address.country}
											label="Country"
											name="venue[address][country]"
											type="text"
											inputRef={register({
												required: true,
											})}
										/>
									</Grid>
								</Grid>
							</CardContent>
							<CardActions className="Actions">
								<Button type="submit" color="primary">
									Update
								</Button>
							</CardActions>
						</form>
					</Card>
				</Grid>
				<Grid item xs={12} lg={4}>
					<Card className="Tools">
						<Toolbar className="Toolbar">
							<Typography variant="h6" component="div" className="Title">
								Tools
							</Typography>
						</Toolbar>

						<CardContent>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<EmptyVenue {...{ venue }} />
								</Grid>
								<Grid item xs={12}>
									<Divider />
								</Grid>
								<Grid item xs={12}>
									<DownloadCheckins {...{ venue }} />
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
};

const EmptyVenue = (venue) => {
	const { handleSubmit, register } = useForm();
	const [modal, setModal] = useGlobal("modal");

	const onSubmit = (data) => {
		console.log(data);
		if (modal) return;
		setModal({
			title: "This Venue Was Emptied",
			message:
				"This venue has been emptied. Your kiosk should show open spaces within 5 seconds. If not, please check the Internet connection for your kiosk.",
			cancelText: "Close",
		});
	};
	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Typography variant="h6">Empty Venue</Typography>
				<Typography variant="body2">
					Quickly check-out all currently check-in people from this venue by setting an
					exit timestamp on all currently checked in people.
				</Typography>
			</Grid>
			<Grid item xs={12} className="Actions">
				<Button color="inherit" onClick={onSubmit}>
					Empty
				</Button>
			</Grid>
		</Grid>
	);
};

const CheckOutGroup = (venue) => {
	const { handleSubmit, register } = useForm();
	const [modal, setModal] = useGlobal("modal");

	const onSubmit = (data) => {
		console.log(data);
		if (modal) return;
		setModal({
			title: "Group Checked Out Successfully",
			message:
				"The group you chose was checked out from this venue successfully. Other people in the group who may be in other venues are still checked in.",
			cancelText: "Close",
		});
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography variant="h6">Group Check Out</Typography>
					<Typography variant="body2">
						Check out a group from this venue by entering the group telephone number
						below.
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						required
						label="Phone"
						name="phone"
						type="text"
						inputRef={register({ required: true })}
					/>
				</Grid>
				<Grid item xs={12} className="Actions">
					<Button type="submit" color="inherit">
						Check Out
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};

const DownloadCheckins = (venue) => {
	const { handleSubmit, register } = useForm();
	const onSubmit = (data) => {
		console.log(data);
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography variant="h6">Download Check-Ins</Typography>
					<Typography variant="body2">
						Download a CSV table of the check-ins for this venue. You may select a start
						and end date.
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						label="Start"
						name="start"
						type="date"
						inputRef={register}
						InputLabelProps={{ shrink: true }}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						label="End"
						name="end"
						type="date"
						inputRef={register}
						InputLabelProps={{ shrink: true }}
					/>
				</Grid>
				<Grid item xs={12} className="Actions">
					<Button type="submit" color="inherit">
						Download CSV
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};

export default {
	List,
	Update,
};