import { ObjectId } from "mongodb";
import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core/BaseController";

export default class ContactGroupController extends BaseController {
    public __component: string = "contactgroups";
    private filter_options: Filter_Options = {
        search: ["name"],
        defaultSort: "_id",
        filters: {},
    };
    public list = async (req: Request, res: Response): Promise<Response> => {
        try {
            const defaultFilter = {};
            this.getAggrigation(req, this.filter_options, defaultFilter, false);
            const [data, count] = await Promise.all([
                this.collections.contactGroups.aggregate([
                    ...req.aggregations,
                    {
                        $project: {
                            _id: 1,
                            userId: 1,
                            title: 1,
                            contacts: 1,
                            members: {$size:{ $ifNull: ["$contacts", []] }}
                        },
                    }
                ]).toArray(),
                this.collections.contactGroups.aggregate(req.dbPagination).toArray(),
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
            const contactGroups = await this.collections.contactGroups.findOne(defaultFilter, {
                projection: {
                    _id: 1,
                    userId: 1,
                    title: 1,
                    contacts: 1,
                }
            });
            if (contactGroups) {
                return this.json(req, res, 200, { data: contactGroups });
            }
            return this.jsonError(res, 400, this.__component, "get");
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };
    public createOrUpdate = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const contacts:any=[];
            const Validationrules = {
                title: global["config"].commonRules.name,
                contacts: "required",
            };
            const formErrors = await this.validateForm(req.body, Validationrules);
            const FormBody = this.getFormFields(req.body, Validationrules);
            // FormBody['companyId'] = req.user.companyId;
            if (!formErrors) {
                FormBody.contacts.forEach(e=>{
                    contacts.push(ObjectId.createFromHexString(e));
                })
                FormBody.contacts = contacts;
                if (id) {
                    await this.collections.contactGroups.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody } });
                    await this.appLog(req, this.__component, "Update", new ObjectId(id), FormBody);
                } else {
                    const createdContactGroup = await this.collections.contactGroups.insertOne({ ...FormBody });
                    await this.appLog(req, this.__component, "Create", createdContactGroup.insertedId, FormBody);
                }
                return this.json(req, res, 200, { message: `Contact Group ${(id) ? 'Updated' : 'Created'} Successfully` });
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
                await this.collections.contactGroups.deleteOne({ _id: new ObjectId(id) });
                await this.appLog(req, this.__component, "Delete", new ObjectId(id));
                return this.json(req, res, 200, { message: `contact Group Deleted Successfully` });
            } else {
                return this.jsonError(res, 400, this.__component, 'delete');
            }
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };
}