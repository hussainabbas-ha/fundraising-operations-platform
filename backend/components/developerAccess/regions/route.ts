import { route } from "../../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;

const routes: route[] = [
	{ path: controller.__component + '/', method: "get", function: controller.list, private: true, perm_component: "region", permission: "list" },
	{ path: controller.__component + '/:id', method: "get", function: controller.get, private: true, perm_component: "region", permission: "get" },
	{ path: controller.__component + '/', method: "post", function: controller.createOrUpdate, private: true, perm_component: "region", permission: "add" },
	{ path: controller.__component + '/:id', method: "put", function: controller.createOrUpdate, private: true, perm_component: "region", permission: "update" },
	{ path: controller.__component + '/:id', method: "delete", function: controller.delete, private: true, perm_component: "region", permission: "delete" },
	{ path: controller.__component + '/state/:stateId', method: "get", function: controller.getRegionsByState, private: true, perm_component: "region", permission: "get" }
];
export default routes;