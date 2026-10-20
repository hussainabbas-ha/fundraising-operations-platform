import { ObjectId } from "mongodb";
import { Filter_Options, Request, Response } from "../../../__types";
import { BaseController } from "../../../core/BaseController";

export default class CountryController extends BaseController {
	public __component: string = "countries";
	private filter_options: Filter_Options = {
		search: ["name"],
		defaultSort: "_id",
		filters: {},
	};
	public list = async (req: Request, res: Response): Promise<Response> => {
		try {
			const defaultFilter = {};
			// if(!req.user.role?.permissions['user']['all']) {
			//   defaultFilter['companyId'] = req.user.companyId;
			// }
			this.getAggrigation(req, this.filter_options, defaultFilter);
			const [data, count] = await Promise.all([
				this.collections.countries.aggregate([
					...req.aggregations,
					{
						$project: {
							_id: 1,
							name: 1,
							iso3: 1,
							phone_code: 1,
							capital: 1,
							currency: 1,
						},
					}
				]).toArray(),
				this.collections.countries.aggregate(req.dbPagination).toArray(),
			]);
			return this.json(req, res, 200, { data, count: count });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public get = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			const defaultFilter = { _id: new ObjectId(id) };
			const country = await this.collections.countries.findOne(defaultFilter, {
				projection: {
					_id: 1,
					name: 1,
					iso3: 1,
					phone_code: 1,
					capital: 1,
					currency: 1,
				}
			});
			if (country) {
				return this.json(req, res, 200, { data: country });
			}
			return this.jsonError(res, 400, this.__component, "get");
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
	public createOrUpdate = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			const Validationrules = {
				name: global["config"].commonRules.name,
				iso3: global["config"].commonRules.textOnly,
				phone_code: global["config"].commonRules.numberOnly,
				capital: global["config"].commonRules.name,
				currency: global["config"].commonRules.textOnly,
			};
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = this.getFormFields(req.body, Validationrules);
			if (!formErrors) {
				if (id) {
					await this.collections.countries.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody } });
					await this.appLog(req, this.__component, "Update", new ObjectId(id), FormBody);
				} else {
					const createdCountry = await this.collections.countries.insertOne({ ...FormBody });
					await this.appLog(req, this.__component, "Create", createdCountry.insertedId, FormBody);
				}
				return this.json(req, res, 200, { message: `Country ${(id) ? 'Updated' : 'Created'} Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, formErrors);
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public delete = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			if (id) {
				await this.collections.countries.deleteOne({ _id: new ObjectId(id) });
				await this.appLog(req, this.__component, "Delete", new ObjectId(id));
				return this.json(req, res, 200, { message: `Country Deleted Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, 'delete');
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
}