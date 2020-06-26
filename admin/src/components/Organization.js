import React, { useGlobal, useEffect, useState } from "reactn";
import "../styles/Organization.scss";
import { useHistory, useParams, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
	Container,
	Breadcrumbs,
	Link,
	Typography,
	Grid,
	Card,
	CardContent,
	CardActions,
	Button,
	CardActionArea,
	TextField,
	Toolbar,
	Tooltip,
	IconButton,
} from "@material-ui/core";
import { Delete as DeleteIcon, AddCircle } from "@material-ui/icons";
import Venue from "./Venue";

const List = () => {
	const [breadcrumbs, setBreadcrumbs] = useGlobal("breadcrumbs");

	useEffect(() => {
		setBreadcrumbs([
			{ name: "Dashboard", path: "/admin/dashboard" },
			{ name: "Organizations", path: "/admin/dashboard/organizations" },
		]);
	}, []);

	return (
		<Container className="Organizations">
			<Grid container spacing={3}>
				<Grid item sm={12} md={6} lg={4} xl={3} className="Organization">
					<Card>
						<CardActionArea
							component={RouterLink}
							to="/admin/dashboard/organizations/12345"
						>
							<Toolbar className="Toolbar">
								<div>
									<Typography variant="h5">Organization Name</Typography>
									<Typography variant="subtitle2">
										Organization Description
									</Typography>
								</div>
							</Toolbar>
							<CardContent>
								<Grid container spacing={3} className="Statistics">
									<Grid item xs={4} className="Stat">
										<Typography variant="h5">10</Typography>
										<Typography variant="caption">User(s)</Typography>
									</Grid>
									<Grid item xs={4} className="Stat">
										<Typography variant="h5">4</Typography>
										<Typography variant="caption">Venue(s)</Typography>
									</Grid>
									<Grid item xs={4} className="Stat">
										<Typography variant="h5">10</Typography>
										<Typography variant="caption">Check-Ins</Typography>
									</Grid>
								</Grid>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
				<Grid item sm={12} md={6} lg={4} xl={3} className="NewOrganization">
					<Card>
						<CardActionArea
							component={RouterLink}
							to="/admin/dashboard/organizations/new"
						>
							<CardContent>
								<AddCircle fontSize="large" />
								<Typography variant="caption">Add an Organization</Typography>
							</CardContent>
						</CardActionArea>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
};

const Update = () => {
	const [modal, setModal] = useGlobal("modal");
	const [organizations, setOrganizations] = useGlobal("organizations");
	const [breadcrumbs, setBreadcrumbs] = useGlobal("breadcrumbs");

	const { organizationId } = useParams();
	const { handleSubmit, register } = useForm();
	const history = useHistory();

	const [organization, setOrganization] = useState();
	const [venues, setVenues] = useState([
		{
			_id: "5ee6bf3c32aa634c0cb2057d",
			name: "Venue 1",
			description: "Description",
			capacity: 100,
			available: 90,
			code: "ee83e",
			color: "#2ccce4",
		},
		{
			_id: "5ee6bf3c32aa634c0cb2057h",
			name: "Venue 1",
			description: "Description",
			capacity: 100,
			available: 90,
			code: "ee83e",
			color: "#2ccce4",
		},
		{
			_id: "5ee6bf3c32aa634c0cb205fh",
			name: "Venue 1",
			description: "Description",
			capacity: 100,
			available: 90,
			code: "ee83e",
			color: "#2ccce4",
		},
	]);
	const [users, setUsers] = useState([
		{
			_id: "5ee29b67f705972be82f742a",
			active: true,
			isAdmin: true,
			email: "chris.frazier@managedword.com",
			name: "Christopher Frazier",
		},
		{
			_id: "5ee2a04acf89722eac7a4938",
			active: true,
			isAdmin: false,
			name: "Test",
			email: "chris.frazier2@managedword.com",
		},
	]);

	const onSubmit = (data) => {
		console.log(data);
	};

	const onDelete = () => {
		if (modal) return;
		setModal({
			title: "Delete This Organization?",
			message:
				"Are you certain that you would like to delete this organization? You will not be able to reverse this once completed without working directly with a system administrator.",
			cancelText: "Cancel",
			completeText: "Delete",
			onComplete: () => {},
		});
	};

	useEffect(() => {
		setBreadcrumbs([
			{ name: "Dashboard", path: "/admin/dashboard" },
			{ name: "Organizations", path: "/admin/dashboard/organizations" },
			{ name: "Organization Name", path: `/admin/dashboard/organizations/${organizationId}` },
		]);
	}, [setBreadcrumbs]);

	return (
		<Container className="Organization">
			<Grid container spacing={3}>
				<Grid item sm={12} lg={8}>
					<form
						className="OrganizationForm"
						onSubmit={handleSubmit(onSubmit)}
						autoComplete="off"
					>
						<Card>
							<Toolbar className="Toolbar">
								<Typography variant="h5" component="div" className="Title">
									Organization Details
								</Typography>
								<Tooltip title="Delete">
									<IconButton aria-label="delete" onClick={onDelete}>
										<DeleteIcon />
									</IconButton>
								</Tooltip>
							</Toolbar>
							<CardContent>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<TextField
											variant="standard"
											fullWidth
											required
											autoFocus
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
											label="Website URL"
											name="organization[url]"
											type="url"
											inputRef={register({ required: true })}
										/>
									</Grid>
								</Grid>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<Typography variant="h6">Address</Typography>
										<TextField
											variant="standard"
											fullWidth
											required
											label="Street Address 1"
											name="organization[address][street1]"
											type="text"
											inputRef={register({ required: true })}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="standard"
											fullWidth
											label="Street Address 2"
											name="organization[address][street2]"
											type="text"
											inputRef={register}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											variant="standard"
											fullWidth
											required
											label="City"
											name="organization[address][city]"
											type="text"
											inputRef={register({ required: true })}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											variant="standard"
											fullWidth
											required
											label="State"
											name="organization[address][state]"
											type="text"
											inputRef={register({ required: true })}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											variant="standard"
											fullWidth
											required
											label="ZIP Code"
											name="organization[address][postal]"
											type="text"
											inputRef={register({ required: true })}
										/>
									</Grid>
									<Grid item xs={12} md={6}>
										<TextField
											variant="standard"
											fullWidth
											required
											label="Country"
											name="organization[address][country]"
											type="text"
											inputRef={register({
												required: true,
											})}
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
											name="organization[approvals]"
											type="text"
											inputRef={register}
											helperText="Each line is treated as a separate approval."
										/>
									</Grid>
								</Grid>
							</CardContent>
							<CardActions>
								<Button type="submit" color="primary">
									Update
								</Button>
							</CardActions>
						</Card>
					</form>
				</Grid>
				<Grid item sm={12} lg={4}>
					<Venue.List {...{ venues, setVenues }} />
				</Grid>
			</Grid>
		</Container>
	);
};

const Users = (props) => {
	const { users, setUsers } = props;
};

export default {
	List,
	Update,
};
