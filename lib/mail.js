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
			url: `${server.https ? "https" : "http"}://${server.hostname}:${
				server.port
			}/account/?token=${token}`,
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
