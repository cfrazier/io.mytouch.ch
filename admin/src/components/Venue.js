import React, { useGlobal, useState, useEffect } from "reactn";
import "../styles/Venue.scss";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
	Typography,
	Button,
	Toolbar,
	Tooltip,
	IconButton,
	Grid,
	Card,
	CardContent,
	CardActions,
	CardActionArea,
	TextField,
} from "@material-ui/core";
import { Delete as DeleteIcon, AddCircle } from "@material-ui/icons";
import { TwitterPicker } from "react-color";

const List = (props) => {
	const { venues, setVenues } = props;
	const [modal, setModal] = useGlobal("modal");
	const { organizationId } = useParams();
	const [selected, setSelected] = useState();

	const onDelete = (venueId) => {
		if (modal) return;
		setModal({
			title: "Delete This Venue?",
			message:
				"Are you certain that you would like to delete this venue? You will not be able to reverse this once completed without working directly with a system administrator.",
			cancelText: "Cancel",
			completeText: "Delete",
			onComplete: () => {},
		});
	};

	return (
		<Grid container spacing={3} className="Venues">
			{venues.map((venue, index) => (
				<Grid item key={venue._id} sm={12} md={6} lg={12} className="Venue">
					{selected === venue._id ? (
						<Update {...{ venue, setVenues, setSelected }} />
					) : (
						<Overview {...{ venue, setSelected, onDelete }} />
					)}
				</Grid>
			))}
			<Grid item sm={12} md={6} lg={12} className="NewVenue">
				<Card>
					<CardActionArea>
						<CardContent>
							<AddCircle fontSize="large" />
							<Typography variant="caption">Add a New Venue</Typography>
						</CardContent>
					</CardActionArea>
				</Card>
			</Grid>
		</Grid>
	);
};

const Overview = (props) => {
	const { venue, onDelete, setSelected } = props;
	return (
		<Card>
			<Toolbar style={{ backgroundColor: venue.color }} className="Toolbar">
				<div className="Title">
					<Typography variant="h5">{venue.name}</Typography>
					<Typography variant="subtitle2">{venue.description}</Typography>
				</div>
				<Tooltip title="Delete">
					<IconButton aria-label="delete" onClick={onDelete}>
						<DeleteIcon style={{ color: "#fff" }} />
					</IconButton>
				</Tooltip>
			</Toolbar>
			<CardActionArea>
				<CardContent
					onClick={() => {
						setSelected(venue._id);
					}}
				>
					<Grid container spacing={3} className="Details">
						<Grid item xs={6} className="Detail">
							<Typography variant="h5">{venue.code.toUpperCase()}</Typography>
							<Typography variant="caption">Code</Typography>
						</Grid>
						<Grid item xs={6} className="Detail">
							<Typography variant="h5">
								{venue.available}/{venue.capacity}
							</Typography>
							<Typography variant="caption">Capacity</Typography>
						</Grid>
					</Grid>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

const Update = (props) => {
	const { venue, setVenues, setSelected } = props;
	const [modal, setModal] = useGlobal("modal");
	const { register, handleSubmit } = useForm();
	const [color, setColor] = useState("#2ccce4");
	const [showPicker, setShowPicker] = useState(false);

	const onUpdate = (data) => {
		console.log(data);
		setSelected();
	};

	const onEmpty = () => {
		if (modal) return;
		setModal({
			title: "Empty This Venue?",
			message:
				"Emptying this venue will open up all of the available attendee spaces and set an exit timestamp for all check-in attendees. Are you sure you want to do this?",
			cancelText: "Cancel",
			completeText: "Empty",
			onComplete: () => {
				setSelected();
			},
		});
	};

	const onGetCheckIns = () => {
		if (modal) return;
		const getCheckIns = (data) => {};
		setModal({
			title: "Download Check-Ins",
			message: (
				<form onSubmit={handleSubmit(getCheckIns)}>
					<Typography variant="body2">
						Using this tool you can generate a CSV file of the check-ins for this venue.
						To restrict the results to a specific timeframe, set the start and end dates
						below.
					</Typography>
					<br></br>
					<Grid container spacing={3}>
						<Grid item xs={6}>
							<TextField
								fullWidth
								autoFocus
								type="date"
								label="Start Date"
								inputRef={register}
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								fullWidth
								type="date"
								label="End Date"
								inputRef={register}
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>
					</Grid>
					<br></br>
				</form>
			),
			cancelText: "Cancel",
			completeText: "Download",
			onComplete: () => {
				setSelected();
			},
		});
	};

	useEffect(() => {}, []);
	return (
		<Card>
			<form onSubmit={handleSubmit(onUpdate)}>
				<CardContent>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							{venue._id && (
								<input ref={register} type="hidden" name="venue[_id]" value={venue._id} />
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
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="standard"
								fullWidth
								required
								defaultValue={venue.capacity}
								label="Capacity"
								name="venue[capacity]"
								type="number"
								inputRef={register({ required: true })}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								fullWidth
								autoComplete="off"
								defaultValue={venue.color}
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
				</CardContent>
				<CardActions>
					<Button type="submit">Update</Button>
					<Button onClick={onEmpty}>Empty</Button>
					<Button onClick={onGetCheckIns}>Check-Ins</Button>
				</CardActions>
			</form>
		</Card>
	);
};

export default {
	List,
};
