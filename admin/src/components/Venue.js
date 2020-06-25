import React, { useGlobal, useState, useEffect } from "reactn";
import "../styles/Venue.scss";
import { useHistory, useParams, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
	Container,
	Typography,
	Button,
	Table,
	TableHead,
	TableRow,
	TableCell,
	Paper,
	TableContainer,
	TableBody,
	TableFooter,
	Checkbox,
	Toolbar,
	Tooltip,
	IconButton,
	Breadcrumbs,
	Link,
	Grid,
	Card,
	CardContent,
	CardActions,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";

const List = (props) => {
	const { venues, setVenues } = props;
	const { organizationId } = useParams();

	const [modal, setModal] = useGlobal("modal");
	const history = useHistory();
	const { handleSubmit, register, watch } = useForm();
	const selected = watch("venues");

	const onSubmit = (data) => {
		setModal({
			title: "Delete Selected Venues?",
			message:
				"Are you sure you would like to delete the selected venues? This action cannot be undone without assistance from an administrator. Your check-in information for the selected venues will not be deleted, but you will not be able to access it.",
			completeText: "Delete Venues",
			onComplete: () => {
				console.log("Phableted");
			},
			cancelText: "Cancel",
		});
	};

	const gotoVenue = (id) => {
		history.push(`/admin/dashboard/organizations/${organizationId}/venues/${id}`);
	};

	return (
		<div className="Venues">
			<Paper>
				<form className="VenuesForm" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
					<Toolbar
						style={{
							backgroundColor:
								selected && selected.length > 0
									? "rgba(100, 181, 246, 0.2)"
									: "#fafafa",
							borderBottom: "1px solid rgba(224, 224, 224, 1)",
						}}
					>
						<Typography variant="h5" component="div" className="Title">
							Venues
						</Typography>
						{selected && selected.length > 0 && (
							<Tooltip title="Delete">
								<IconButton aria-label="delete" onClick={handleSubmit(onSubmit)}>
									<DeleteIcon />
								</IconButton>
							</Tooltip>
						)}
					</Toolbar>
					<TableContainer>
						<Table>
							<colgroup>
								<col width="5%" />
								<col />
								<col width="15%" />
								<col width="5%" />
							</colgroup>
							<TableHead>
								<TableRow>
									<TableCell padding="checkbox"></TableCell>
									<TableCell>Name</TableCell>
									<TableCell align="center">Capacity</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{venues.length > 0 &&
									venues.map((venue, index) => (
										<TableRow
											key={venue._id}
											style={{
												backgroundColor:
													selected && selected.includes(venue._id)
														? "#fafafa"
														: "#fff",
											}}
										>
											<TableCell padding="checkbox">
												<Checkbox
													name="venues"
													value={venue._id}
													color="primary"
													inputRef={register}
												/>
											</TableCell>
											<TableCell
												onClick={() => {
													gotoVenue(venue._id);
												}}
												style={{ cursor: "pointer" }}
											>
												<div
													className="ColorChip"
													style={{ backgroundColor: venue.color }}
												>
													&nbsp;
												</div>
												{venue.name}
											</TableCell>
											<TableCell align="center">
												{venue.available}/{venue.capacity}
											</TableCell>
										</TableRow>
									))}
							</TableBody>
							<TableFooter>
								<TableRow>
									<TableCell colSpan="3">
										<Button
											component={RouterLink}
											to={`/admin/dashboard/organizations/${organizationId}/venues/new`}
											color="primary"
										>
											Add Venue
										</Button>
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</TableContainer>
				</form>
			</Paper>
		</div>
	);
};

const Update = () => {
	return (
		<Container className="Venue">
			<div className="Navigation">
				<Breadcrumbs>
					<Link component={RouterLink} to="/admin/dashboard" color="inherit">
						Dashboard
					</Link>
					<Link
						component={RouterLink}
						to="/admin/dashboard/organizations"
						color="inherit"
					>
						Organizations
					</Link>
					<Link
						component={RouterLink}
						to="/admin/dashboard/organizations/12345"
						color="inherit"
					>
						Organization Name
					</Link>
					<Link
						component={RouterLink}
						to="/admin/dashboard/organizations/12345/venues/12345"
						color="textPrimary"
					>
						Venue Name
					</Link>
				</Breadcrumbs>
				<Typography component="h1" variant="h4" gutterBottom>
					Update Venue
				</Typography>
			</div>
			<Card>
				<CardContent>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							This
						</Grid>
					</Grid>
				</CardContent>
				<CardActions>
					<Button>Update</Button>
				</CardActions>
			</Card>
		</Container>
	);
};

export default {
	List,
	Update,
};
