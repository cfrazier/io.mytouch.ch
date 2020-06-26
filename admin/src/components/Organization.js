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
import { Delete as DeleteIcon, AddCircle, Airplay } from "@material-ui/icons";

import Venue from "./Venue";

const List = () => {
	const history = useHistory();
	const { register, handleSubmit, watch } = useForm();
	const [organizations, setOrganizations] = useGlobal("organizations");
	const selected = watch("selected");

	const [breadcrumbs, setBreadcrumbs] = useGlobal("breadcrumbs");
	const [modal, setModal] = useGlobal("modal");

	useEffect(() => {
		setBreadcrumbs([
			{ name: "Dashboard", path: "/admin/dashboard" },
			{ name: "Organizations", path: "/admin/dashboard/organizations" },
		]);
	}, []);

	const onSubmit = (data) => {
		if (modal) return;
		setModal({
			title: "Delete Selected Organization(s)?",
			message:
				"Are you certain that you would like to delete the selected organization(s)? You will not be able to reverse this once completed without working directly with a system administrator.",
			cancelText: "Cancel",
			completeText: "Delete",
			onComplete: () => {},
		});
	};

	return (
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
							<col width="20%" />
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

	const { organizationId } = useParams();
	const [organizations, setOrganizations] = useGlobal("organizations");
	const [user] = useGlobal("user");
	const [venues, setVenues] = useGlobal("venues");
	const organization =
		organizationId === "new"
			? {
					name: "New Organization",
					description: "",
					url: "",
					users: [user._id],
					approvals: [],
			  }
			: organizations.find((org) => org._id === organizationId);

	const [breadcrumbs, setBreadcrumbs] = useGlobal("breadcrumbs");
	const [modal, setModal] = useGlobal("modal");

	const history = useHistory();

	const onSubmit = (data) => {
		console.log(data);
		if (modal) return;
		setModal({
			title: "Organization Updated",
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
		]);
	}, [setBreadcrumbs]);

	return (
		<Container className="Organization">
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
										window.open(`/kiosk/${organizationId}`, "_blank");
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
									autoFocus
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
			<Venue.List />
		</Container>
	);
};

export default {
	List,
	Update,
};
