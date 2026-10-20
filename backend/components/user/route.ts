import { route } from "../../__types";
import * as Controller from './controller';
const controller: Controller.default = new Controller.default;
import multer from 'multer';
const upload = multer({ dest: "temp/" });

const routes: route[] = [
	{ path: controller.__component + '/', method: "get", function: controller.list, private: true, perm_component: 'user', permission: 'list' },
	{ path: controller.__component + '/:id', method: "get", function: controller.get, private: true, perm_component: 'user', permission: 'get' },
	{ path: controller.__component + '/', method: "post", function: controller.createOrUpdate, uploader: upload.fields([{name: 'image', maxCount: 1 }]), private: true, perm_component: 'user', permission: 'add' },
	{ path: controller.__component + '/:id', method: "put", function: controller.createOrUpdate, uploader: upload.fields([{name: 'image', maxCount: 1 }]), private: true, perm_component: 'user', permission: 'update' },
	{ path: controller.__component + '/:id', method: "delete", function: controller.delete, private: true, perm_component: "user", permission: "delete" },
	{ path: controller.__component + '/invite', method: "post", function: controller.inviteUser, private: true, perm_component: 'user', permission: 'invite' },
	{ path: controller.__component + '/updatePassword', method: "post", function: controller.updatePassword, private: true, perm_component: 'user', permission: 'update' },
	{ path: controller.__component + '/profile/me', method: "get", function: controller.profile, private: true, perm_component: 'user', permission: 'me' },
	{ path: controller.__component + '/updateProfile', method: "post", function: controller.updateProfile, uploader: upload.fields([{name: 'image', maxCount: 1 }]), private: true, perm_component: 'user', permission: 'me' }
];
export default routes;