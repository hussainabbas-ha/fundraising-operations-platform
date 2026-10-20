import { route } from "../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;
import multer from 'multer';
const upload = multer({ dest: "temp/" });

const routes: route[] = [
    { path: controller.__component + '/:id', method: "get", function: controller.get, private: true, perm_component: 'company', permission: 'get' },
    { path: controller.__component + '/', method: "get", function: controller.list, private: true, perm_component: 'company', permission: 'list' },
    { path: controller.__component + '/', method: "post", function: controller.createOrUpdate, uploader: upload.fields([{name: 'companyLogo', maxCount: 1 }]), private: true, perm_component: 'company', permission: 'add' },
    { path: controller.__component + '/:id', method: "put", function: controller.createOrUpdate, uploader: upload.fields([{name: 'companyLogo', maxCount: 1 }]), private: true, perm_component: 'company', permission: 'update' },
    { path: controller.__component + '/:id', method: "delete", function: controller.delete, private: true, perm_component: "company", permission: "delete" },
    { path: controller.__component + '/create-templates/:companyId', method: "get", function: controller.companyEmailTemplates, private: true, perm_component: 'devaccess', permission: 'makeTemplates' },
    { path: controller.__component + '/company/detail/:id', method: "get", function: controller.detail, private: true, perm_component: 'company', permission: 'get' },
];
export default routes;