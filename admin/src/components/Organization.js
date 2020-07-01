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
import { Delete as DeleteIcon, Airplay } from "@material-ui/icons";

import Venue from "./Venue";
import Loading from "./Loading";
import httpFetch from "../services/http";

const List = () => {
	const history = useHistory();
	const { register, handleSubmit, watch } = useForm();
	const [breadcrumbs, setBreadcrumbs] = useGlobal("breadcrumbs");
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
				console.log(response);
				setOrganizations(response);
			}
		});
	};

	useEffect(() => {
		if (!organizations) {
			getOrganizations();
		}
	}, [organizations]);

	const onSubmit = (data) => {
		if (modal) return;
		setModal({
			title: "Delete Selected Organization(s)?",
			message:
				"Are you certain that you would like to delete the selected organization(s)? You will not be able to reverse this once completed without working directly with a system administrator.",
			cancelText: "Cancel",
			completeText: "Delete",
			onComplete: () => {
				data.selected.forEach((organizationId) => {
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

	const [breadcrumbs, setBreadcrumbs] = useGlobal("breadcrumbs");
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
						title: "Organization Updated",
						message:
							"The update was successful. Please make sure to reload the check-in app to see changes.",
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
	}, [organization]);

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
									Update
								</Button>
							</CardActions>
						</form>
					</Card>
				</Grid>
				{organization._id && (
					<Grid item xs={12} sm={4}>
						<Users userIds={organization.users} />
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
	}, [organizationId]);

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
