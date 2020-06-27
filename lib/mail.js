const ejs = require("ejs");
const path = require("path");

const { server, mailgun } = require("../config.json");

const mg = require("mailgun-js")({
	apiKey: mailgun.apiKey,
	domain: mailgun.domain,
});

const resetPassword = (exports.resetPassword = (spec, cb) => {
	const { email, token } = spec;
	const message = ejs.renderFile(
		path.join(__dirname, "../templates/resetPassword.ejs"),
		{
			email,
			url: `${server.https ? "https" : "http"}://${server.hostname}/admin/dashboard/account/?token=${token}`,
		},
		null,
		(error, html) => {
			mg.messages().send(
				{
					from: `${mailgun.from.name} ${mailgun.from.email}`,
					to: email,
					subject: "Password Reset Link Requested",
					html,
				},
				(error, body) => {
					if (error) return cb(error, null);
					// Send the resulting token
					cb(null, body);
				}
			);
		}
	);
});

const createGroup = (exports.createGroup = (spec, cb) => {
	const message = ejs.renderFile(
		path.join(__dirname, "../templates/createGroup.ejs"),
		{
			...spec,
			url: `${server.https ? "https" : "http"}://${server.hostname}/checkin/`,
		},
		null,
		(error, html) => {
			if (error) return cb(error, null);
			mg.messages().send(
				{
					from: `${mailgun.from.name} ${mailgun.from.email}`,
					to: spec.email,
					subject: "Your group was successfully created.",
					html,
				},
				(error, body) => {
					if (error) return cb(error, null);
					// Send the resulting token
					cb(null, body);
				}
			);
		}
	);
});

const updateGroup = (exports.updateGroup = (spec, cb) => {
	const message = ejs.renderFile(
		path.join(__dirname, "../templates/updateGroup.ejs"),
		{
			...spec,
			url: `${server.https ? "https" : "http"}://${server.hostname}/checkin/`,
		},
		null,
		(error, html) => {
			if (error) return cb(error, null);
			mg.messages().send(
				{
					from: `${mailgun.from.name} ${mailgun.from.email}`,
					to: spec.email,
					subject: "Your group was successfully updated.",
					html,
				},
				(error, body) => {
					if (error) return cb(error, null);
					// Send the resulting token
					cb(null, body);
				}
			);
		}
	);
});

const deleteGroup = (exports.deleteGroup = (spec, cb) => {
	const message = ejs.renderFile(
		path.join(__dirname, "../templates/deleteGroup.ejs"),
		{
			...spec,
			url: `${server.https ? "https" : "http"}://${server.hostname}/checkin/`,
		},
		null,
		(error, html) => {
			if (error) return cb(error, null);
			mg.messages().send(
				{
					from: `${mailgun.from.name} ${mailgun.from.email}`,
					to: spec.email,
					subject: "Your group was successfully deleted.",
					html,
				},
				(error, body) => {
					if (error) return cb(error, null);
					// Send the resulting token
					cb(null, body);
				}
			);
		}
	);
});

const resetPIN = (exports.resetPIN = (spec, cb) => {
	console.log(spec);
	const message = ejs.renderFile(
		path.join(__dirname, "../templates/resetPIN.ejs"),
		{
			...spec,
			url: `${server.https ? "https" : "http"}://${server.hostname}/checkin/`,
		},
		null,
		(error, html) => {
			if (error) return cb(error, null);
			mg.messages().send(
				{
					from: `${mailgun.from.name} ${mailgun.from.email}`,
					to: spec.email,
					subject: "Your PIN has been reset.",
					html,
				},
				(error, body) => {
					if (error) return cb(error, null);
					// Send the resulting token
					cb(null, body);
				}
			);
		}
	);
});

