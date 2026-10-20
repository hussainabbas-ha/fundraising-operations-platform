import { ObjectId } from "mongodb";

export const appsettings = [
	{
		_id: new ObjectId(),
		title: "Permissions",
		code: "perm",
		value: {
			dashboard: {
				view: true,
			},
			user: {
				get: true,
				list: true,
				update: true,
				delete: true,
				add: true,
				view: true,
			},
			role: {
				get: true,
				list: true,
				update: true,
				delete: true,
				add: true,
				view: true,
			},
			permission: {
				list: true,
				add: true,
				view: true,
			},
			state: {
				get: true,
				list: true,
				update: true,
				delete: true,
				add: true,
				view: true,
			},
			country: {
				get: true,
				list: true,
				update: true,
				delete: true,
				add: true,
				view: true,
			},
			region: {
				get: true,
				list: true,
				update: true,
				delete: true,
				add: true,
				view: true
			},
			company: {
				get: true,
				list: true,
				update: true,
				delete: true,
				add: true,
				view: true
			},
			organization: {
				get: true,
				list: true,
				update: true,
				delete: true,
				add: true,
				view: true
			},
			appsetting: {
				get: true,
				list: true,
				update: true,
				delete: true,
				add: true,
				view: true
			},
			group: {
				get: true,
				list: true,
				update: true,
				delete: true,
				add: true,
				view: true
			},
			vendor: {
				get: true,
				list: true,
				update: true,
				delete: true,
				add: true,
				view: true,
			},
			dripCampaign: {
				get: true,
				list: true,
				update: true,
				delete: true,
				add: true,
				view: true,
			},
			contact: {
				get: true,
				list: true,
				update: true,
				delete: true,
				add: true,
				view: true,
			},
			contactGroup: {
				get: true,
				list: true,
				update: true,
				delete: true,
				add: true,
				view: true,
			},
			devaccess: {
				view: true
			},
			lookup: {
				list: true
			}
		}
	},
	{
		_id: new ObjectId(),
		title: "User Status",
		code: "user_status",
		value: [
			{ name: "Active", value: "active" },
			{ name: "Inactive", value: "inactive" },
		]
	},
	{
		_id: new ObjectId(),
		title: "Company Status",
		code: "company_status",
		value: [
			{ name: "Active", value: "active" },
			{ name: "Inactive", value: "inactive" },
		]
	},
	{
		_id: new ObjectId(),
		title: "Company Packages",
		code: "company_packages",
		value: [
			{ name: "Percentage", value: "percentage" },
			{ name: "PerCampaign", value: "perCampaign" },
			{ name: "Capped", value: "capped" }
		]
	},
	{
		_id: new ObjectId(),
		title: "Drip Campaign Type",
		code: "drip_campaign_type",
		value: [
			{ name: "SMS", value: "sms" },
			{ name: "Email", value: "email" },
			{ name: "Both", value: "both" }
		]
	},
	{
		_id: new ObjectId(),
		title: "Seasons",
		code: "seasons",
		value: [
			{ name: "Spring", value: "spring" },
			{ name: "Winter", value: "winter" },
			{ name: "Summer", value: "summer" },
			{ name: "Fall", value: "fall" }
		]
	},
	{
		_id: new ObjectId(),
		title: "Campaign Product Type",
		code: "campaign_product_type",
		value: [
			{ name: "Physical", value: "physical" },
			{ name: "Digital", value: "digital" }
		]
	},
	{
		_id: new ObjectId(),
		title: "Email Type",
		code: "email_type",
		value: [
			{ name: "Home", value: "home" },
			{ name: "Work", value: "work" },
			{ name: "Other", value: "other" }
		]
	},
	{
		_id: new ObjectId(),
		title: "Phone Type",
		code: "phone_type",
		value: [
			{ name: "Mobile", value: "mobile" },
			{ name: "Home", value: "home" },
			{ name: "Work", value: "work" },
			{ name: "Other", value: "other" }
		]
	},
	{
		_id: new ObjectId(),
		title: "Contact Type",
		code: "contact_type",
		value: [
			{ name: "Phone", value: "phone" },
			{ name: "Email", value: "email" },
		]
	}
];