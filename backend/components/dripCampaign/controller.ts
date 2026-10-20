import { ObjectId } from "mongodb";
import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core/BaseController";

export default class DripCampaignController extends BaseController {
    public __component: string = "dripCampaign";
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
                this.collections.dripCompaigns.aggregate([
                    ...req.aggregations,
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            day: 1,
                            smsTime: 1,
                            emailTime: 1,
                            companyId: 1,
                            type: 1,
                            sms: 1,
                            emailSubject: 1,
                            emailMessage: 1,
                        },
                    }
                ]).toArray(),
                this.collections.dripCompaigns.aggregate(req.dbPagination).toArray(),
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
            const dripCampaign = await this.collections.dripCompaigns.findOne(defaultFilter, {
                projection: {
                    _id: 1,
                    title: 1,
                    day: 1,
                    smsTime: 1,
                    emailTime: 1,
                    companyId: 1,
                    type: 1,
                    sms: 1,
                    emailSubject: 1,
                    emailMessage: 1,
                }
            });
            if (dripCampaign) {
                return this.json(req, res, 200, { data: dripCampaign });
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
                title: global["config"].commonRules.name,
                day: 'max:30',
                smsTime: global["config"].commonRules.time,
                emailTime: global["config"].commonRules.time,
                type: global["config"].commonRules.name,
                sms: global["config"].commonRules.message,
                emailSubject: global["config"].commonRules.subject,
                emailMessage: global["config"].commonRules.message,
            };
            const formErrors = await this.validateForm(req.body, Validationrules);
            const FormBody = this.getFormFields(req.body, Validationrules);
            if (req?.user?.role?.name && ['Developer', 'Super Admin'].indexOf(req.user.role.name) === -1) {
                FormBody.companyId = new ObjectId(req.user.companyId);
            }
            if (!formErrors) {
                if (id) {
                    await this.collections.dripCompaigns.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody } });
                    await this.appLog(req, this.__component, "Update", new ObjectId(id), FormBody);
                } else {
                    const createdDripCampaign = await this.collections.dripCompaigns.insertOne({ ...FormBody });
                    await this.appLog(req, this.__component, "Create", createdDripCampaign.insertedId, FormBody);
                }
                return this.json(req, res, 200, { message: `Drip Campaign ${(id) ? 'Updated' : 'Created'} Successfully` });
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
                await this.collections.dripCompaigns.deleteOne({ _id: new ObjectId(id) });
                await this.appLog(req, this.__component, "Delete", new ObjectId(id));
                return this.json(req, res, 200, { message: `Drip Compaign Deleted Successfully` });
            } else {
                return this.jsonError(res, 400, this.__component, 'delete');
            }
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };
}