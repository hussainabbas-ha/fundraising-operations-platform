import { ObjectId } from "mongodb";
import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core/BaseController";
import config from "../../config/config";
import { uploadImages } from "../../helpers/image";
import Utility from "../../helpers/utility";
import { group } from "console";

export default class OrganizationController extends BaseController {
    public __component: string = "organizations";
    private filter_options: Filter_Options = {
        search: ["name"],
        defaultSort: "_id",
        filters: {
            companyId: { type: "objectId", filter: "$in" },
        },
    };
    public list = async (req: Request, res: Response): Promise<Response> => {
        try {
            const defaultFilter = { isDeleted: false };
            this.getAggrigation(req, this.filter_options, defaultFilter);
            const [data, count] = await Promise.all([
                this.collections.organizations.aggregate([
                    ...req.aggregations,
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            address: 1,
                            logo: 1,
                            email: 1,
                            phoneNo: 1,
                            isDelete: 1
                        },
                    }
                ]).toArray(),
                this.collections.organizations.aggregate(req.dbPagination).toArray(),
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
            const organization = await this.collections.organizations.findOne(defaultFilter, {
                projection: {
                    _id: 1,
                    name: 1,
                    address: 1,
                    logo: 1,
                    email: 1,
                    phoneNo: 1,
                }
            });
            if (organization) {
                return this.json(req, res, 200, { data: organization });
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
                address: global["config"].commonRules.address,
                email: global["config"].commonRules.email,
                phoneNo: global["config"].commonRules.phone,
            };
            const formErrors = await this.validateForm(req.body, Validationrules);
            const FormBody = this.getFormFields(req.body, Validationrules);
            if (req?.user?.role?.name && ['Developer', 'Super Admin'].indexOf(req.user.role.name) === -1) {
                FormBody.companyId = new ObjectId(req.user.companyId);
            }
            if (!formErrors) {
                if (req.files != null && req.files != undefined && Object.keys(req.files).length > 0) {
                    const filesArray = req.files;
                    if (config.production) {
                        if (id) {
                            const existingImage = await this.collections.companies?.findOne(
                                { _id: new ObjectId(id) }
                            );
                            if (existingImage) {
                                if (filesArray["organizationLogo"]) {
                                    const imagePath = await uploadImages(filesArray["organizationLogo"], 'Organization Logo', existingImage?.logo ?? "")
                                    FormBody['logo'] = imagePath[0];
                                }
                            }
                        } else {
                            const imagePath = await uploadImages(filesArray["organizationLogo"], 'Organization Logo')
                            FormBody['logo'] = imagePath[0];
                        }
                    } else {
                        const img = new Utility();
                        const imagePath = await img.uploadFiles(filesArray["organizationLogo"], ['png', 'jpg', 'jpeg'], "organizationLogo/")
                        if (imagePath && imagePath?.length > 0) {
                            FormBody['logo'] = imagePath[0];
                        }
                    }
                }
                FormBody.isDeleted = false
                if (id) {
                    await this.collections.organizations.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody } });
                    await this.appLog(req, this.__component, "Update", new ObjectId(id), FormBody);
                } else {
                    const createdOrganization = await this.collections.organizations.insertOne({ ...FormBody });
                    await this.appLog(req, this.__component, "Create", createdOrganization.insertedId, FormBody);
                }
                return this.json(req, res, 200, { message: `Organization ${(id) ? 'Updated' : 'Created'} Successfully` });
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
                await this.collections.organizations.updateOne({ _id: new ObjectId(id) }, { $set: { isDeleted: true } });
                await this.collections.groups.updateMany({ organizationId: new ObjectId(id) }, { $set: { isDeleted: true } })
                await this.appLog(req, this.__component, "Delete", new ObjectId(id));
                return this.json(req, res, 200, { message: `Organization Deleted Successfully` });
            } else {
                return this.jsonError(res, 400, this.__component, 'delete');
            }
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };

    public detail = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const defaultFilter = { _id: new ObjectId(id) };
            const organization = await this.collections.organizations.findOne(defaultFilter, {
                projection: {
                    _id: 1,
                    name: 1,
                    address: 1,
                    logo: 1,
                    email: 1,
                    phoneNo: 1,
                }
            });
            this.getAggrigation(req, this.filter_options, { organizationId: new ObjectId(id) });
            const [data, count] = await Promise.all([
                this.collections.groups.aggregate([
                    ...req.aggregations,
                    {
                        $project: {
                            _id: 1,
                            organizationId: 1,
                            name: 1,
                            logo: 1,
                            coverImage: 1,
                        },
                    }
                ]).toArray(),
                this.collections.organizations.aggregate(req.dbPagination).toArray(),
            ]);
            return this.json(req, res, 200, { data: { organization: organization, groups: data }, count: count });
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };
}