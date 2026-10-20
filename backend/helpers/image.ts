import * as aws from 'aws-sdk';
import ne from 'node-each';
import config from '../config/config';
import fs from 'fs';
import * as path from 'path';

export const uploadImages = async (images: any[], type: string, existingImages?: string) => {
	if (images.length === 0) {
		return false;
	}

	const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
	const bucketName = config.image_space.bucketName;
	const s3 = new aws.S3({
		endpoint: spacesEndpoint,
		accessKeyId: config.image_space.spaceAccessKey,
		secretAccessKey: config.image_space.spaceSecretAccessKey,
	});

	if (existingImages && existingImages != "") {

		const imageName = path.basename(existingImages);
		const params = {
			Bucket: bucketName,
			Key: `${type}/${imageName}`
		};
		try {
			s3.deleteObject(params, (error) => {
				if (error) {
					console.error(error)
				}
			})
		} catch (error) {
			console.error(`Error deleting image ${imageName}:`, error);
		}

	}
	// if (existingImages) {
	// 	await ne.each(existingImages, (el, i) => {
	// 		const imageName = path.basename(el);
	// 		const params = {
	// 			Bucket: bucketName,
	// 			Key: `${type}/${imageName}`
	// 		};
	// 		try {
	// 			s3.deleteObject(params, (error, data) => {
	// 				if (error) {
	// 					console.error(error)
	// 				}
	// 			})
	// 		} catch (error) {
	// 			console.error(`Error deleting image ${imageName}:`, error);
	// 		}
	// 	})
	// }
	const newImagePath: any[] = [];

	await ne.each(images, async (el, i) => {

		const ext = path.extname(el.originalname);

		const fileStream = fs.createReadStream(el.path);
		const uploadedImage = await s3.upload({
			Bucket: bucketName,
			Key: `${type}/${i}-${new Date().toISOString().replace(/[^0-9]/g, '')}${ext}`,
			Body: fileStream,
			ACL: 'public-read',
			ContentType: el.mimetype,
		}).promise();

		newImagePath.push(uploadedImage.Location);
	});

	return newImagePath;
};

