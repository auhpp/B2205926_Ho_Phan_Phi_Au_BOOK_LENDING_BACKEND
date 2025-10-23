import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import path from 'path';

const s3 = new S3Client({
    region: process.env.BUCKET_REGION_S3,
    credentials: {
        secretAccessKey: process.env.SECRET_ACCESS_KEY_S3,
        accessKeyId: process.env.ACCESS_KEY_ID_S3,
    }
});



const uploadFileToS3 = async (file) => {
    const newFileName = `${path.parse(file.originalname).name}-${Date.now()}${path.extname(file.originalname)}`;

    const params = {
        Bucket: process.env.BUCKET_NAME_S3,
        Key: newFileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    }

    const command = new PutObjectCommand(params);

    try {
        await s3.send(command);

        const fileUrl = `https://${process.env.BUCKET_NAME_S3}.s3.${process.env.BUCKET_REGION_S3}.amazonaws.com/${newFileName}`;
        return fileUrl;
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        throw error;
    }
}

export default uploadFileToS3;