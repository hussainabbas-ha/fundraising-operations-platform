import { ObjectId } from "mongodb";
import { Filter_Options, Request, Response } from "../../../__types";
import { BaseController } from "../../../core/BaseController";

export default class StateController extends BaseController {
	public __component: string = "states";
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
				this.collections.states.aggregate([
					...req.aggregations,
					{
						$project: {
							_id: 1,
							name: 1,
							abbreviation: 1
						},
					}
				]).toArray(),
				this.collections.states.aggregate(req.dbPagination).toArray(),
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
			const state = await this.collections.states.findOne(defaultFilter, {
				projection: {
					_id: 1,
					name: 1,
					abbreviation: 1
				}
			});
			if (state) {
				return this.json(req, res, 200, { data: state });
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
				abbreviation: global["config"].commonRules.name,
			};
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = this.getFormFields(req.body, Validationrules);
			if (!formErrors) {
				if (id) {
					await this.collections.states.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody } });
					await this.appLog(req, this.__component, "Update", new ObjectId(id), FormBody);
				} else {
					const createdState = await this.collections.states.insertOne({ ...FormBody });
					await this.appLog(req, this.__component, "Create", createdState.insertedId, FormBody);
				}
				return this.json(req, res, 200, { message: `State ${(id) ? 'Updated' : 'Created'} Successfully` });
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
				await this.collections.states.deleteOne({ _id: new ObjectId(id) });
				await this.appLog(req, this.__component, "Delete", new ObjectId(id));
				return this.json(req, res, 200, { message: `State Deleted Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, 'delete');
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};
}