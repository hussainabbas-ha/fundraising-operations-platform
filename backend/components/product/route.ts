import { route } from "../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;
import multer from 'multer';
const upload = multer({ dest: "temp/" });

const routes: route[] = [
    { path: controller.__component + '/:id', method: "get", function: controller.get, private: true, perm_component: 'product', permission: 'get' },
    { path: controller.__component + '/', method: "get", function: controller.list, private: true, perm_component: 'product', permission: 'list' },
    { path: controller.__component + '/', method: "post", function: controller.createOrUpdate, uploader: upload.fields([{name: 'productImage', maxCount: 1 }]), private: true, perm_component: 'product', permission: 'add' },
    { path: controller.__component + '/:id', method: "put", function: controller.createOrUpdate, uploader: upload.fields([{name: 'productImage', maxCount: 1 }]), private: true, perm_component: 'product', permission: 'update' },
    { path: controller.__component + '/:id', method: "delete", function: controller.delete, private: true, perm_component: 'product', permission: 'delete' },
];
export default routes;