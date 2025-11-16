import express from 'express';
import { auth } from '../middlewares/auth.js';
import { aiDictionary, generateArticle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject, resumeReview } from '../controllers/aiController.js';
import { upload } from '../configs/multer.js';

const aiRouter = express.Router();
aiRouter.post('/generate-article', auth, generateArticle)
aiRouter.post('/generate-blog-title', auth, generateBlogTitle)
aiRouter.post('/ai-dictionary', auth, aiDictionary)
aiRouter.post('/generate-image', auth, generateImage)
aiRouter.post('/remove-image-background', upload.single('image'), auth, removeImageBackground)
aiRouter.post('/remove-image-object', auth, upload.single('image'),  removeImageObject)
aiRouter.post('/resume-review', upload.single('resume'), auth, resumeReview)



export default aiRouter