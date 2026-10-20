import { ObjectId } from "mongodb";
import { Filter_Options, Response, Request } from "../../__types";
import { BaseController } from "../../core";
import { CampaignStatus } from "../../models/definitions";

export default class DonationController extends BaseController {
    public __component: string = "donations";
    private readonly filter_options: Filter_Options = {
        search: ["name"],
        defaultSort: "_id",
        filters: {},
    };

    public get = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { campaignId, studentId } = req.params;
            const defaultFilter = { _id: new ObjectId(campaignId) };
            const campaignMember = await this.collections.campaignMembers.aggregate([
                { $match: { campaignId: new ObjectId(campaignId), memberId: new ObjectId(studentId) } },
                {
                    $lookup: {
                        from: "users",
                        localField: "memberId",
                        foreignField: "_id",
                        as: "student"
                    }
                }
            ]).toArray();
            if (!campaignMember) {
                return this.jsonError(res, 400, this.__component, "Not found");
            }
            this.getAggrigation(req, this.filter_options, defaultFilter);
            const [data] = await Promise.all([
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
                        $lookup: {
                            from: "companies",
                            localField: "companyId",
                            foreignField: "_id",
                            as: "company"
                        }
                    }
                ]).toArray(),
            ]);
            const campaignOrders = await this.collections.orders.aggregate([
                {
                    $match: {
                        campaignId: new ObjectId(campaignId)

                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "referenceId",
                        foreignField: "_id",
                        as: "studentReference"
                    }
                },
                {
                    $project: {
                        name:  {
                            $cond: {
                              if: "$isAnonymous",
                              then: "Anonymous",
                              else: { $concat: ["$firstName", " ", "$lastName"] }
                            }
                          },
                        message:1,
                        total:1,
                        reference: {$concat: [{ $arrayElemAt: ["$studentReference.firstName", 0] }," ",{ $arrayElemAt: ["$studentReference.lastName", 0] }]},

                    }
                },
            ]).toArray();
            const campaign = data[0];
            const member = campaignMember[0];
            let campaignData = {}
            if (campaign) {
                campaignData = {
                    campaign: {
                        season: campaign.season + "-" + campaign.year,
                        endDate: campaign.endDate,
                        startDate: campaign.startDate,
                        status: campaign.status,
                        name: campaign.title,
                        message: campaign.goals.message,
                        products: campaign.products.campaignProducts,
                        student: {
                            name: member.student[0].firstName + " " + member.student[0].lastName,
                            goal: campaign.goals.participantGoal,
                            totalRaised: member.totalRaised
                        },
                        group: {
                            name: campaign.group[0].name,
                            cover: campaign.group[0].coverImage,
                            logo: campaign.group[0].logo,
                            goal: campaign.goals.groupGoal
                        },
                        organization: {
                            name: campaign.organization[0].name,
                            logo: campaign.organization[0].logo
                        },
                        company: {
                            logo: campaign.company[0].logo
                        },
                        messages:campaignOrders
                    }
                }
            }

            if (data) {
                return this.json(req, res, 200, { data: campaignData });
            }
            return this.jsonError(res, 400, this.__component, "get");
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };
}