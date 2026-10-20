import { ObjectId } from "mongodb";
import { Filter_Options, Request, Response } from "../../__types";
import { BaseController } from "../../core/BaseController";
import config from "../../config/config";
import { uploadImages } from "../../helpers/image";
import Utility from "../../helpers/utility";
import ne from 'node-each';
export default class ProductController extends BaseController {
    public __component: string = "products";
    private filter_options: Filter_Options = {
        search: ["name"],
        defaultSort: "_id",
        filters: {},
    };
    public list = async (req: Request, res: Response): Promise<Response> => {
        try {
            const defaultFilter = {};
            this.getAggrigation(req, this.filter_options, defaultFilter);
            const [data, count] = await Promise.all([
                this.collections.products.aggregate([
                    ...req.aggregations,
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            vendorId: 1,
                            sellingPrice: 1,
                            costPrice: 1,
                            sku: 1,
                            isActive: 1,
                            variants: { $size: { $ifNull: ["$variants", []] } },
                            image: 1,
                        }
                    }
                ]).toArray(),
                this.collections.products.aggregate(req.dbPagination).toArray(),
            ]);
            return this.json(req, res, 200, { data, count: count });
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };

    public get = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const defaultFilter = { _id: new ObjectId(id) };
            const products = await this.collections.products.findOne(defaultFilter, {
                projection: {
                    _id: 1,
                    title: 1,
                    vendorId: 1,
                    sellingPrice: 1,
                    costPrice: 1,
                    sku: 1,
                    isActive: 1,
                    variants: 1,
                    image: 1
                }
            });
            if (products) {
                return this.json(req, res, 200, {
                    data: products
                });
            }
            return this.jsonError(res, 400, this.__component, "get");
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };
    public createOrUpdate = async (req: Request, res: Response): Promise<Response> => {
        try {
            const util = new Utility();
            const variants: any[] = [];
            const { id } = req.params;
            const Validationrules = {
                title: global["config"].commonRules.name,
                sellingPrice: "required",
                costPrice: "required",
                isActive: "required",

            };
            const formErrors = await this.validateForm(req.body, Validationrules);
            const FormBody = req.body;
            if (FormBody.variants) {
                const v = JSON.parse(FormBody.variants);
                if (v.length > 0) {
                    await ne.each(v, async (el, i) => {
                        variants.push({
                            sku: util.generateSKUFromName(el.name),
                            sellingPrice: Number(el.sellingPrice),
                            costPrice: Number(el.costPrice),
                            name: el.name
                        })
                    });
                }
            }
            FormBody.sku = util.generateSKUFromName(FormBody.title);
            FormBody.variants = variants;
            FormBody.isActive = FormBody.isActive == "true" ? true : false;
            FormBody.sellingPrice = Number(FormBody.sellingPrice);
            FormBody.costPrice = Number(FormBody.costPrice)
            if (!formErrors) {
                if (req.files != null && req.files != undefined && Object.keys(req.files).length > 0) {
                    const filesArray = req.files;
                    if (config.production) {
                        if (id) {
                            const existingImage = await this.collections.products?.findOne(
                                { _id: new ObjectId(id) }
                            );
                            if (existingImage) {
                                if (filesArray["productImage"]) {
                                    const imagePath = await uploadImages(filesArray["productImage"], 'Product', existingImage?.image ?? "")
                                    FormBody['image'] = imagePath[0];
                                }
                            }
                        } else {
                            const imagePath = await uploadImages(filesArray["image"], 'Product')
                            FormBody['image'] = imagePath[0];
                        }
                    } else {

                        const imagePath = await util.uploadFiles(filesArray["productImage"], ['png', 'jpg', 'jpeg'], "profile/")
                        if (imagePath && imagePath?.length > 0) {
                            FormBody['image'] = imagePath[0];
                        }
                    }
                }
                if (id) {
                    await this.collections.products.updateOne({ _id: new ObjectId(id) }, { $set: { ...FormBody } });
                    await this.appLog(req, this.__component, "Update", new ObjectId(id), FormBody);
                } else {
                    const createdProduct = await this.collections.products.insertOne({ ...FormBody });
                    await this.appLog(req, this.__component, "Create", createdProduct.insertedId, FormBody);
                }
                return this.json(req, res, 200, { message: `Product ${(id) ? 'Updated' : 'Created'} Successfully` });
            } else {
                return this.jsonError(res, 400, this.__component, formErrors);
            }
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };

    public delete = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            if (id) {
                await this.collections.products.deleteOne({ _id: new ObjectId(id) });
                await this.appLog(req, this.__component, "Delete", new ObjectId(id));
                return this.json(req, res, 200, { message: `Product Deleted Successfully` });
            } else {
                return this.jsonError(res, 400, this.__component, 'delete');
            }
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "invalid", error);
        }
    };
}