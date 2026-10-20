import { ObjectId } from "mongodb";
import { BaseController } from "../../../core";
import { Filter_Options, Request, Response } from '../../../__types';

export default class RegionController extends BaseController {
	public __component: string = "regions";
	private filter_options: Filter_Options = {
		search: ["name"],
		defaultSort: "_id",
		filters: {},
	};
	public list = async (req: Request, res: Response): Promise<Response> => {
		try {
			const defaultFilter = {};
			this.getAggrigation(req, this.filter_options, defaultFilter);
			const [data, count] = await Promise.all([
				this.collections.regions.aggregate([
					...req.aggregations,
					{
						$lookup: {
							from: "states",
							localField: "stateId",
							foreignField: "_id",
							as: "state"
						}
					},
					{
						$project: {
							_id: 1,
							name: 1,
							state:{$arrayElemAt:["$state.name",0]}
						},
					}
				]).toArray(),
				this.collections.regions.aggregate(req.dbPagination).toArray(),
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
			const region = await this.collections.regions.findOne(defaultFilter, {
				projection: {
					_id: 1,
					name: 1,
					stateId:1
				}
			});
			if (region) {
				return this.json(req, res, 200, { data: region });
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
				stateId: 'required',
			};
			const formErrors = await this.validateForm(req.body, Validationrules);
			const FormBody = this.getFormFields(req.body, Validationrules);
			if (!formErrors) {
				FormBody.stateId = new ObjectId(FormBody.stateId)
				if (id) {
					await this.collections.regions.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody } });
					await this.appLog(req, this.__component, "Update", new ObjectId(id), FormBody);
				} else {
					const createdRegion = await this.collections.regions.insertOne({ ...FormBody });
					await this.appLog(req, this.__component, "Create", createdRegion.insertedId, FormBody);
				}
				return this.json(req, res, 200, { message: `Region ${(id) ? 'Updated' : 'Created'} Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, formErrors);
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

	public getRegionsByState = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { stateId } = req.params;
			if (stateId) {
				const regions = await this.collections.regions?.find({ stateId: new ObjectId(stateId) },{projection:{name:1}}).toArray();
				return this.json(req, res, 200, { data:regions });
			} else {
				return this.jsonError(res, 404, this.__component, "wrong", "Not Found");
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "wrong", error);
		}
	}

	public delete = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			if (id) {
				await this.collections.regions.deleteOne({ _id: new ObjectId(id) });
				await this.appLog(req, this.__component, "Delete", new ObjectId(id));
				return this.json(req, res, 200, { message: `Region Deleted Successfully` });
			} else {
				return this.jsonError(res, 400, this.__component, 'delete');
			}
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "invalid", error);
		}
	};

}