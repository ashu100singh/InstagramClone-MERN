import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import upload from '../middlewares/multer.js'
import { 
    addComment, 
    addNewPost, 
    bookmarkPost, 
    deletePost, 
    dislikePost, 
    getAllCommentsOfPost, 
    getAllPost, 
    getUserPost, 
    likePost 
} from '../controllers/post.controller.js'


const router = express.Router()

router.route('/addpost').post(isAuthenticated, upload.single('image'), addNewPost)
router.route('/all-posts').get(isAuthenticated, getAllPost)
router.route('/user-posts/all').get(isAuthenticated, getUserPost)
router.route('/:id/like').get(isAuthenticated, likePost)
router.route('/:id/dislike').get(isAuthenticated, dislikePost)
router.route('/:id/comment').post(isAuthenticated, addComment)
router.route('/:id/comment/all').post(isAuthenticated, getAllCommentsOfPost)
router.route('/delete/:id').delete(isAuthenticated, deletePost)
router.route('/:id/bookmark').get(isAuthenticated, bookmarkPost)


export default router