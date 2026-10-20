import { ObjectId } from "mongodb";
import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core/BaseController";

export default class ContactController extends BaseController {
    public __component: string = "contacts";
    private filter_options: Filter_Options = {
        search: ["name"],
        defaultSort: "_id",
        filters: {},
    };
    public list = async (req: Request, res: Response): Promise<Response> => {
        try {
            const defaultFilter = { userId: req.user._id };
            this.getAggrigation(req, this.filter_options, defaultFilter, false);
            const [data, count] = await Promise.all([
                this.collections.contacts.aggregate([
                    ...req.aggregations,
                    {
                        $project: {
                            _id: 1,
                            userId: 1,
                            firstName: 1,
                            lastName: 1,
                            emails: 1,
                            phoneNos: 1
                        },
                    }
                ]).toArray(),
                this.collections.contacts.aggregate(req.dbPagination).toArray(),
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
            const contacts = await this.collections.contacts.findOne(defaultFilter, {
                projection: {
                    _id: 1,
                    userId: 1,
                    firstName: 1,
                    lastName: 1,
                    emails: 1,
                    phoneNos: 1,
                }
            });
            if (contacts) {
                return this.json(req, res, 200, { data: contacts });
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
                firstName: global["config"].commonRules.name,
                lastName: global["config"].commonRules.name,
                phoneNos: "required",
            };
            const formErrors = await this.validateForm(req.body, Validationrules);
            const FormBody = req.body
            FormBody['userId'] = req.user._id;
            if (!formErrors) {
                if (id) {
                    await this.collections.contacts.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody } });
                    await this.appLog(req, this.__component, "Update", new ObjectId(id), FormBody);
                } else {
                    const createdContact = await this.collections.contacts.insertOne({ ...FormBody });
                    await this.appLog(req, this.__component, "Create", createdContact.insertedId, FormBody);
                }
                return this.json(req, res, 200, { message: `Contact ${(id) ? 'Updated' : 'Created'} Successfully` });
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
                await this.collections.contacts.deleteOne({ _id: new ObjectId(id) });
                await this.appLog(req, this.__component, "Delete", new ObjectId(id));
                return this.json(req, res, 200, { message: `Contact Deleted Successfully` });
            } else {
                return this.jsonError(res, 400, this.__component, 'delete');
            }
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };
}