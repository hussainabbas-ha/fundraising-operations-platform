import { ObjectId } from "mongodb";
import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core";
import { CompanyStatus } from "../../models/definitions";
import config from "../../config/config";
import { uploadImages } from "../../helpers/image";
import Utility from "../../helpers/utility";

export default class CompanyController extends BaseController {
  public __component: string = "companies";
  private readonly filter_options: Filter_Options = {
    search: ["name", "email"],
    defaultSort: "createdAt",
    filters: {},
  };
  public get = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const defaultFilter = { _id: new ObjectId(id) };
      const company = await this.collections.companies.findOne(defaultFilter,
        {
          projection: {
            _id: 1,
            name: 1,
            licence: 1,
            address: 1,
            logo: 1,
            email: 1,
            phoneNo: 1,
            status: 1,
            website: 1,
            subdomain: 1,
            package: 1,
            templatesCreated:1
          }
        });
      if (company) {
        return this.json(req, res, 200, { data: company });
      }
      return this.jsonError(res, 400, this.__component, "get");
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "invalid", error);
    }
  };
  public list = async (req: Request, res: Response): Promise<Response> => {
    try {
      const defaultFilter = {};
      this.getAggrigation(req, this.filter_options, defaultFilter);
      const [data, count] = await Promise.all([
        this.collections.companies.aggregate([
          ...req.aggregations,
          {
            $project: {
              _id: 1,
              name: 1,
              licence: 1,
              address: 1,
              logo: 1,
              email: 1,
              phoneNo: 1,
              status: 1,
              website: 1,
              subdomain: 1,
              package: 1,
              templatesCreated:1
            },
          }
        ]).toArray(),
        this.collections.companies.aggregate(req.dbPagination).toArray(),
      ]);
      return this.json(req, res, 200, { data, count: count });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "invalid", error);
    }
  };
  public createOrUpdate = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const Validationrules = {
        name: global["config"].commonRules.name,
        licence: global["config"].commonRules.name,
        address: global["config"].commonRules.address,
        email: global["config"].commonRules.email,
        phoneNo: global["config"].commonRules.phone,
        status: "required",
        website: global["config"].commonRules.url,
        subdomain: global["config"].commonRules.subdomain,
      };
      req.body.package = JSON.parse(req.body.package);
      const formErrors = await this.validateForm(req.body, Validationrules);
      const formFields = { ...Validationrules, ...{ package: Object } }
      const FormBody = this.getFormFields(req.body, formFields);
      if (!formErrors) {
        if (!id) {
          const isCompanyExist = await this.collections.companies.findOne({
            $or: [{ email: FormBody.email }, { website: FormBody.website }, { name: FormBody.name }, { licence: FormBody.licence }]

          });
          if (isCompanyExist) {
            return this.jsonError(
              res,
              400,
              this.__component,
              "Company already Exists"
            );
          }
        }
        if (req.files != null && req.files != undefined && Object.keys(req.files).length > 0) {
          const filesArray = req.files;
          if (config.production) {
            if (id) {
              const existingImage = await this.collections.companies?.findOne(
                { _id: new ObjectId(id) }
              );
              if (existingImage) {
                if (filesArray["companyLogo"]) {
                  const imagePath = await uploadImages(filesArray["companyLogo"], 'Company Logo', existingImage?.logo ?? "")
                  FormBody['logo'] = imagePath[0];
                }
              }
            } else {
              const imagePath = await uploadImages(filesArray["companyLogo"], 'Company Logo')
              FormBody['logo'] = imagePath[0];
            }
          } else {
            const img = new Utility();
            const imagePath = await img.uploadFiles(filesArray["companyLogo"], ['png', 'jpg', 'jpeg'], "companyLogo/")
            if (imagePath && imagePath?.length > 0) {
              FormBody['logo'] = imagePath[0];
            }
          }
        }

        if (id) {
          await this.collections.companies.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody } });
          await this.appLog(req, this.__component, "Update", new ObjectId(id), FormBody);
        } else {
          const createdCompany = await this.collections.companies.insertOne({ ...FormBody });
          await this.appLog(req, this.__component, "Create", createdCompany.insertedId, FormBody);
        }
        return this.json(req, res, 200, {
          message: `Company ${(id) ? 'Updated' : 'Created'} Successfully`
        });
      } else {
        return this.jsonError(res, 400, this.__component, formErrors);
      }
    } catch (error) {
      return this.jsonError(res, 400, this.__component, "wrong", error);
    }
  };
  public delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      if (id) {
        await this.collections.companies.updateOne({ _id: new ObjectId(id) }, { $set: { status: CompanyStatus.Deleted } });
        await this.appLog(req, this.__component, "Delete", new ObjectId(id));
        return this.json(req, res, 200, { message: `Company Deleted Successfully` });
      } else {
        return this.jsonError(res, 400, this.__component, 'delete');
      }
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "invalid", error);
    }
  };

  public companyEmailTemplates = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { companyId } = req.params
      if (companyId) {
        const company = await this.collections.companies.findOne({ _id: new ObjectId(companyId) });
        if (company) {
          await this.collections.companies.updateOne({ _id: new ObjectId(companyId) }, { $set: { templatesCreated: true } })
          const emailTypes = await this.collections.emailTypes.find({ isSuperAdmin: true }).toArray();
          if (emailTypes.length > 0) {
            emailTypes.forEach(async el => {
              const templates = await this.collections.emailTemplates.find({ emailTypeId: new ObjectId(el._id), isSuperAdmin: true }).toArray();
              el.isSuperAdmin = false;
              const { _id, ...emailTypeWithoutId } = el;

              const createdType = await this.collections.emailTypes.insertOne({ _id: new ObjectId(), ...emailTypeWithoutId, companyId: new ObjectId(company._id) })
              if (templates.length > 0) {
                const updatedTemplates = templates.map(template => {
                  const { _id, ...templateWithoutId } = template;
                  return {
                    ...templateWithoutId,
                    _id: new ObjectId(),
                    isSuperAdmin: false,
                    emailTypeId: new ObjectId(createdType.insertedId)
                  };
                });
                await this.collections.emailTemplates.insertMany(updatedTemplates);
              }
            });
          }
        }
        return this.json(req, res, 200, {
          message: `Templates Created Successfully`
        });
      } else {
        return this.jsonError(res, 400, this.__component, 'Company Id not Found');
      }
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "invalid", error);
    }
  };

  public detail = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const defaultFilter = { _id: new ObjectId(id) };
        const company = await this.collections.companies.findOne(defaultFilter, {
            projection: {
              _id: 1,
              name: 1,
              licence: 1,
              address: 1,
              logo: 1,
              email: 1,
              phoneNo: 1,
              status: 1,
              website: 1,
              subdomain: 1,
              package: 1,
            }
        });
        this.getAggrigation(req, this.filter_options, { companyId: new ObjectId(id) });
        const [data, count] = await Promise.all([
            this.collections.organizations.aggregate([
                ...req.aggregations,
                {
                  $lookup: {
                      from: "groups",
                      localField: "_id",
                      foreignField: "organizationId",
                      as: "groups"
                  }
              },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        email:1,
                        groups: {$size:{ $ifNull: ["$groups", []] }}
                    },
                }
            ]).toArray(),
            this.collections.organizations.aggregate(req.dbPagination).toArray(),
        ]);
        return this.json(req, res, 200, { data: { company: company, organizations: data }, count: count });
    } catch (error) {
        return this.jsonError(res, 500, this.__component, "invalid", error);
    }
};
}