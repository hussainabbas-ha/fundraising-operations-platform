import { ObjectId } from "mongodb";
import { Request } from "../__types";
import DataBase from "../core/Database";


export default class UserHelper extends DataBase {
  static hasPermissions = (
    req: Request,
    component: string,
    permission: string
  ): boolean => {
    if (
      req.user.role?.permissions[component] &&
      req.user.role?.permissions[component][permission] == true
    ) {
      return true;
    }
    return false;
  };

  constructor() {
    super();
  }

  public getToken = async (_id: ObjectId): Promise<string> => {
    const user = await this.collections.users.aggregate([
      { $match: { _id: _id } },
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
          picture: 1,
          address: 1,
          email: 1,
          roleId: 1,
          role: { $arrayElemAt: ["$role", 0] },
          status: 1,
          zipCode: 1,
          companyId: 1,
          company: "$company",
          organizationId: 1,
          organization: "$organization",
        },
      }
    ]).toArray();
    if (user.length > 0) {
      return this.signJwt(user[0]);
    } else {
      return '';
    }
  }

  // static logEvent = async (event: string, user_id: number | null = null): Promise<void> => {
  // 	if (user_id || global['user']) {
  // 		if (global['user']) {
  // 			user_id = global['user'].id;
  // 		}
  // 		await UserLog.create({
  // 			user_id: user_id,
  // 			event: event
  // 		});
  // 	}
  // }

  // static sendVerification = async (code, verification_bit) => {
  // 	await UserVerification.create({
  // 		code: code,
  // 		verification_bit: verification_bit,
  // 		expire: moment().add(2, 'hours')
  // 	});
  // }
}
