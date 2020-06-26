import React, { useState } from "reactn";
import "../styles/Onboard.scss";
import { useHistory } from "react-router-dom";
import { Container, Typography, TextField, Grid, Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { TwitterPicker } from "react-color";
import Copyright from "./Copyright";

const Onboard = () => {
	const history = useHistory();
	const { handleSubmit, register } = useForm();

	const [showPicker, setShowPicker] = useState(false);
	const [color, setColor] = useState("#2ccce4");

	const onSubmit = (data) => {
		console.log(data);
		history.push("/admin/dashboard");
	};

	return (
		<Container className="Onboard" maxWidth="sm">
			<form className="OnboardForm" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
				<Grid container spacing={3} className="Organization">
					<Grid item xs={12}>
						<Typography component="h1" variant="h5">
							Set Up Your Organization
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant="outlined"
							fullWidth
							required
							autoFocus
							label="Organization Name"
							name="organization[name]"
							type="text"
							inputRef={register({ required: true })}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant="outlined"
							fullWidth
							label="Description or Tagline"
							name="organization[description]"
							type="text"
							inputRef={register}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant="outlined"
							fullWidth
							required
							label="Website URL"
							name="organization[url"
							type="url"
							inputRef={register({
								required: true,
								pattern: /(^http[s]?:\/{2})|(^www)|(^\/{1,2})/,
							})}
						/>
					</Grid>
				</Grid>
				<Grid container spacing={3} className="Venue">
					<Grid item xs={12}>
						<Typography variant="h6">Venue</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant="outlined"
							fullWidth
							required
							label="Venue Name"
							name="venue[name]"
							type="text"
							inputRef={register({ required: true })}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant="outlined"
							fullWidth
							label="Description"
							name="venue[description]"
							type="text"
							inputRef={register}
							helperText="A short description to help people find this venue."
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant="outlined"
							fullWidth
							required
							label="Capacity"
							name="venue[capacity]"
							type="number"
							inputRef={register({ required: true })}
							helperText="The maximum number of people allowed in this venue."
						/>
					</Grid>
					<Grid item xs={12}>
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
							helperText="We use color to distinguish venues. Please click to select a color."
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
						<Typography variant="h6">Venue Address</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant="outlined"
							fullWidth
							required
							label="Street Address 1"
							name="venue[address][street1]"
							type="text"
							inputRef={register({ required: true })}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant="outlined"
							fullWidth
							label="Street Address 2"
							name="venue[address][street2]"
							type="text"
							inputRef={register}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							variant="outlined"
							fullWidth
							required
							label="City"
							name="venue[address][city]"
							type="text"
							inputRef={register({ required: true })}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							variant="outlined"
							fullWidth
							required
							label="State"
							name="venue[address][state]"
							type="text"
							inputRef={register({ required: true })}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							variant="outlined"
							fullWidth
							required
							label="ZIP Code"
							name="venue[address][postal]"
							type="text"
							inputRef={register({ required: true })}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<TextField
							variant="outlined"
							fullWidth
							required
							label="Country"
							name="venue[address][country]"
							type="text"
							inputRef={register({
								required: true,
							})}
						/>
					</Grid>
				</Grid>
				<Grid container spacing={3} className="Actions">
					<Grid item xs={12}>
						<Button type="submit" fullWidth variant="contained" color="primary">
							Continue
						</Button>
					</Grid>
				</Grid>
			</form>
			<Copyright />
		</Container>
	);
};

export default Onboard;
