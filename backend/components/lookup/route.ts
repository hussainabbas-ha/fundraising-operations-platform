import { route } from "../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;

const routes: route[] = [
	{ path: controller.__component + '/getStates', method: "get", function: controller.getStatesData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getRegions/:ids', method: "get", function: controller.getRegionsData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getRoles', method: "get", function: controller.getRolesData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getCompanies', method: "get", function: controller.getCompanyData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getStatus', method: "get", function: controller.getStatus, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getOrganizations', method: "get", function: controller.getOrganizationData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getGroups', method: "get", function: controller.getGroupData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getVendors', method: "get", function: controller.getVendorData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getOrganizationUsers', method: "get", function: controller.getOrganizationUserData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getProductsByVendor', method: "get", function: controller.getProductsData, private: true, perm_component: 'lookup', permission: 'list' },
	{ path: controller.__component + '/getContacts', method: "get", function: controller.getContactsData, private: true, perm_component: 'lookup', permission: 'list' },
];
export default routes;