import { ObjectId } from "mongodb";

export const templates = [
	{
		_id: new ObjectId(),
		title: "Forget Password",
		fields: [
			{ message: "User Name", code: "{%user_name%}" },
			{ message: "User Email", code: "{%user_email%}" },
			{ message: "Company Name", code: "{%company_name%}" },

		],
		used_for: "forget_password",
		subject: "Reset your {%company_name%} password",
		message: `<h4>Hello {%user_name%}</h4><p>We've received a request to reset the password for the {%company_name%} account associated with {%user_email%}.</p>
		<p>You can reset your password by clicking the link below:</p><a href="{%link%}">Reset your password</a><p>Please ignore this emai,If you did not request a new password</p>
		<p>Please note that this link will expire within 24 hours. After 24 hours, you must submit a new password reset request.</p>`,
		active: true,
		sms: `<h4>Hello {%user_name%}</h4><p>We've received a request to reset the password for the {%company_name%} account associated with {%user_email%}.</p>
		<p>You can reset your password by clicking the link below:</p><a href="{%link%}">Reset your password</a><p>Please ignore this emai,If you did not request a new password</p>
		<p>Please note that this link will expire within 24 hours. After 24 hours, you must submit a new password reset request.</p>`,
		isDeleted:false,
		isSuperadmin:true
	},
	{
		_id: new ObjectId(),
		title: "Invite User",
		fields: [
			{ message: "User Name", code: "{%user_name%}" },
			{ message: "Company Name", code: "{%company_name%}" },
		],
		used_for: "invitation",
		subject: "Invitation to join {%company_name%}",
		message: `<h4>Hello {%user_name%}</h4><p>I hope you're doing well! I'm reaching out to personally invite you to join {%company_name%}</p>
		<p>Please join by clicking the link below:</p><a href="{%link%}">Join Now</a>
		<p>Please note that this link will expire within 24 hours.</p>`,
		sms: `<h4>Hello {%user_name%}</h4><p>I hope you're doing well! I'm reaching out to personally invite you to join {%company_name%}</p>
		<p>Please join by clicking the link below:</p><a href="{%link%}">Join Now</a>
		<p>Please note that this link will expire within 24 hours.</p>`,
		active: true,
		isDeleted:false,
		isSuperadmin:true
	}
]