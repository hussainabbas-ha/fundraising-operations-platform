import { ObjectId } from "mongodb";
import { Request, Response } from "../../__types";
import { BaseController } from "../../core";
import UserHelper from "../../helpers/user";
import Utility from "../../helpers/utility";
import { UserStatus } from "../../models/definitions";

export default class AuthController extends BaseController {
  public __component: string = "auth";
  protected userHelper: UserHelper = new UserHelper();
  public login = async (req: Request, res: Response): Promise<Response> => {
    const FormBody: { email: string; password: string } = req.body;
    const user = await this.collections.users.findOne({ email: FormBody.email });
    if (user) {
      if (user.status == UserStatus.Active) {
        const password = this.passwordEn(FormBody.password, user.salt);
        if (password.password === user.password) {
          const token = await this.userHelper.getToken(user._id);
          req.user = user;
          await this.appLog(req, this.__component, "Login");
          return this.json(req, res, 200, { data: null, message: "Login Successfully", token });
        }
      } else {
        return this.jsonError(res, 400, this.__component, "Access is revoked");
      }
    }
    return this.jsonError(res, 400, this.__component, "Login information is wrong");
  };

  public register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const Validationrules = {
        firstName: global["config"].commonRules.name,
        lastName: global["config"].commonRules.name,
        password: global["config"].commonRules.password.push("confirmed"),
        email: global["config"].commonRules.email,
        address: global["config"].commonRules.address,
        phoneNo: global["config"].commonRules.phone,
        zipCode: "max:5",
        code:"required"
      };
      const formErrors = await this.validateForm(req.body, Validationrules);
      const FormBody = this.getFormFields(req.body, Validationrules);
      if (!formErrors) {
        const util = new Utility();
        const decipher = util.decryptData(FormBody.code)
        const validData = new URLSearchParams(decipher);
        const password = this.passwordEn(FormBody.password);
        const user = await this.collections.users.findOne({ email: validData.get('email') ?? "" })
        if (user) {
          req.user = user;
          FormBody.status = UserStatus.Active
          delete FormBody.code
          await this.collections.users.updateOne({ _id: user._id }, { $unset: { invitation: "" }, $set: { ...FormBody, ...password, roleId: ObjectId.createFromHexString(validData.get('role') ?? ""), companyId: ObjectId.createFromHexString(validData.get('company') ?? "") } });
          await this.appLog(req, this.__component, "Register", new ObjectId(user._id), FormBody);
        }
        return this.json(req, res, 200, { message: "Registered Successfully" });
      } else {
        return this.jsonError(res, 400, this.__component, formErrors);
      }
    } catch (error) {
      return this.jsonError(res, 400, this.__component, "wrong", error);
    }
  };

  public forgetPassword = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const FormBody: { email: string } = req.body;
    const user = await this.collections.users.findOne({ email: FormBody.email });
    if (user) {
      // let message_subject = 'Reset Password';
      // const html =  '<body> Password Reset Link <a href="/resetPassword">Click to Reset Your Password</body>';
      // const mailOptions = {
      //   from: 'lovelaunch.com',
      //   to: 'FormBody.email',
      //   subject: message_subject,
      //   text: html
      // };
      // const email = new EmailHelper();
      // await email.sendEmailUsingSendGrid(mailOptions);
      return this.json(
        req,
        res,
        200,
        { message: "Check your Email" }
      );
    }
    return this.jsonError(res, 400, this.__component, "Email is incorrect");
  };

  public isLinkValid = async (req: Request, res: Response): Promise<Response> => {
    const util = new Utility();
    const decipher = util.decryptData(req.query.code);
    console.log(decipher)
    const validData = new URLSearchParams(decipher);
    const user = await this.collections.users.findOne({ email: validData.get('email') ?? '' });
    console.log(validData.get('email'));
    if (user) {
      if (user.invitation && user.invitation.code == validData.get('code')) {
        const date = new Date();
        if (date <= user.invitation.validTill) {
          return this.json(req, res, 200, { data: { success: true, email: validData.get('email'), firstName: validData.get('firstName'), lastName: validData.get('lastName')} });
        } else {
          return this.json(req, res, 200, { data: { success: false } });
        }
      }
      else {
        return this.json(req, res, 200, { data: { success: false } });
      }
    }
    else {
      return this.json(req, res, 200, { data: { success: false } });
    }
  };
}
