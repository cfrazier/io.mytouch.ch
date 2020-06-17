import React, { useState } from "reactn";
import { Typography, Card, CardContent, Grid, Button } from "@material-ui/core";
import "../styles/Alert.scss";

export const Alert = (props) => {
	const { alert, setAlert } = props;

	const handleClose = () => {
		clearTimeout(timer);
		if (alert.onClose) alert.onClose();
		setAlert(undefined);
	};

	const [timer] = useState(alert.auto ? setTimeout(handleClose, alert.auto) : null);

	return (
		<div className="Alert">
			<Card raised className="AlertWindow">
				<CardContent>
					<Grid container spacing={3}>
						<Grid item xs={12} className="Header">
							<Typography variant="h5" gutterBottom>
								{alert.title}
							</Typography>
							<Typography variant="body2">{alert.message}</Typography>
						</Grid>
						<Grid item xs={12}>
							<Button variant="contained" color="primary" onClick={handleClose}>
								{alert.button}
							</Button>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</div>
	);
};
