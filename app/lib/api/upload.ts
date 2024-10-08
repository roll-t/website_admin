import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        try {
            const file = req.body.file;
            const uploadResponse = await cloudinary.uploader.upload(file, {
                upload_preset: 'your_upload_preset', // nếu cần
            });
            res.status(200).json({ url: uploadResponse.secure_url });
        } catch (error) {
            res.status(500).json({ error: 'Upload failed.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}

