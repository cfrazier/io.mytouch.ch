import React, { useState, useGlobal } from "reactn";
import clsx from "clsx";
import { Switch, Route, Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
	CssBaseline,
	Drawer,
	AppBar,
	Toolbar,
	List,
	Typography,
	Divider,
	IconButton,
	Container,
	ListItem,
	ListItemIcon,
	ListItemText,
	Breadcrumbs,
	Link,
} from "@material-ui/core/";
import {
	ChevronLeft as ChevronLeftIcon,
	Menu as MenuIcon,
	AccountCircle,
	ExitToApp,
	Business,
	Speed,
} from "@material-ui/icons/";

import Account from "./Account";
import Copyright from "./Copyright";
import Dashboard from "./Dashboard";
import Organization from "./Organization";
import Venue from "./Venue";
import { useEffect } from "react";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
	},
	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
	},
	toolbarIcon: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		padding: "0 8px",
		...theme.mixins.toolbar,
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	breadCrumb: {
		padding: "8px 24px",
		width: "100%",
		maxWidth: "100%",
		margin: "0",
		backgroundColor: "#fff",
	},
	breadCrumbShift: {},
	menuButton: {
		marginRight: 36,
	},
	menuButtonHidden: {
		display: "none",
	},
	title: {
		flexGrow: 1,
	},
	drawerPaper: {
		position: "relative",
		whiteSpace: "nowrap",
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerPaperClose: {
		overflowX: "hidden",
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: theme.spacing(7),
		[theme.breakpoints.up("sm")]: {
			width: theme.spacing(9),
		},
	},
	menuList: {
		marginTop: "40px",
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuListOpen: {
		marginTop: "0",
	},
	appBarSpacer: {
		height: "104px",
		...theme.mixins.toolbar,
	},
	content: {
		flexGrow: 1,
		height: "100vh",
		overflow: "auto",
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	paper: {
		padding: theme.spacing(2),
		display: "flex",
		overflow: "auto",
		flexDirection: "column",
	},
	fixedHeight: {
		height: 240,
	},
}));

export default function Admin() {
	const classes = useStyles();
	const [open, setOpen] = useState(true);
	const [breadcrumbs, setBreadcrumbs] = useGlobal("breadcrumbs");
	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		setBreadcrumbs([{ name: "Dashboard", path: "/admin/dashboard" }]);
	}, []);

	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar
				position="absolute"
				className={clsx(classes.appBar, open && classes.appBarShift)}
			>
				<Toolbar className={classes.toolbar}>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						component="h1"
						variant="h6"
						color="inherit"
						noWrap
						className={classes.title}
					>
						Dashboard
					</Typography>
				</Toolbar>
				<Container className={clsx(classes.breadCrumb, open && classes.breadCrumbShift)}>
					<Breadcrumbs>
						{breadcrumbs.map((crumb, index) => (
							<Link
								component={RouterLink}
								to={crumb.path}
								color={index === breadcrumbs.length - 1 ? "textPrimary" : "inherit"}
								key={`crumb_${index}`}
							>
								{crumb.name}
							</Link>
						))}
					</Breadcrumbs>
				</Container>
			</AppBar>
			<Drawer
				variant="permanent"
				classes={{
					paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
				}}
				open={open}
			>
				<div className={classes.toolbarIcon}>
					<IconButton onClick={handleDrawerClose}>
						<ChevronLeftIcon />
					</IconButton>
				</div>
				<Divider />
				<List className={clsx(classes.menuList, open && classes.menuListOpen)}>
					<ListItem button component={RouterLink} to="/admin/dashboard/">
						<ListItemIcon>
							<Speed />
						</ListItemIcon>
						<ListItemText primary="Dashboard" />
					</ListItem>
					<ListItem button component={RouterLink} to="/admin/dashboard/organizations">
						<ListItemIcon>
							<Business />
						</ListItemIcon>
						<ListItemText primary="Organization" />
					</ListItem>
					<ListItem button component={RouterLink} to="/admin/dashboard/account">
						<ListItemIcon>
							<AccountCircle />
						</ListItemIcon>
						<ListItemText primary="Account" />
					</ListItem>
					<ListItem button>
						<ListItemIcon>
							<ExitToApp />
						</ListItemIcon>
						<ListItemText primary="Log Out" />
					</ListItem>
				</List>
			</Drawer>
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Container maxWidth="lg" className={classes.container}>
					<Switch>
						<Route path="/admin/dashboard/organizations/:organizationId/venues/:venudId">
							<Venue.Update />
						</Route>
						<Route path="/admin/dashboard/organizations/:organizationId">
							<Organization.Update />
						</Route>
						<Route path="/admin/dashboard/organizations">
							<Organization.List />
						</Route>
						<Route path="/admin/dashboard/account">
							<Account />
						</Route>
						<Route path="/admin/dashboard">
							<Dashboard />
						</Route>
					</Switch>
				</Container>
				<Copyright />
			</main>
		</div>
	);
}
