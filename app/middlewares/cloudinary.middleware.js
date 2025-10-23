import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'book-lending-project',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: (req, file) => {
            const uniqueName = `${file.originalname.split('.')[0]}-${Date.now()}`;
            return uniqueName;
        }
    }
});


const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG, PNG is allowed!'), false);
    }
};

const uploadCloud = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5000000 } //5MB
});

export default uploadCloud;