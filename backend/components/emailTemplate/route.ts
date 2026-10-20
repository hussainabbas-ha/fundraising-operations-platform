import { route } from "../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;

const routes: route[] = [
	{ path: controller.__component + '/list/types', method: "get", function: controller.getEmailTypes, private: true, perm_component: "emailTemplate", permission: "list" },
	{ path: controller.__component + '/list/templates/:emailTypeId', method: "get", function: controller.getEmailTemplatesByTypeId, private: true, perm_component: "emailTemplate", permission: "list" },
	{ path: controller.__component + '/:id', method: "get", function: controller.getSingleTemplate, private: true, perm_component: "emailTemplate", permission: "get" },
	{ path: controller.__component + '/email/type-fields/:emailTypeId', method: "get", function: controller.getFieldByTypeId, private: true, perm_component: "emailTemplate", permission: "get" },
	{ path: controller.__component + '/', method: "post", function: controller.createOrUpdate, private: true, perm_component: "emailTemplate", permission: "add" },
	{ path: controller.__component + '/:id', method: "put", function: controller.createOrUpdate, private: true, perm_component: "emailTemplate", permission: "update" },
	{ path: controller.__component + '/updatestatus/:id', method: "put", function: controller.changeStatus, private: true, perm_component: "emailTemplate", permission: "update" },
	{ path: controller.__component + '/duplicate/:id', method: "post", function: controller.duplicateTemplate, private: true, perm_component: "emailTemplate", permission: "add" },
	{ path: controller.__component + '/:id', method: "delete", function: controller.delete, private: true, perm_component: "emailTemplate", permission: "delete" },
];
export default routes;