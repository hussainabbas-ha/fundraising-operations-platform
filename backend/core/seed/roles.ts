import { ObjectId } from "mongodb";
import { Role } from "../../models";

export const roles: Role[] = [
  {
    _id: new ObjectId(),
    name: "Developer",
    priority: 1,
    permissions: {
      dashboard: {
        view: true,
      },    
      role: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      permission: {
        list: true,
        add: true,
        view: true,
      },
      state: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      country: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      region: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true
      },
      user:{
        me:true,
        get: true,
        list: true,
        update: true,
        delete: true,
        add: false,
        view: true

      },
      company: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true
      },
      appsetting: {
				get: true,
				list: true,
				update: true,
				delete: true,
				add: true,
				view: true
			},
      devaccess: {
				view: true,
			},
      lookup:{
        list: true
      },
      vendor: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      dripCampaign:{
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      contact:{
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      contactGroup:{
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      product:{
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      emailType:{
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      campaign:{
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      
    },
  },
  {
    _id: new ObjectId(),
    name: "Super Admin",
    priority: 2,
    permissions: {
      dashboard: {
        view: true,
      },
      lookup: {
        list: true
      },
      company: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true
      },
      emailTemplate: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true
      },
      user: {
        invite: true,
        me:true
      },
      vendor: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      dripCampaign:{
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      product:{
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
    },
  },
  {
    _id: new ObjectId(),
    name: "Admin",
    priority: 3,
    permissions: {
      dashboard: {
        view: true,
      },
      user: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: false,
        view: true,
        invite: true,
        me:true
      },
      lookup: {
        list: true
      },
      organization: {
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true
      },
      group: {
				get: true,
				list: true,
				update: true,
				delete: true,
				add: true,
        view: true
      },
      campaign:{
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
        invite:true
      }
      
    },
  },
  {
    _id: new ObjectId(),
    name: "Sale Rep",
    priority: 4,
    permissions: {
      dashboard: {
        view: true,
      },
      user:{
        me:true
      },
      campaign:{
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
        invite:true
      },
    },
  },
  {
    _id: new ObjectId(),
    name: "Coach",
    priority: 5,
    permissions: {
      dashboard: {
        view: true,
      },
      user:{
        me:true
      },
      lookup: {
        list: true
      },
    },
  },
  {
    _id: new ObjectId(),
    name: "Student",
    priority: 6,
    permissions: {
      dashboard: {
        view: true,
      },
      user:{
        me:true
      },
      lookup: {
        list: true
      },
      campaign:{
        get: true,
        list: true,
        view: true
      },
      contact:{
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
      contactGroup:{
        get: true,
        list: true,
        update: true,
        delete: true,
        add: true,
        view: true,
      },
    },
  },
];
