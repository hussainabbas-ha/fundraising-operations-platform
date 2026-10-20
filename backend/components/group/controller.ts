import { ObjectId } from "mongodb";
import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core/BaseController";
import config from "../../config/config";
import { uploadImages } from "../../helpers/image";
import Utility from "../../helpers/utility";

export default class GroupController extends BaseController {
    public __component: string = "groups";
    private filter_options: Filter_Options = {
        search: ["name"],
        defaultSort: "_id",
        filters: {},
    };
    public list = async (req: Request, res: Response): Promise<Response> => {
        try {
            const defaultFilter = {isDeleted: false};
            this.getAggrigation(req, this.filter_options, defaultFilter);
            const [data, count] = await Promise.all([
                this.collections.groups.aggregate([
                    ...req.aggregations,
                    {
                        $lookup: {
                            from: "organizations",
                            localField: "organizationId",
                            foreignField: "_id",
                            as: "organization"
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            organizationName: { $arrayElemAt: ["$organization.name", 0] },
                            organizationId:1,
                            name: 1,
                            logo: 1,
                            coverImage: 1,
                        },
                    }
                ]).toArray(),
                this.collections.groups.aggregate(req.dbPagination).toArray(),
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
            const group = await this.collections.groups.findOne(defaultFilter, {
                projection: {
                    _id: 1,
                    organizationId: 1,
                    name: 1,
                    logo: 1,
                    coverImage: 1,
                }
            });
            if (group) {
                return this.json(req, res, 200, { data: group });
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
                organizationId: global["config"].commonRules.id,
            };
            const formErrors = await this.validateForm(req.body, Validationrules);
            const FormBody = this.getFormFields(req.body, Validationrules);
            if(req?.user?.role?.name && ['Developer', 'Super Admin'].indexOf(req.user.role.name) === -1) {
                FormBody.companyId = req.user.companyId;
            }
            if (!formErrors) {
                if (req.files != null && req.files != undefined && Object.keys(req.files).length > 0) {
                    const filesArray = req.files;
                    if (config.production) {
                        if (id) {
                            const existingImage = await this.collections.groups?.findOne(
                                { _id: new ObjectId(id) }
                            );
                            if (existingImage) {
                                if (filesArray["groupLogo"]) {
                                    const imagePath = await uploadImages(filesArray["groupLogo"], 'Group Logo', existingImage?.logo ?? "")
                                    FormBody['logo'] = imagePath[0];
                                }
                                if (filesArray["groupCoverImage"]) {
                                    const imagePath = await uploadImages(filesArray["groupCoverImage"], 'Group Cover Image', existingImage?.coverImage ?? "")
                                    FormBody['coverImage'] = imagePath[0];
                                }
                            }
                        } else {
                            if (filesArray["groupLogo"]) {
                                const imagePath = await uploadImages(filesArray["groupLogo"], 'Group Logo')
                                FormBody['logo'] = imagePath[0];
                            }
                            if (filesArray["groupCoverImage"]) {
                                const imagePath = await uploadImages(filesArray["groupCoverImage"], 'Group Cover Image')
                                FormBody['coverImage'] = imagePath[0];
                            }
                        }
                    } else {
                        const img = new Utility();
                        if (filesArray["groupLogo"]) {
                            const imagePath = await img.uploadFiles(filesArray["groupLogo"], ['png', 'jpg', 'jpeg'], "groupLogo/")
                            if (imagePath && imagePath?.length > 0) {
                                FormBody['logo'] = imagePath[0];
                            }
                        }
                        if (filesArray["groupCoverImage"]) {
                            const imagePath = await img.uploadFiles(filesArray["groupCoverImage"], ['png', 'jpg', 'jpeg'], "groupCoverImage/")
                            if (imagePath && imagePath?.length > 0) {
                                FormBody['coverImage'] = imagePath[0];
                            }
                        }
                    }
                }
                FormBody.isDeleted = false
                if (id) {
                    await this.collections.groups.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody, organizationId: ObjectId.createFromHexString(FormBody.organizationId)} });
                    await this.appLog(req, this.__component, "Update", new ObjectId(id), FormBody);
                } else {
                    const createdGroup = await this.collections.groups.insertOne({ ...FormBody, organizationId: ObjectId.createFromHexString(FormBody.organizationId) });
                    await this.appLog(req, this.__component, "Create", createdGroup.insertedId, FormBody);
                }
                return this.json(req, res, 200, { message: `Group ${(id) ? 'Updated' : 'Created'} Successfully` });
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
                await this.collections.groups.deleteOne({ _id: new ObjectId(id) });
                await this.appLog(req, this.__component, "Delete", new ObjectId(id));
                return this.json(req, res, 200, { message: `Group Deleted Successfully` });
            } else {
                return this.jsonError(res, 400, this.__component, 'delete');
            }
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };
}