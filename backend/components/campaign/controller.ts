import { ObjectId } from "mongodb";
import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core/BaseController";
import Utility from "../../helpers/utility";
import config from "../../config/config";
import { Product } from "../../models";
import { CampaignStatus, ProductType } from "../../models/definitions";
import ne from 'node-each';

export default class CampaignController extends BaseController {
    public __component: string = "campaigns";
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
                this.collections.campaigns.aggregate([
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
                        $lookup: {
                            from: "groups",
                            localField: "groupId",
                            foreignField: "_id",
                            as: "group"
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "leaderId",
                            foreignField: "_id",
                            as: "leader"
                        }
                    },
                    {
                        $project: {
                            companyId: 1,
                            title: 1,
                            groupId: 1,
                            group: { $arrayElemAt: ["$group", 0] },
                            organizationId: 1,
                            organization: { $arrayElemAt: ["$organization", 0] },
                            leaderId: 1,
                            leaderName: {
                                $concat: [
                                    { $arrayElemAt: ["$leader.firstName", 0] },
                                    " ",
                                    { $arrayElemAt: ["$leader.lastName", 0] }
                                ]
                            },
                            season: 1,
                            year: 1,
                            ccFees: 1,
                            status: 1,
                            startDate: 1,
                            endDate: 1,
                            drip: 1,
                            goals: 1,
                        }
                    }
                ]).toArray(),
                this.collections.campaigns.aggregate(req.dbPagination).toArray(),
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
            const campaigns = await this.collections.campaigns.findOne(defaultFilter, {
                projection: {
                    companyId: 1,
                    title: 1,
                    groupId: 1,
                    group: 1,
                    organizationId: 1,
                    organization: 1,
                    leaderId: 1,
                    season: 1,
                    year: 1,
                    ccFees: 1,
                    status: 1,
                    startDate: 1,
                    endDate: 1,
                    drip: 1,
                    goals: 1,
                    products: 1
                }
            });
            if (campaigns) {
                return this.json(req, res, 200, {
                    data: campaigns
                });
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
                groupId: global["config"].commonRules.id,
                organizationId: global["config"].commonRules.id,
                leaderId: global["config"].commonRules.id,
                season: global["config"].commonRules.name,
                year: global["config"].commonRules.numberOnly,
                ccFees: "required",
                startDate: global["config"].commonRules.date,
                endDate: global["config"].commonRules.date,
                dripStartDate: global["config"].commonRules.date,
                isEmail: "required",
                isText: "required",
                expectedParticipant: "required",
                participantGoal: "required",
                groupGoal: "required",
                message: global["config"].commonRules.message,
                percentageToGroup: "required",
                products: "required"

            };
            const formErrors = await this.validateForm(req.body, Validationrules);
            const FormBody = this.getFormFields(req.body, Validationrules);

            if (!formErrors) {
                FormBody.status = CampaignStatus.Pending;
                FormBody.companyId = new ObjectId(req.user.companyId);
                FormBody.drip = {
                    startDate: FormBody.dripStartDate,
                    isEmail: FormBody.isEmail,
                    isText: FormBody.isText,
                }
                FormBody.goals = {
                    expectedParticipant: FormBody.expectedParticipant,
                    participantGoal: FormBody.participantGoal,
                    groupGoal: FormBody.groupGoal,
                    message: FormBody.message
                }
                if (FormBody.products.length > 0) {
                    const campaignProducts: any[] = [];
                    await ne.each(FormBody.products, async (el, i) => {
                        if (el.productType == ProductType.Physical) {
                            if (el.products.length > 0) {
                                await ne.each(el.products, async (e, i) => {
                                    const product = await this.collections.products.findOne({ _id: ObjectId.createFromHexString(e) });
                                    if (product != null) {
                                        console.log("here")
                                        product['productType'] = el.productType;
                                        campaignProducts.push(product)
                                    }
                                });
                            }
                        } else if (el.productType == ProductType.Digital) {
                            campaignProducts.push({
                                productType: el.productType,
                                products: el.products
                            })
                        }
                        FormBody.products = {
                            campaignProducts: campaignProducts,
                            percentageToGroup: FormBody.percentageToGroup
                        }
                    });
                }
                const keysToDelete = [
                    "dripStartDate",
                    "vendorId",
                    "isEmail",
                    "isText",
                    "expectedParticipant",
                    "participantGoal",
                    "groupGoal",
                    "message",
                    "percentageToGroup",
                ];

                keysToDelete.forEach((key) => {
                    delete FormBody[key];
                });
                if (id) {
                    await this.collections.campaigns.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody, products: FormBody.products, groupId: ObjectId.createFromHexString(FormBody.groupId), organizationId: ObjectId.createFromHexString(FormBody.organizationId), leaderId: ObjectId.createFromHexString(FormBody.leaderId) } });
                    await this.appLog(req, this.__component, "Update", new ObjectId(id), FormBody);
                    const campaignMember = await this.collections.campaignMembers.findOne({ campaignId: new ObjectId(id), role: "Coach" });
                    if (campaignMember) {
                        await this.collections.campaignMembers.updateOne({ _id: campaignMember._id }, { $set: { memberId: ObjectId.createFromHexString(FormBody.leaderId) } })
                    }
                } else {
                    const createdCampaign = await this.collections.campaigns.insertOne({ ...FormBody, groupId: ObjectId.createFromHexString(FormBody.groupId), organizationId: ObjectId.createFromHexString(FormBody.organizationId), leaderId: ObjectId.createFromHexString(FormBody.leaderId) });
                    await this.appLog(req, this.__component, "Create", createdCampaign.insertedId, FormBody);
                    await this.collections.campaignMembers.insertOne({ _id: new ObjectId(), memberId: ObjectId.createFromHexString(FormBody.leaderId), campaignId: createdCampaign.insertedId, role: "Coach" })
                }
                return this.json(req, res, 200, { message: `Campaign ${(id) ? 'Updated' : 'Created'} Successfully` });
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
                await this.collections.campaigns.deleteOne({ _id: new ObjectId(id) });
                await this.appLog(req, this.__component, "Delete", new ObjectId(id));
                return this.json(req, res, 200, { message: `Campaign Deleted Successfully` });
            } else {
                return this.jsonError(res, 400, this.__component, 'delete');
            }
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };

    public inviteCoachOrLeader = async (req: Request, res: Response): Promise<Response> => {
        try {

            const currentDate = new Date();
            const validTill = currentDate.setHours(currentDate.getHours() + 24);
            const Validationrules = {
                email: global["config"].commonRules.email,
                firstName: global["config"].commonRules.name,
                lastName: global["config"].commonRules.name,
                organizationId: global["config"].commonRules.id,
            };
            const formErrors = await this.validateForm(req.body, Validationrules);
            const FormBody = await this.getFormFields(req.body, Validationrules);
            if (!formErrors) {
                const isExist = await this.collections.users.findOne({ email: FormBody.email });
                if (isExist) {
                    return this.json(req, res, 200, {
                        data: [{ name: isExist.firstName + " " + isExist.lastName, value: isExist._id }]
                    });
                }
                const util = new Utility();
                const code = util.randomString(6, true);
                const role = await this.collections.roles.findOne({ name: 'Coach' })
                const company = await this.collections.companies.findOne({ _id: req.user.companyId })
                const url = `company=${req.user.companyId}&firstName=${FormBody.firstName}&lastName=${FormBody.lastName}&email=${FormBody.email}&role=${role?._id}&code=${code}`
                const cipher = util.encryptData(url);
                const baseUrl = config.production ? `https://${company?.subdomain}.${company?.website}/` : 'localhost:4200/';
                const invitationLink = `${baseUrl}signup?&code=${cipher}`;
                FormBody.status = "invited"
                FormBody.invitation = {
                    code: code,
                    validTill: validTill,
                    link: invitationLink
                }
                FormBody.roleId = role?._id;
                FormBody.companyId = req.user.companyId;
                FormBody.organizationId = ObjectId.createFromHexString(FormBody.organizationId);
                const invitedUser = await this.collections.users.insertOne({ ...FormBody });
                await this.appLog(req, this.__component, "Invite", invitedUser.insertedId, FormBody);
                const newUser = await this.collections.users.findOne({ _id: invitedUser.insertedId });
                return this.json(req, res, 200, {
                    data: [{ name: newUser?.firstName + " " + newUser?.lastName, value: newUser?._id }], message: `Invitation Email Send Successfully`
                });
            } else {
                return this.jsonError(res, 400, this.__component, formErrors);
            }
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };

    public detail = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const defaultFilter = { _id: new ObjectId(id) };
            this.getAggrigation(req, this.filter_options, defaultFilter, false);
            const [campaign] = await Promise.all([
                this.collections.campaigns.aggregate([
                    ...req.aggregations,
                    {
                        $lookup: {
                            from: "groups",
                            localField: "groupId",
                            foreignField: "_id",
                            as: "group"
                        }
                    },
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
                            companyId: 1,
                            title: 1,
                            groupName: { $arrayElemAt: ["$group.name", 0] },
                            groupCover: { $arrayElemAt: ["$group.coverImage", 0] },
                            organizationName: { $arrayElemAt: ["$organization.name", 0] },
                            organizationlogo: { $arrayElemAt: ["$organization.logo", 0] },
                            season: 1,
                            year: 1,
                            ccFees: 1,
                            status: 1,
                            startDate: 1,
                            endDate: 1,
                            drip: 1,
                            goals: 1,
                            products: 1
                        }
                    }
                ]).toArray(),
            ]);
            this.getAggrigation(req, this.filter_options, { campaignId: new ObjectId(id) }, false);
            const [data, count] = await Promise.all([
                this.collections.campaignMembers.aggregate([
                    ...req.aggregations,
                    {
                        $lookup: {
                            from: "users",
                            localField: "memberId",
                            foreignField: "_id",
                            as: "campaignMembers"
                        }
                    },
                    {
                        $project: {
                            name: {$concat: [{ $arrayElemAt: ["$campaignMembers.firstName", 0] }," ",{ $arrayElemAt: ["$campaignMembers.lastName", 0] }]},
                            email: { $arrayElemAt: ["$campaignMembers.email", 0] },
                            role:1
                        },
                    }
                ]).toArray(),
                this.collections.campaignMembers.aggregate(req.dbPagination).toArray(),
            ]);
            return this.json(req, res, 200, { data: { campaign: campaign[0], members: data, count:data.length }});
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };
}