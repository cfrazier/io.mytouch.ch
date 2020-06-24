import React, { useGlobal, useEffect } from "reactn";
import "../styles/Modals.scss";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from "@material-ui/core";

const Modal = () => {
	const [modal, setModal] = useGlobal("modal");

	const handleComplete = () => {
		if (modal.onComplete) modal.onComplete();
		setModal(null);
	};

	const handleCancel = () => {
		if (modal.onCancel) modal.onCancel();
		setModal(null);
	};

	useEffect(() => {}, [modal]);

	return (
		<Dialog open={modal !== null} onClose={handleCancel}>
			{modal && (
				<>
					<DialogTitle>{modal.title}</DialogTitle>
					<DialogContent>
						<DialogContentText>{modal.message}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCancel} color="primary">
							{modal.cancelText}
						</Button>
						{modal.completeText && (
							<Button onClick={handleComplete} color="primary" autoFocus>
								{modal.completeText}
							</Button>
						)}
					</DialogActions>
				</>
			)}
		</Dialog>
	);
};

export default Modal;
