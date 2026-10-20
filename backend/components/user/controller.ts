import { ObjectId } from "mongodb";
import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core";
import { UserStatus } from "../../models/definitions";
import config from "../../config/config";
import { uploadImages } from "../../helpers/image";
import Utility from "../../helpers/utility";


export default class UserController extends BaseController {
  public __component: string = "users";
  private filter_options: Filter_Options = {
    search: ["name", "email"],
    defaultSort: "createdAt",
    filters: {},
  };
  public profile = async (req: Request, res: Response): Promise<Response> => {
    try {
      let data;
      const defaultFilter = { _id: req.user._id, status: UserStatus.Active };
      this.getAggrigation(req, this.filter_options, defaultFilter, false);
      [data] = await Promise.all([
        this.collections.users.aggregate([
          ...req.aggregations,
          {
            $lookup: {
              from: "roles",
              localField: "roleId",
              foreignField: "_id",
              as: "role"
            }
          },
          {
            $lookup: {
              from: "companies",
              localField: "companyId",
              foreignField: "_id",
              as: "company"
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
              _id: 1,
              firstName: 1,
              lastName: 1,
              image: 1,
              address: 1,
              email: 1,
              phoneNo: 1,
              roleId: 1,
              role: { $arrayElemAt: ["$role.name", 0] },
              status: 1,
              zipCode: 1,
              companyId: 1,
              company: { $arrayElemAt: ["$company", 0] },
              organizationId: 1,
              organization: "$organization",
            },
          }
        ]).toArray(),
      ]);
      data = data[0]
      return this.json(req, res, 200, { data });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "invalid", error);
    }
  };
  public updateProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.user._id;
      const Validationrules = {
        firstName: global["config"].commonRules.name,
        lastName: global["config"].commonRules.name,
        address: global["config"].commonRules.address,
        email: global["config"].commonRules.email,
        phoneNo: global["config"].commonRules.phone,
        zipCode: "max:5",
      };
      const formErrors = await this.validateForm(req.body, Validationrules);
      const FormBody = this.getFormFields(req.body, Validationrules);
      if (!formErrors) {
        if (req.files != null && req.files != undefined && Object.keys(req.files).length > 0) {
          const filesArray = req.files;
          if (config.production) {
            if (id) {
              const existingImage = await this.collections.users?.findOne(
                { _id: new ObjectId(id) }
              );
              if (existingImage) {
                if (filesArray["image"]) {
                  const imagePath = await uploadImages(filesArray["image"], 'Profile', existingImage?.image ?? "")
                  FormBody['image'] = imagePath[0];
                }
              }
            } else {
              const imagePath = await uploadImages(filesArray["image"], 'Profile')
              FormBody['image'] = imagePath[0];
            }
          } else {
            const img = new Utility();
            const imagePath = await img.uploadFiles(filesArray["image"], ['png', 'jpg', 'jpeg'], "profile/")
            if (imagePath && imagePath?.length > 0) {
              FormBody['image'] = imagePath[0];
            }
          }
        }
        await this.collections.users.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody } });
        await this.appLog(req, this.__component, "Profile", new ObjectId(id), FormBody);

        return this.json(req, res, 200, {
          message: `Profile Updated Successfully`
        });
      } else {
        return this.jsonError(res, 400, this.__component, formErrors);
      }
    } catch (error) {
      return this.jsonError(res, 400, this.__component, "wrong", error);
    }
  };
  public get = async (req: Request, res: Response): Promise<Response> => {
    try {
      let data;
      const { id } = req.params;
      const defaultFilter = { _id: new ObjectId(id) };
      this.getAggrigation(req, this.filter_options, defaultFilter);
      [data] = await Promise.all([
        this.collections.users.aggregate([
          ...req.aggregations,
          {
            $lookup: {
              from: "roles",
              localField: "roleId",
              foreignField: "_id",
              as: "role"
            }
          },
          {
            $lookup: {
              from: "companies",
              localField: "companyId",
              foreignField: "_id",
              as: "company"
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
              _id: 1,
              firstName: 1,
              lastName: 1,
              image: 1,
              address: 1,
              email: 1,
              roleId: 1,
              role: { $arrayElemAt: ["$role.name", 0] },
              status: 1,
              phoneNo: 1,
              zipCode: 1,
              companyId: 1,
              company: { $arrayElemAt: ["$company", 0] },
              organizationId: 1,
              organization: "$organization",
            },
          }
        ]).toArray(),
      ]);
      data = data[0]
      return this.json(req, res, 200, { data });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "invalid", error);
    }
  };
  public list = async (req: Request, res: Response): Promise<Response> => {
    try {
      const defaultFilter = {};
      if (["developer@loopbrackets.com", "superadmin@victoryfunds.com"].indexOf(req.user.email) == -1) {
        defaultFilter['email'] = { $nin: ["developer@loopbrackets.com", "superadmin@victoryfunds.com", req.user.email] }
      }
      this.getAggrigation(req, this.filter_options, defaultFilter);
      const [data, count] = await Promise.all([
        this.collections.users.aggregate([
          ...req.aggregations,
          {
            $lookup: {
              from: "roles",
              localField: "roleId",
              foreignField: "_id",
              as: "role"
            }
          },
          {
            $lookup: {
              from: "companies",
              localField: "companyId",
              foreignField: "_id",
              as: "company"
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
              _id: 1,
              firstName: 1,
              lastName: 1,
              image: 1,
              address: 1,
              phoneNo: 1,
              email: 1,
              roleId: 1,
              role: { $arrayElemAt: ["$role.name", 0] },
              status: 1,
              zipCode: 1,
              companyId: 1,
              company: { $arrayElemAt: ["$company", 0] },
              organizationId: 1,
              organization: "$organization",
            },
          }
        ]).toArray(),
        this.collections.users.aggregate(req.dbPagination).toArray(),
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
        firstName: global["config"].commonRules.name,
        lastName: global["config"].commonRules.name,
        password: global["config"].commonRules.password.push("confirmed"),
        address: global["config"].commonRules.address,
        email: global["config"].commonRules.email,
        status: "required",
        roleId: global["config"].commonRules.id,
        phoneNo: global["config"].commonRules.phone,
        zipCode: "max:5",
        companyId: global["config"].commonRules.id,
      };
      const formErrors = await this.validateForm(req.body, Validationrules);
      // const formFields = { ...Validationrules, ...{ dob: global["config"].commonRules.date, zipCode:global["config"].commonRules.date, invitation: Object } }
      const FormBody = this.getFormFields(req.body, Validationrules);
      if (!formErrors) {
        if (!id) {
          const existingUser = await this.collections.users.findOne({
            email: FormBody.email,
          });
          if (existingUser) {
            return this.jsonError(
              res,
              400,
              this.__component,
              "Email already Exists"
            );
          }
        }
        if (req.files != null && req.files != undefined && Object.keys(req.files).length > 0) {
          const filesArray = req.files;
          if (config.production) {
            if (id) {
              const existingImage = await this.collections.users?.findOne(
                { _id: new ObjectId(id) }
              );
              if (existingImage) {
                if (filesArray["image"]) {
                  const imagePath = await uploadImages(filesArray["image"], 'Profile', existingImage?.image ?? "")
                  FormBody['image'] = imagePath[0];
                }
              }
            } else {
              const imagePath = await uploadImages(filesArray["image"], 'Profile')
              FormBody['image'] = imagePath[0];
            }
          } else {
            const img = new Utility();
            const imagePath = await img.uploadFiles(filesArray["image"], ['png', 'jpg', 'jpeg'], "profile/")
            if (imagePath && imagePath?.length > 0) {
              FormBody['image'] = imagePath[0];
            }
          }
        }
        const password = this.passwordEn(FormBody.password);
        if (id) {
          delete FormBody.password
          await this.collections.users.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody, roleId: ObjectId.createFromHexString(FormBody.roleId), companyId: ObjectId.createFromHexString(FormBody.companyId) } });
          await this.appLog(req, this.__component, "Update", new ObjectId(id), FormBody);
        } else {
          const createdUser = await this.collections.users.insertOne({ ...FormBody, ...password, roleId: ObjectId.createFromHexString(FormBody.roleId), companyId: ObjectId.createFromHexString(FormBody.companyId) });
          await this.appLog(req, this.__component, "Create", createdUser.insertedId, FormBody);
        }
        return this.json(req, res, 200, {
          message: `User ${(id) ? 'Updated' : 'Created'} Successfully`
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
        await this.collections.users.updateOne({ _id: new ObjectId(id) }, { $set: { status: UserStatus.Deleted } });
        await this.appLog(req, this.__component, "Delete", new ObjectId(id));
        return this.json(req, res, 200, { message: `User Deleted Successfully` });
      } else {
        return this.jsonError(res, 400, this.__component, 'delete');
      }
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "invalid", error);
    }
  };

  public inviteUser = async (req: Request, res: Response): Promise<Response> => {
    try {

      const currentDate = new Date();
      const validTill = currentDate.setHours(currentDate.getHours() + 24);
      const Validationrules = {
        email: global["config"].commonRules.email,
        roleId: global["config"].commonRules.id,
        companyId: global["config"].commonRules.id,
      };
      const formErrors = await this.validateForm(req.body, Validationrules);
      const FormBody = await this.getFormFields(req.body, Validationrules);
      if (!formErrors) {
        const isExist = await this.collections.users.findOne({email: FormBody.email});
        if(isExist){
          return this.jsonError(
            res,
            400,
            this.__component,
            "Email already Exists"
          );
        }
        const util = new Utility();
        const code = util.randomString(6, true);
        const companyId = (req.user.role?.name && ["Developer", "Super Admin"].indexOf(req.user.role?.name) == -1) ? req.user.companyId : FormBody.companyId
        const company = await this.collections.companies.findOne({ _id: companyId })
        const url = `company=${companyId}&email=${FormBody.email}&role=${FormBody.roleId}&code=${code}`
        const cipher = util.encryptData(url);
        const baseUrl = config.production ? `https://${company?.subdomain}.${company?.website}/` : 'localhost:4200/';
        const invitationLink = `${baseUrl}signup?&code=${cipher}`;
        FormBody.status = "invited"
        FormBody.invitation = {
          code: code,
          validTill: validTill,
          link: invitationLink
        }
        const invitedUser = await this.collections.users.insertOne({ ...FormBody, roleId: ObjectId.createFromHexString(FormBody.roleId), companyId: ObjectId.createFromHexString(FormBody.companyId) });
        await this.appLog(req, this.__component, "Invite", invitedUser.insertedId, FormBody);

      } else {
        return this.jsonError(res, 400, this.__component, formErrors);
      }
      return this.json(req, res, 200, {
        message: `Invitation Email Send Successfully`
      });
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "invalid", error);
    }
  };

  public updatePassword = async (req: Request, res: Response): Promise<Response> => {
    const FormBody: { oldPassword: string, newPassword: string } = req.body;
    const user = await this.collections.users?.findOne({ _id: req.user._id });
    if (user) {
      const checkPassword = this.passwordEn(FormBody.oldPassword, user.salt);
      if (checkPassword.password === user.password) {
        const nePassword = this.passwordEn(FormBody.newPassword);
        await this.collections.users?.updateOne({ _id: user._id }, { $set: nePassword });
      }
      return this.json(req, res, 200, { message: "Password Updated Successfully" });
    }

    return this.jsonError(
      res,
      400,
      this.__component,
      "Password is not updated"
    );
  };
}
