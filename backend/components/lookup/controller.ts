import { ObjectId } from "mongodb";
import { Request, Response } from "../../__types";
import { BaseController } from "../../core";
import { UserStatus } from "../../models/definitions";

export default class UserController extends BaseController {
	public __component: string = "lookup";
	// Application Data Lookups
	public getStatesData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const result = await this.collections.states.aggregate([
				{
					$project: {
						name: 1,
						value: "$_id"
					},
				}
			]).toArray();
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public getRolesData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const result = await this.collections.roles.aggregate([
				{
					$match: {
						priority: {
							$gt: req.user?.role?.priority
						}
					}
				},
				{
					$project: {
						name: 1,
						value: "$_id"
					},
				}
			]).toArray();
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public getRegionsData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const states: any = [];
			const regions: any = [];
			const { ids } = req.params;
			const st = ids.split(',');
			if (st && st.length > 0) {
				st.forEach(el => {
					states.push(new ObjectId(el));
				});
			}
			const result = await this.collections.regions.aggregate([
				{
					$match: {
						stateId: { $in: states }
					}
				},
				{
					$lookup: {
						from: "states",
						localField: "stateId",
						foreignField: "_id",
						as: "states"
					}
				},
			]).toArray();
			result.forEach(el => {
				regions.push({
					name: "[" + el.states[0].name + "] - " + el.name,
					value: el._id,
				})
			})
			return this.json(req, res, 200, { data: regions });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public getCompanyData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const result = await this.collections.companies.aggregate([
				{
					$project: {
						name: 1,
						value: "$_id"
					},
				}
			]).toArray();
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public getOrganizationData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { companyId } = req.query;
			const result = await this.collections.organizations.aggregate([
				{
					$match: { companyId: (typeof companyId === 'string') ? ObjectId.createFromHexString(companyId) : null }
				},
				{
					$project: {
						name: 1,
						value: "$_id"
					},
				}
			]).toArray();
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public getGroupData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const companyId = req.user.companyId;
			const { organizationId } = req.query;
			const result = await this.collections.groups.aggregate([
				{
					$match: { companyId: companyId, organizationId: (typeof organizationId === 'string') ? ObjectId.createFromHexString(organizationId) : null }
				},
				{
					$project: {
						name: 1,
						value: "$_id"
					},
				}
			]).toArray();
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public getVendorData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const result = await this.collections.vendors.aggregate([
				{
					$project: {
						name: "$title",
						value: "$_id"
					},
				}
			]).toArray();
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public getOrganizationUserData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { organizationId } = req.query;
			const result = await this.collections.users.aggregate([
				{
					$match: { organizationId: (typeof organizationId === 'string') ? ObjectId.createFromHexString(organizationId) : null, status: { $in: [UserStatus.Active, UserStatus.Invited] } }
				},
				{
					$project: {
						name: { $concat: ["$firstName", " ", "$lastName"] },
						value: "$_id"
					},
				}
			]).toArray();
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public getProductsData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { vendorId } = req.query;
			let vendorObjectIds: ObjectId[] = [];
			if (typeof vendorId === 'string') {
				vendorObjectIds = vendorId.split(',').map(id => ObjectId.createFromHexString(id.trim()));
			} else if (Array.isArray(vendorId)) {
				vendorObjectIds = vendorId.map(id => {
					if (typeof id === 'string') {
						return ObjectId.createFromHexString(id.trim());
					}
					throw new Error("Invalid vendorId format");
				});
			}
			const result = await this.collections.products.aggregate([
				{
					$match: { vendorId: { $in: vendorObjectIds }, isActive: true }
				},
				{
					$project: {
						name: "$title",
						value: "$_id"
					},
				}
			]).toArray();
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public getContactsData = async (req: Request, res: Response): Promise<Response> => {
		try {
			const id = req.user._id;
			const result = await this.collections.contacts.aggregate([
				{
					$match: { userId: id }
				},
				{
					$project: {
						name: { $concat: ["$firstName", " ", "$lastName"] },
						value: "$_id"
					},
				}
			]).toArray();
			
			return this.json(req, res, 200, { data: result });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	// Application Status Lookups
	public getStatus = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { code } = req.query;
			const statuses: any = [];
			const result = await this.collections.appSettings.findOne({ code: code }, { projection: { value: 1 } });
			result?.value.forEach(el => {
				statuses.push({
					name: el.name,
					value: el.value,
				})
			})
			return this.json(req, res, 200, { data: statuses });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
}
