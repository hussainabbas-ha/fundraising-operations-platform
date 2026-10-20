import { Collection, Db, ObjectId } from "mongodb";
import { Country, Region, Role, State, Timezone, User, Log, Company, Organization, AppSetting, Group, Vendor, DripCampaign, Contact, ContactGroup, EmailType, EmailTemplate, Product, Campaign, CampaignMembers, Order } from "../models";
import Utility from "../helpers/utility";
import { roles } from "./seed/roles";
import { country_list } from "./seed/countries_list";
import { state_list } from "./seed/states_regions_list";
import { timezone_list } from "./seed/timezone_list";
import { appsettings } from "./seed/appsettings";
import { Database } from "../database/db";
import { templates } from "./seed/email_templates";
const tables = ['users', 'countries', 'roles', 'states', 'regions', 'timezones', 'logs', 'companies', 'organizations', 'groups', 'appSettings', 'vendors', 'dripCompaigns', 'contacts', 'contactGroups', 'emailTypes', 'emailTemplates', 'products', 'campaigns', 'campaignMembers', 'orders'];
export default class DataBase extends Utility {
	private readonly db: Db;
	protected collections: {
		users: Collection<User>,
		countries: Collection<Country>,
		roles: Collection<Role>,
		states: Collection<State>,
		regions: Collection<Region>,
		timezones: Collection<Timezone>,
		logs: Collection<Log>,
		companies: Collection<Company>
		organizations: Collection<Organization>
		groups: Collection<Group>
		vendors: Collection<Vendor>
		dripCompaigns: Collection<DripCampaign>
		contacts: Collection<Contact>
		contactGroups: Collection<ContactGroup>
		appSettings: Collection<AppSetting>
		emailTypes: Collection<EmailType>
		emailTemplates: Collection<EmailTemplate>
		products: Collection<Product>
		campaigns: Collection<Campaign>
		campaignMembers: Collection<CampaignMembers>
		orders: Collection<Order>
	};
	constructor() {
		super();
		if (Database.db && !this.db) {
			this.db = Database.db;
			const c: any = {};
			tables.forEach((collection) => {
				c[collection] = this.db.collection(collection);
			})
			this.collections = c;
			this.syncDB();
		}
	}
	private readonly syncDB = async () => {

		if (global['config']['syncDb'] && global['syncDb'] == true) {
			global['syncDb'] = false;
			this.db.dropDatabase();
			const states: State[] = [];
			const regions: Region[] = [];
			const emailTypes: EmailType[] = [];
			const emailTemplates: EmailTemplate[] = [];
			const companies: Company[] = [
				{ _id: new ObjectId(), name: "Victory Funds", licence: "LCE123", address: "4070 dugas road aubrey taxes", email: "info@victoryfunds.com", phoneNo: "5555555555", status: "active", website: "victoryfunds.com", subdomain: "funds", package: { type: 'percentage', value: 50 } }
			];
			const organization: Organization[] = [
				{ _id: new ObjectId(), companyId: companies[0]._id, name: "Sports Department", address: "4070 dugas road aubrey taxes", email: "sports@victoryfunds.com", phoneNo: "222222222", isDeleted: false }
			];
			const group: Group[] = [
				{ _id: new ObjectId(), name: "Cricket", organizationId: organization[0]._id, companyId: companies[0]._id, isDeleted: false }
			];
			const vendor: Vendor[] = [
				{ _id: new ObjectId(), title: "Loop Builders", phoneNo: "+9200000000", address: "DHA Phase 4, Lahore" }
			];
			const dripCompaigns: DripCampaign[] = [
				{ _id: new ObjectId(), title: "Cricket Match Coming Soon", day: 3, smsTime: "01:00", emailTime: "20:00", companyId: companies[0]._id, type: "SMS", sms: "Be Ready for Amazing Event", emailSubject: "Announcement", emailMessage: "Your are interested in upcoming event" }
			];
			const product: Product[] = [
				{
					_id: new ObjectId(), title: "Popcorn", vendorId: vendor[0]._id, sellingPrice: 10, costPrice: 7, sku: "VARF1234-A", isActive: true, variants: [{ name: "Variant 01", sellingPrice: 100, costPrice: 80, sku: "WFRF1234-R" }, { name: "Variant 02", sellingPrice: 120, costPrice: 90, sku: "WFRF1234-F" }]
				}
			];
			const users: User[] = [
				{ _id: new ObjectId(), firstName: "Loopbrackets", lastName: "Developer", address: "123 dugas road aubrey", email: "developer@loopbrackets.com", roleId: roles[0]._id, ...this.passwordEn("Test@123"), status: 'active' },
				{ _id: new ObjectId(), firstName: "Super", lastName: "Admin", address: "123 dugas road aubrey", email: "superadmin@victoryfunds.com", roleId: roles[1]._id, ...this.passwordEn("Test@123"), status: 'active' },
				{ _id: new ObjectId(), firstName: "Victory", lastName: "Admin", address: "123 dugas road aubrey", email: "admin@victoryfunds.com", roleId: roles[2]._id, ...this.passwordEn("Test@123"), status: 'active', companyId: companies[0]._id },
				{ _id: new ObjectId(), firstName: "Victory", lastName: "Student", address: "123 dugas road aubrey", email: "student@victoryfunds.com", roleId: roles[5]._id, ...this.passwordEn("Test@123"), status: 'active', companyId: companies[0]._id }
			];
			const contacts: Contact[] = [
				{ _id: new ObjectId(), userId: users[3]._id, firstName: "Umar", lastName: "Dawood", emails: [{ type: "work", email: "work@victoryfunds.com" }, { type: "home", email: "home@victoryfunds.com" }], phoneNo: [{ type: "work", phoneNo: "+922222222222" }, { type: "home", phoneNo: "+920000000000" }] }
			];
			const contactGroup: ContactGroup[] = [
				{ _id: new ObjectId(), userId: users[3]._id, title: "Office", contacts: [contacts[0]._id] }
			];
			const campaigns: Campaign[] = [
				{
					_id: new ObjectId(), companyId: companies[0]._id, title: "Spring Sports 2025", groupId: group[0]._id, organizationId: organization[0]._id, leaderId: users[2]._id, season: "Spring", year: 2025, ccFees: "10$",
					productType:"physical",status: "active", startDate: new Date("2025-03-01"), endDate: new Date("2025-04-15"), drip: { startDate: new Date("2025-03-02"), isEmail: true, isText: false }, goals: { expectedParticipant: 100, participantGoal: 80, groupGoal: 5000, message: "Let's come together and raise funds for sports", totalRaised: 0 }
				}];
			state_list.forEach(el => {
				states.push({ _id: el._id, name: el.name, abbreviation: el.abbreviation })
				el.region.forEach(e => {
					regions.push({ _id: new ObjectId(), name: e.name, stateId: el._id })
				})
			});
			templates.forEach(el => {
				emailTypes.push({ _id: el._id, title: el.title, fields: el.fields, used_for: el.used_for, isSuperAdmin: el.isSuperadmin })
				emailTemplates.push({ _id: new ObjectId(), emailTypeId: el._id, title: el.title, subject: el.subject, message: el.message, active: true, isDeleted: false, isSuperAdmin: el.isSuperadmin, sms: el.sms })
			})

			await this.collections.roles.insertMany(roles);
			await this.collections.countries.insertMany(country_list);
			await this.collections.states.insertMany(states);
			await this.collections.regions.insertMany(regions);
			await this.collections.timezones.insertMany(timezone_list);
			await this.collections.appSettings.insertMany(appsettings);
			await this.collections.users.insertMany(users);
			await this.collections.companies.insertMany(companies);
			await this.collections.organizations.insertMany(organization);
			await this.collections.groups.insertMany(group);
			await this.collections.vendors.insertMany(vendor);
			await this.collections.dripCompaigns.insertMany(dripCompaigns);
			await this.collections.contacts.insertMany(contacts);
			await this.collections.contactGroups.insertMany(contactGroup);
			await this.collections.emailTypes.insertMany(emailTypes);
			await this.collections.emailTemplates.insertMany(emailTemplates);
			await this.collections.products.insertMany(product);
			await this.collections.campaigns.insertMany(campaigns);

			console.log('Data is seeded');
		}
	}
}