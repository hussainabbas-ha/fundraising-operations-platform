import { ObjectId } from "mongodb";
export interface Company {
	_id?: ObjectId;
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
	templatesCreated?:boolean
}

export interface User {
	_id: ObjectId;
	firstName: string;
	lastName: string;
	image?: string;
	address: string;
	email: string;
	password?: string;
	salt?: string;
	roleId: ObjectId;
	role?: Role;
	status: string;
	zipCode?: number;
	companyId?: ObjectId;
	company?: Company;
	organizationId?: ObjectId;
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
	_id: ObjectId;
	name: string;
	priority: number;
	permissions: { [key: string]: { [key: string]: boolean } };
}

export interface AppSetting {
	_id?: ObjectId;
	title: string;
	code: string;
	value: any;
}

export interface Log {
	_id?: ObjectId;
	component: string;
	action: string;
	userId: ObjectId | null;
	documentId?: ObjectId | null;
	ip: string;
	timestamp: Date;
	after?: object;
}

export interface Country {
	_id?: ObjectId;
	name: string;
	iso3: string;
	phone_code: string;
	capital: string;
	currency: string;
}

export interface State {
	_id?: ObjectId;
	name: string;
	abbreviation: string;
}
export interface Region {
	_id?: ObjectId;
	name: string;
	stateId: ObjectId;
}
export interface Timezone {
	_id?: ObjectId;
	zoneName: string;
	gmtOffset: number;
	gmtOffsetName: string;
	abbreviation: string;
	tzName: string;
}

export interface EmailType {
	_id: ObjectId;
	title: string;
	used_for: string;
	fields: { message: string, code: string }[];
	companyId?: ObjectId;
	isSuperAdmin: boolean;
}

export interface EmailTemplate {
	_id: ObjectId;
	emailTypeId: ObjectId;
	title: string;
	subject: string;
	message: string;
	sms: string;
	active: boolean;
	isDeleted: boolean;
	isSuperAdmin: boolean;
}

export interface Organization {
	_id: ObjectId;
	companyId: ObjectId | undefined;
	name: string;
	address: string;
	logo?: string;
	email: string;
	phoneNo: string;
	isDeleted:boolean
}

// Department
export interface Group {
	_id: ObjectId;
	organizationId: ObjectId;
	companyId: ObjectId | undefined;
	name: string;
	logo?: string;
	coverImage?: string;
	isDeleted:boolean
	// contacts: ObjectId[];
}


export interface Campaign {
	_id: ObjectId;
	companyId: ObjectId | undefined;
	title: string;
	groupId: ObjectId;
	group?: Group;
	organizationId: ObjectId;
	organization?: Organization;
	leaderId: ObjectId; // UserId
	season: string; // Spring, Summer, Fall, Winter
	year: number;
	productType: string;
	products?: CampaignProduct;
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
	}
}

// Not a table to be put in database just an interface for campaign
export interface CampaignProduct {
	campaignProducts: Product[];
	percentageToGroup: number;
	minAmount?: number;
	maxAmount?: number;
	chunksOf?: number;
}

export interface Product {
	_id: ObjectId;
	title: string;
	vendorId: ObjectId;
	sellingPrice: number;
	costPrice: number;
	sku: string;
	isActive: boolean;
	image?:string;
	variants?: {
		name: string;
		sellingPrice: number;
		costPrice: number;
		sku: string;
	}[];
}

export interface Vendor {
	_id: ObjectId;
	title: string;
	phoneNo: string;
	address: string;
}

export interface CampaignMembers {
	_id: ObjectId;
	memberId: ObjectId; // UserID
	user?: User;
	campaignId: ObjectId;
	campaign?: Campaign;
	subdomain?: string;
	totalRaised?: number;
	role?:string;
}

export interface OrderLineItem {
	campaignProductId: ObjectId;
	quantity: number;
	totalAmount: number;
	totalCost: number;
}

export interface Order {
	_id: ObjectId;
	totalCost: number;
	subTotal: number;
	total: number;
	fee: number;
	apiFee: number;
	campaignId: ObjectId;
	referenceId: ObjectId; // student/user Id;
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
	_id: ObjectId;
	userId?: ObjectId; // UserId (Student / Coach)
	firstName?: string;
	lastName?: string;
	emails?: { type: string; email: string; }[];
	phoneNo?: { type: string; phoneNo: string; }[];
}

export interface ContactGroup {
	_id: ObjectId;
	userId?: ObjectId; // UserId (Student / Coach)
	title: string;
	contacts: ObjectId[] | undefined; // Contact Id  
}

export interface DripCampaign {
	_id: ObjectId;
	title: string;
	day: number;
	smsTime: string;
	emailTime: string;
	companyId: ObjectId | undefined;
	type: string; // SMS, Email, Both
	sms?: string;
	emailSubject?: string;
	emailMessage?: string;
}


// Developer
// SuperAdmin
// Admin
// Staff // Sales reps
// Coach
// Student
