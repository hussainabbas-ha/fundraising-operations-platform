
import { Code, ObjectId } from "mongodb";
import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core";



export default class AppSettingController extends BaseController {
  public __component: string = "appsettings";
  private filter_options: Filter_Options = {
    search: ["name", "email"],
    defaultSort: "createdAt",
    filters: {},
  };

  public get = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const defaultFilter = { _id: new ObjectId(id) };
      const setting = await this.collections.appSettings.findOne(defaultFilter,
        {
          projection: {
            _id: 1,
            title: 1,
            code: 1,
            value: 1
          }
        });
      if (setting) {
        return this.json(req, res, 200, { data: setting });
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
        this.collections.appSettings.aggregate([
          ...req.aggregations,
          {
            $project: {
              _id: 1,
              title: 1,
              code: 1,
              value: 1,
            },
          }
        ]).toArray(),
        this.collections.appSettings.aggregate(req.dbPagination).toArray(),
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
        title: global["config"].commonRules.name,
        code: global["config"].commonRules.name,
        value: "required",
      };
      const formErrors = await this.validateForm(req.body, Validationrules);
      const FormBody = this.getFormFields(req.body, Validationrules);
      FormBody.value = JSON.parse(FormBody.value)
      if (!formErrors) {
        if (!id) {
          const isSettingExist = await this.collections.appSettings.findOne({
            code: FormBody.code 
          });
          if (isSettingExist) {
            return this.jsonError(
              res,
              400,
              this.__component,
              "Setting already Exists"
            );
          }
        }
        if (id) {
          await this.collections.appSettings.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody } });
          await this.appLog(req, this.__component, "Update", new ObjectId(id), FormBody);
        } else {
          const createdSetting = await this.collections.appSettings.insertOne({ ...FormBody });
          await this.appLog(req, this.__component, "Create", createdSetting.insertedId, FormBody);
        }
        return this.json(req, res, 200, {
          message: `Setting ${(id) ? 'Updated' : 'Created'} Successfully`
        });
      } else {
        return this.jsonError(res, 400, this.__component, formErrors);
      }
    } catch (error) {
      return this.jsonError(res, 400, this.__component, "wrong", error);
    }
  };

  public getAllPermissions = async (req: Request, res: Response): Promise<Response> => {
    try {
      const {code} = req.query;
      const defaultFilter = { code: code };
      const setting = await this.collections.appSettings.findOne(defaultFilter,
        {
          projection: {
            _id: 1,
            value: 1
          }
        });
      if (setting) {
        return this.json(req, res, 200, { data: setting });
      }
      return this.jsonError(res, 400, this.__component, "get");
    } catch (error) {
      return this.jsonError(res, 500, this.__component, "invalid", error);
    }
  };
}