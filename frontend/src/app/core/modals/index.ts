
export interface Company {
	_id?: string;
	name: string;
	licence: string;
	address: string;
	logo?: string;
	email: string;
	phoneNo: string;
	status: string;
	website: string;
	subdomain: string;
	package: {
		type: string; // PerCampaign, Percentage, Capped
		value: number; // 0.05
		cappedAmount?: number; // 500
	}
}

export interface User {
	_id: string;
	firstName: string;
	lastName: string;
	image?: string;
	email: string;
	password?: string;
	confirm_password?: string;
	salt?: string;
	roleId: string;
	role?: Role;
	status: string;
	isDeleted: boolean;
	address: string,
	phoneNo?: string;
	zipCode?: number | null;
	companyId?: string;
	company?: Company;
	organizationId?: string;
	organization?: Organization;
	settings?: {
		timeZone: string;
	}
	invitation?: {
		code: string;
		validTill: Date;
	}
	forgetPassword?: {
		code: string;
		validTill: Date;
	}
}

export interface Role {
	_id: string;
	name: string;
	priority: number;
	permissions: { [key: string]: { [key: string]: boolean } };
}

export interface AppSetting {
	_id?: string;
	title: string;
	code: string;
	value: any;
}

export interface Log {
	_id?: string;
	component: string;
	action: string;
	userId: string | null;
	documentId?: string | null;
	ip: string;
	timestamp: Date;
	after?: Object;
}

export interface Country {
	_id?: string;
	name: string;
	iso3: string;
	phone_code: string;
	capital: string;
	currency: string;
}

export interface State {
	_id?: string;
	name: string;
	abbreviation: string;
}
export interface Region {
	_id?: string;
	name: string;
	stateId: string;
	state?: string
}
export interface Timezone {
	_id?: string;
	zoneName: string;
	gmtOffset: number;
	gmtOffsetName: string;
	abbreviation: string;
	tzName: string;
}

export interface EmailType {
	_id: string;
	title: string;
	used_for: string;
	fields: { message: string, code: string }[];
}
export interface Fields {

	message: string,
	code: string;
}

export interface EmailTemplate {
	_id: string;
	emailTypeId: string;
	title: string;
	subject: string;
	message: string;
	sms: string;
	active: boolean;
	isDeleted: boolean;
}

export interface Organization {
	_id: string;
	name: string;
	address: string;
	logo: string;
	email: string;
	phoneNo: string;
}

// Department
export interface Group {
	_id: string;
	organizationId: string;
	companyId: string;
	organizationName: string;
	name: string;
	logo: string;
	coverImage: string;
	// contacts: string[];
}


export interface Campaign {
	_id: string;
	companyId: string;
	title: string;
	groupId: string;
	group?: Group;
	groupCover: string;
	organizationId: string;
	organization?: Organization;
	organizationName: string;
	organizationlogo?: string;
	leaderId: string; // UserId
	season: string; // Spring, Summer, Fall, Winter
	year: number;
	products: CampaignProduct;
	productType: string,
	ccFees: string; // Fee on customer or fee on fundraising company etc
	status: string; // 
	startDate: Date;
	endDate: Date;
	drip: {
		startDate: Date;
		isEmail: boolean;
		isText: boolean;
	};
	goals: {
		expectedParticipant: number;
		participantGoal: number;
		groupGoal: number;
		message: string;
		totalRaised: number;
	},
}

// Not a table to be put in database just an interface for campaign
export interface CampaignProduct {
	campaignProducts: Product[],
	percentageToGroup: number;
	minAmount?: number;
	maxAmount?: number;
	chunksOf?: number;
}

export interface Product {
	_id: string;
	title: string;
	vendorId: string;
	sellingPrice: number;
	costPrice: number;
	productType: string;
	products?: { title: string, amount: string, isEnabled: boolean }[],
	sku: string;
	isActive: boolean;
	image: string;
	variants?: Variants[];
}
export interface Variants {
	name: string;
	sellingPrice: number;
	costPrice: number;
	sku?: string;
}

export interface Vendor {
	_id: string;
	title: string;
	phoneNo: string;
	address: string;
}

export interface CampaignMembers {
	_id: string;
	memberId: string; // UserID
	user?: User;
	campaignId: string;
	campaign?: Campaign;
	subdomain: string;
	totalRaised: number;
}

export interface OrderLineItem {
	campaignProductId: string;
	quantity: number;
	totalAmount: number;
	totalCost: number;
}

export interface Order {
	_id: string;
	totalCost: number;
	subTotal: number;
	total: number;
	fee: number;
	apiFee: number;
	campaignId: string;
	referenceId: string; // student/user Id;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	isAnonymous: boolean;
	message: string;
	lineItems: OrderLineItem[];
	status: string;
	apiLog: string;
}

export interface Contact {
	_id: string;
	userId: string; // UserId (Student / Coach)
	firstName?: string;
	lastName?: string;
	contactType: string;
	emails?: { type: string; email: string; }[];
	phoneNos?: { type: string; phone: string; }[];
}

export interface ContactGroup {
	_id: string;
	userId: string; // UserId (Student / Coach)
	title: string;
	contacts: string[]; // Contact Id
}

export interface DripCampaign {
	_id: string;
	title: string;
	day: number;
	smsTime: string;
	emailTime: string;
	companyId: string;
	type: string; // SMS, Email, Both
	sms?: string;
	emailSubject?: string;
	emailMessage?: string;
}

export interface lookupData {
	name: string,
	value: string
}

export interface Donation {
	campaign: {
		season: string;
		startDate: string;
		endDate: string;
		status: string;
		name: string;
		message: string;
		products: {
			productType: string;
			products?: {
				title: string;
				amount: number;
				isEnabled: boolean;
			}[];
			_id?: string;
			title?: string;
			vendorId?: string;
			sellingPrice?: number;
			costPrice?: number;
			sku?: string;
			isActive?: boolean;
			variants?: {
				sku: string;
				sellingPrice: number;
				costPrice: number;
				name: string;
			}[];
			image?: string;
		}[];
		student: {
			name: string;
			goal: number;
			totalRaised: number;
		};
		group: {
			name: string;
			cover: string;
			logo: string;
			goal: number;
		};
		organization: {
			name: string;
			logo: string;
		};
		company: {
			logo: string;
		};
		messages: {
			total: number;
			message: string;
			name: string;
			reference: string;
		}[];
	};
}

export interface Student {
	name: string
	goal: number
}


// Developer
// SuperAdmin
// Admin
// Staff // Sales reps
// Coach
// Student
