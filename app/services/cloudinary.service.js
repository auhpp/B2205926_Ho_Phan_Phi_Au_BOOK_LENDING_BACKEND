import { v2 as cloudinary } from 'cloudinary';
import streamfier from 'streamifier';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadFromBuffer = (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'book-lending-project',
                public_id: `${file.originalname.split('.')[0]}-${Date.now()}`
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.secure_url);
            }
        )
        streamfier.createReadStream(file.buffer).pipe(uploadStream);
    });
}

export const deleteFromCloudinary = async (public_id) => {
    try {
        const result = await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        console.error("Lỗi khi xóa file trên Cloudinary:", error);
        throw error;
    }
}