import { ObjectId } from "mongodb";
import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core/BaseController";

export default class VendorController extends BaseController {
    public __component: string = "vendors";
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
                this.collections.vendors.aggregate([
                    ...req.aggregations,
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            phoneNo: 1,
                            address: 1,
                        },
                    }
                ]).toArray(),
                this.collections.vendors.aggregate(req.dbPagination).toArray(),
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
            const vendor = await this.collections.vendors.findOne(defaultFilter, {
                projection: {
                    _id: 1,
                    title: 1,
                    phoneNo: 1,
                    address: 1,
                }
            });
            if (vendor) {
                return this.json(req, res, 200, { data: vendor });
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
                phoneNo: global["config"].commonRules.phone,
                address: global["config"].commonRules.address,
            };
            const formErrors = await this.validateForm(req.body, Validationrules);
            const FormBody = this.getFormFields(req.body, Validationrules);
            FormBody['companyId'] = req.user.companyId;
            if (!formErrors) {
                if (id) {
                    await this.collections.vendors.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody } });
                    await this.appLog(req, this.__component, "Update", new ObjectId(id), FormBody);
                } else {
                    const createdVendor = await this.collections.vendors.insertOne({ ...FormBody });
                    await this.appLog(req, this.__component, "Create", createdVendor.insertedId, FormBody);
                }
                return this.json(req, res, 200, { message: `Vendor ${(id) ? 'Updated' : 'Created'} Successfully` });
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
                await this.collections.vendors.deleteOne({ _id: new ObjectId(id) });
                await this.appLog(req, this.__component, "Delete", new ObjectId(id));
                return this.json(req, res, 200, { message: `Vendor Deleted Successfully` });
            } else {
                return this.jsonError(res, 400, this.__component, 'delete');
            }
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };
}