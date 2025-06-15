import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
        folder: 'materials',
        'resource_type': 'auto',
        format: async (req, file) => file.mimetype.split('/')[1],
    }
});

const upload = multer({ storage: storage });

export default upload; 