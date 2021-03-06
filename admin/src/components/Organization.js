import React, { useGlobal, useEffect, useState } from "reactn";
import "../styles/Organization.scss";
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
} from "@material-ui/core";
import { Delete as DeleteIcon, Airplay, Help } from "@material-ui/icons";

import Venue from "./Venue";
import Loading from "./Loading";
import httpFetch from "../services/http";

const List = () => {
	const history = useHistory();
	const { register, handleSubmit, watch } = useForm();
	const [, setBreadcrumbs] = useGlobal("breadcrumbs");
	const [modal, setModal] = useGlobal("modal");

	const [organizations, setOrganizations] = useState();
	const selected = watch("selected");

	useEffect(() => {
		setBreadcrumbs([
			{ name: "Dashboard", path: "/admin/dashboard" },
			{ name: "Organizations", path: "/admin/dashboard/organizations" },
		]);
	}, [setBreadcrumbs]);

	const getOrganizations = () => {
		httpFetch("get", "/api/organizations", null, (error, response) => {
			if (error) {
				if (modal) return;
				setModal({
					title: "An Error Occurred",
					message:
						"There was an error communicating with the server. Please check your Internet connection to make sure everything is working correctly.",
					cancelText: "Try Again",
				});
			} else {
				setOrganizations(response);
				if (response.length === 0) {
					if (modal) return;
					setModal({
						title: "Welcome to Your Dashboard",
						message:
							"This is your organization's dashboard. From here, you can quickly navigate the organizations you manage and create new organizations as needed. Click 'Create Organization' below to begin setting up your first organization.",
						cancelText: "Create Organization",
						onCancel: () => {
							history.push("/admin/dashboard/organizations/new");
						},
					});
				}
			}
		});
	};

	useEffect(() => {
		if (!organizations) {
			getOrganizations();
		}
	}, [organizations]); // eslint-disable-line react-hooks/exhaustive-deps

	const onSubmit = (data) => {
		if (modal) return;
		setModal({
			title: "Delete Selected Organization(s)?",
			message:
				"Are you certain that you would like to delete the selected organization(s)? You will not be able to reverse this once completed without working directly with a system administrator.",
			cancelText: "Cancel",
			completeText: "Delete",
			onComplete: () => {
				const selected = Array.isArray(data.selected) ? data.selected : [data.selected];
				selected.forEach((organizationId) => {
					httpFetch(
						"delete",
						`/api/organizations/${organizationId}`,
						null,
						(error, response) => {
							if (error || response.error) {
								console.log(error, response.error);
							} else {
								getOrganizations();
							}
						}
					);
				});
			},
		});
	};

	return !organizations ? (
		<Loading />
	) : (
		<Paper className="Organizations">
			<form onSubmit={handleSubmit(onSubmit)}>
				<Toolbar className="Toolbar">
					<Typography className="Title" variant="h6">
						Organizations
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
							{organizations.length > 0 && <col />}
							<col />
							<col />
							<col width="10%" />
						</colgroup>
						<TableHead className="TableHead">
							<TableRow>
								{organizations.length > 0 && (
									<TableCell padding="checkbox"></TableCell>
								)}
								<TableCell>Organization</TableCell>
								<TableCell>Website</TableCell>
								<TableCell>Users</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{organizations.map((organization, index) => (
								<TableRow
									key={organization._id}
									className={
										selected && selected.includes(organization._id)
											? "Organization Selected"
											: "Organization"
									}
								>
									{organizations.length > 0 && (
										<TableCell padding="checkbox">
											<Checkbox
												name="selected"
												inputRef={register}
												value={organization._id}
											/>
										</TableCell>
									)}
									<TableCell
										className="Clickable"
										onClick={() => {
											history.push(
												`/admin/dashboard/organizations/${organization._id}`
											);
										}}
									>
										{organization.name}
									</TableCell>
									<TableCell>
										<Link href={organization.url}>{organization.url}</Link>
									</TableCell>
									<TableCell>{organization.users.length}</TableCell>
								</TableRow>
							))}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan={4} className="Actions">
									<Button
										component={RouterLink}
										to="/admin/dashboard/organizations/new"
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
	const history = useHistory();

	const [, setBreadcrumbs] = useGlobal("breadcrumbs");
	const [modal, setModal] = useGlobal("modal");
	const { organizationId } = useParams();

	const [organization, setOrganization] = useState();
	const [user] = useGlobal("user");
	const [venues, setVenues] = useState();

	const onSubmit = (data) => {
		const { organization } = data;
		// Split up the approvals into an array
		organization.approvals = organization.approvals.split("\n");
		// Set the correct method and path
		const method = organization._id ? "put" : "post";
		const path = organization._id
			? `/api/organizations/${organization._id}`
			: "/api/organizations";
		httpFetch(method, path, { organization }, (error, response) => {
			if (error) {
				if (modal) return;
				setModal({
					title: "An Error Occurred",
					message:
						"There was an error communicating with the server. Please check your Internet connection to make sure everything is working correctly.",
					cancelText: "Try Again",
				});
			} else {
				if (response.error) {
					if (modal) return;
					setModal({
						title: "Update Problems",
						message: `There was a problem with your update: ${response.error.message}`,
						cancelText: "Try Again",
					});
				} else {
					if (modal) return;
					setModal({
						title: "Organization Saved",
						message:
							"The organization information was saved. Please make sure to reload the check-in app to see changes.",
						cancelText: "Close",
						onCancel: () => {
							setOrganization(response);
							history.push(`/admin/dashboard/organizations/${response._id}`);
						},
					});
				}
			}
		});
	};

	useEffect(() => {
		if (!organization) {
			if (organizationId === "new") {
				setOrganization({
					name: "New Organization",
					description: "",
					url: "",
					users: [user._id],
					approvals: [""],
				});
			} else {
				httpFetch(
					"get",
					`/api/organizations/${organizationId}`,
					null,
					(error, response) => {
						if (error) {
							if (modal) return;
							setModal({
								title: "An Error Occurred",
								message:
									"There was an error communicating with the server. Please check your Internet connection to make sure everything is working correctly.",
								cancelText: "Try Again",
							});
						} else {
							if (response.error) {
								if (modal) return;
								setModal({
									title: "We Could Not Load This Organization",
									message:
										"There was a problem accessing this organization. You may not have rights to view or edit. Please contact an administrator if this persists.",
									cancelText: "Try Again",
								});
							} else {
								setOrganization(response);
							}
						}
					}
				);
			}
		} else {
			setBreadcrumbs([
				{ name: "Dashboard", path: "/admin/dashboard" },
				{ name: "Organizations", path: "/admin/dashboard/organizations" },
				{
					name: organization.name,
					path: `/admin/dashboard/organizations/${organizationId}`,
				},
			]);
		}
	}, [organization, organizationId, modal, user._id]); // eslint-disable-line react-hooks/exhaustive-deps

	return !organization ? (
		<Loading />
	) : (
		<Container className="Organization">
			<Grid container spacing={3}>
				<Grid item xs={12} sm={8}>
					<Card>
						<form
							className="OrganizationForm"
							onSubmit={handleSubmit(onSubmit)}
							autoComplete="off"
						>
							{organization._id && (
								<input
									type="hidden"
									name="organization[_id]"
									ref={register}
									value={organization._id}
								/>
							)}
							<Toolbar className="Toolbar">
								<Typography variant="h6" component="div" className="Title">
									Organization Details
								</Typography>
								{organization._id && (
									<Tooltip title="View Kiosk">
										<IconButton
											onClick={() => {
												window.open(
													`/kiosk/organizations/${organizationId}`,
													"_blank"
												);
											}}
										>
											<Airplay />
										</IconButton>
									</Tooltip>
								)}
							</Toolbar>
							<CardContent>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<TextField
											variant="standard"
											fullWidth
											required
											defaultValue={organization.name}
											label="Organization Name"
											name="organization[name]"
											type="text"
											inputRef={register({ required: true })}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											variant="standard"
											fullWidth
											defaultValue={organization.description}
											label="Description or Tagline"
											name="organization[description]"
											type="text"
											inputRef={register}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											variant="standard"
											fullWidth
											required
											defaultValue={organization.url}
											label="Website URL"
											name="organization[url]"
											type="url"
											inputRef={register({ required: true })}
										/>
									</Grid>
									<Grid item xs={12}>
										<Typography variant="h6" gutterBottom>
											Approvals
										</Typography>
										<TextField
											variant="outlined"
											fullWidth
											multiline
											defaultValue={organization.approvals.join("\n")}
											name="organization[approvals]"
											type="text"
											inputRef={register}
											helperText="Each line is treated as a separate approval."
										/>
									</Grid>
								</Grid>
							</CardContent>
							<CardActions className="Actions">
								<Button type="submit" color="primary">
									{organization._id ? "Update" : "Create"}
								</Button>
							</CardActions>
						</form>
					</Card>
				</Grid>
				{organization._id ? (
					<Grid item xs={12} sm={4}>
						<Users userIds={organization.users} />
					</Grid>
				) : (
					<Grid item xs={12} sm={4}>
						<Card className="GettingStarted">
							<Toolbar className="Toolbar">
								<Typography variant="h6" component="div" className="Title">
									<Help className="Icon" /> Getting Started
								</Typography>
							</Toolbar>
							<CardContent>
								<Typography variant="body2">
									Organizations are how we organize event venues. An organization
									can be a single location like a church or office building, or it
									can be a collection of different locations. The choice is yours.
									The main thing to keep in mind is that approvals are shared
									between venues in an organization.
								</Typography>
								<Typography variant="h6">Approvals</Typography>
								<Typography variant="body2">
									Approvals are the statements an attendee must agree to before
									attending an event. These can include terms of service, photo
									releases, health screenings, etc. Each new line of your
									approvals is treated as a separate question.
								</Typography>
								<Typography variant="h6">
									<Airplay className="Icon" />
									Kiosks
								</Typography>
								<Typography variant="body2">
									To help attendees check-in, a kiosk screen is provided for you
									to display at your event. The organization kiosk displays all of
									the available venues, while the venue kiosk displays only the
									information for a single kiosk. The links for these screens are
									available by clicking on the screen icon after saving your
									organization information.
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				)}
			</Grid>
			<Venue.List {...{ venues, setVenues }} />
		</Container>
	);
};

const Users = () => {
	const { organizationId } = useParams();
	const [modal, setModal] = useGlobal("modal");
	const [auth] = useGlobal("user");
	const { register, handleSubmit, watch } = useForm();
	const selected = watch("selected");

	const [users, setUsers] = useState([]);

	useEffect(() => {
		httpFetch("get", `/api/organizations/${organizationId}/users`, null, (error, response) => {
			if (error) {
				if (modal) return;
				setModal({
					title: "An Error Occurred",
					message:
						"There was an error communicating with the server. Please check your Internet connection to make sure everything is working correctly.",
					cancelText: "Try Again",
				});
			} else {
				if (response.error) {
					if (modal) return;
					setModal({
						title: "We Could Not Load This Organization",
						message:
							"There was a problem accessing this organization. You may not have rights to view or edit. Please contact an administrator if this persists.",
						cancelText: "Try Again",
					});
				} else {
					setUsers(response);
				}
			}
		});
	}, [organizationId, modal]); // eslint-disable-line react-hooks/exhaustive-deps

	const onSubmit = (data) => {
		console.log(data);
	};
	return (
		<Paper className="Users">
			<form onSubmit={handleSubmit(onSubmit)}>
				<Toolbar className="Toolbar">
					<Typography variant="h6" component="div" className="Title">
						Users
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
						<TableBody>
							{users.map((user) =>
								auth._id !== user._id ? (
									<TableRow key={user._id}>
										<TableCell padding="checkbox">
											<Checkbox
												name="selected"
												inputRef={register}
												value={user._id}
											/>
										</TableCell>
										<TableCell>{user.name}</TableCell>
									</TableRow>
								) : (
									<TableRow key={user._id}>
										<TableCell colSpan={2}>{user.name}</TableCell>
									</TableRow>
								)
							)}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell colSpan="6" className="Actions">
									<Button color="primary">Add User</Button>
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>
			</form>
		</Paper>
	);
};

export default {
	List,
	Update,
};
