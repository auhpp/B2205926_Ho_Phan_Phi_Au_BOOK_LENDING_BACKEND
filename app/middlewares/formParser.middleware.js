import multer from 'multer';

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type, only JPEG, PNG is allowed!'), false);
    }
}


const uploadParser = multer({
    storage: multer.memoryStorage(), // LƯU VÀO BỘ NHỚ (RAM)
    fileFilter,
    limits: { fileSize: 5000000 } // 5MB
});

export default uploadParser;