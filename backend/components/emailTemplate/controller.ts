
import { ObjectId } from 'mongodb';
import { BaseController } from '../../core/BaseController';
import { Filter_Options, Response, Request } from '../../__types';
import { SMS } from 'aws-sdk';
import { EmailTemplate } from '../../models';


export default class EmailTemplateController extends BaseController {
    public __component: string = "emailTemplates";
    private readonly filter_options: Filter_Options = {
        search: ["title",],
        defaultSort: "_id",
        filters: {},
    };

    public getEmailTypes = async (req: Request, res: Response): Promise<Response> => {
        try {
            const defaultFilter = {};
            if (req?.user?.role?.name && ['Developer', 'Super Admin'].indexOf(req.user.role.name) > -1) {
                defaultFilter['isSuperAdmin'] = Object.keys(req.query).length <= 0;
            } else {
                defaultFilter['isSuperAdmin'] = false
            }
            console.log(req.user.companyId, defaultFilter['isSuperAdmin'])
            this.getAggrigation(req, this.filter_options, defaultFilter, false);
            const [data] = await Promise.all([
                this.collections.emailTypes.aggregate([
                    ...req.aggregations,
                    {
                        $lookup: {
                            from: 'emailTemplates',
                            as: 'templates',
                            let: {
                                isSuperAdmin: defaultFilter['isSuperAdmin'],
                                emailTypeId: "$_id",
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [{ $eq: ["$isSuperAdmin", "$$isSuperAdmin"] },
                                            { $eq: ["$emailTypeId", "$$emailTypeId"] },
                                            ]
                                        },
                                    },
                                },
                            ]
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            count: {
                                $size: {
                                    $filter: {
                                        input: "$templates",
                                        as: "temp",
                                        cond: { $eq: ["$$temp.isDeleted", false] }
                                    }
                                }
                            }
                        }
                    },
                    {
                        $sort: { title: 1 }
                    },
                ]).toArray(),
            ]);
            return this.json(req, res, 200, { data });
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "wrong", error);
        }
    }

    public getEmailTemplatesByTypeId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { emailTypeId } = req.params;
            const defaultFilter = { isDeleted: false };
            if (emailTypeId != "undefined") {
                defaultFilter['emailTypeId'] = new ObjectId(emailTypeId);
                this.getAggrigation(req, this.filter_options, defaultFilter, false);
                const [data, count] = await Promise.all([
                    this.collections.emailTemplates.aggregate([
                        ...req.aggregations,
                        {
                            $project: {
                                EmailTypesId: 1,
                                title: 1,
                                subject: 1,
                                message: 1,
                                sms: 1,
                                active: 1,
                                isDeleted: 1,
                                isSuperAdmin: 1,
                            }
                        }
                    ]).toArray(),
                    this.collections.emailTemplates.aggregate(req.dbPagination).toArray(),
                ]);
                return this.json(req, res, 200, { data, count: count });
            } else {
                console.log("here")
                return this.json(req, res, 200, {});
            }
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "wrong", error);
        }
    }

    public getSingleTemplate = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const defaultFilter = { _id: new ObjectId(id) };
            const emailTemplate = await this.collections.emailTemplates.findOne(defaultFilter, {
                projection: {
                    _id: 1,
                    EmailTypesId: 1,
                    title: 1,
                    subject: 1,
                    message: 1,
                    sms: 1,
                    active: 1,
                    isDeleted: 1,
                    isSuperAdmin: 1,
                }
            });
            if (emailTemplate) {
                return this.json(req, res, 200, { data: emailTemplate });
            }
            return this.jsonError(res, 400, this.__component, "get");
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "wrong", error);
        }
    }

    public getFieldByTypeId = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { emailTypeId } = req.params;
            const defaultFilter = { _id: new ObjectId(emailTypeId) };
            const result = await this.collections.emailTypes.findOne(defaultFilter, {
                projection: {
                    _id: 1,
                    used_for: 1,
                    fields: 1
                }
            });
            return this.json(req, res, 200, { data: result });
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "wrong", error);
        }
    }

    public createOrUpdate = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const Validationrules = {
                title: global['config'].commonRules.name,
                subject: global['config'].commonRules.subject,
                message: global['config'].commonRules.message,
                active: 'required'
            }
            const formErrors = await this.validateForm(req.body, Validationrules);
            const formFields = { ...Validationrules, ...{ sms: String, emailTypeId: ObjectId } }
            const FormBody = this.getFormFields(req.body, formFields);
            FormBody.emailTypeId = ObjectId.createFromHexString(FormBody.emailTypeId);
            FormBody.isDeleted = false;
            if (!formErrors) {
                if (id) {
                    await this.collections.emailTemplates?.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody } });
                    await this.appLog(req, this.__component, "Update", new ObjectId(id), FormBody);
                } else {
                    if (req?.user?.role?.name && ['Developer', 'Super Admin'].indexOf(req.user.role.name) === -1) {
                        FormBody.companyId = new ObjectId(req.user.companyId);
                        FormBody.isSuperAdmin = false
                    } else {
                        FormBody.isSuperAdmin = true
                    }
                    await this.collections.emailTemplates?.updateMany({ emailTypeId: FormBody.emailTypeId }, { $set: { active: false } })
                    const createdEmailTemplate = await this.collections.emailTemplates?.insertOne({ ...FormBody, });
                    if (req?.user?.role?.name && ['Developer', 'Super Admin'].indexOf(req.user.role.name) > -1) {
                        const companies = await this.collections.companies.find({ templatesCreated: true }).toArray();
                        if (companies.length > 0) {
                            companies.forEach(async el => {

                                const emailType = await this.collections.emailTypes.findOne({ _id: FormBody.emailTypeId });
                                const temp = await this.collections.emailTypes.findOne({ used_for: emailType?.used_for, companyId: new ObjectId(el._id) });
                                console.log(temp)
                                const formBodyWithoutId = { ...FormBody };
                                delete formBodyWithoutId._id;
                                delete formBodyWithoutId.active;
                                await this.collections.emailTemplates?.insertOne({ ...formBodyWithoutId, emailTypeId: new ObjectId(temp?._id), isSuperAdmin: false, active: false });

                            })
                        }
                    }
                    await this.appLog(req, this.__component, "Create", createdEmailTemplate.insertedId, FormBody);
                }
                return this.json(req, res, 200, { message: `Email Template ${(id) ? 'Updated' : 'Created'} Successfully` });
            } else {
                return this.jsonError(res, 400, this.__component, formErrors);
            }
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "wrong", error);
        }
    }

    public changeStatus = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const Validationrules = {
                emailTypeId: global['config'].commonRules.id,
            }
            const formErrors = await this.validateForm(req.body, Validationrules);
            if (!formErrors) {
                const FormBody = req.body;
                if (FormBody.emailTypeId) {
                    await this.collections.emailTemplates?.updateMany({ emailTypeId: ObjectId.createFromHexString(FormBody.emailTypeId) }, { $set: { active: false } })
                    await this.collections.emailTemplates?.updateOne({ _id: new ObjectId(id) }, { $set: { active: true } });
                    await this.appLog(req, this.__component, "Make it Active", new ObjectId(id), FormBody);
                }
                return this.json(req, res, 200, { message: "Email Template Activated Successfully" });
            } else {
                return this.jsonError(res, 400, this.__component, formErrors);
            }
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "wrong", error);
        }
    }

    public duplicateTemplate = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const template = await this.collections.emailTemplates.findOne({ _id: new ObjectId(id) });
            if (template) {
                const { _id: _, ...newObj } = template;
                if (template.active) {
                    await this.collections.emailTemplates?.updateMany({ emailTypeId: new ObjectId(template.emailTypeId) }, { $set: { active: false } })
                    await this.appLog(req, this.__component, "Make it Duplicate", new ObjectId(id), template);
                }
                await this.collections.emailTemplates?.insertOne({ _id: new ObjectId(), ...newObj });
            }
            return this.json(req, res, 200, { message: "Email Template Duplicated Successfully" });
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "wrong", error);
        }
    }

    public delete = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            if (id) {
                await this.collections.emailTemplates.updateOne({ _id: new ObjectId(id) }, { $set: { isDeleted: true } });
                await this.appLog(req, this.__component, "Delete", new ObjectId(id));
                return this.json(req, res, 200, { message: `Email Template Deleted Successfully` });
            } else {
                return this.jsonError(res, 400, this.__component, 'delete');
            }
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };

}