const router = require('express').Router();
const userController = require('../Controllers/userController');
const postController = require("../Controllers/postController")
const auth = require('../middlewares/auth')


router.post('/register',userController.createUser) // Register  User

router.post('/api/authenticate',userController.login)    //should perform user authentication and return a JWT token.

router.post('/api/follow/:id',auth.authentication,userController.follow)  //authenticated user would follow user with {id}

router.post('/api/unfollow/:id',auth.authentication,userController.unfollow) // authenticated user would unfollow a user with {id}

router.get('/api/user',auth.authentication,userController.getProfile)     // should authenticate the request and return the respective user profile.

router.post('/api/posts',auth.authentication,postController.createPost)    // would add a new post created by the authenticated user.

router.delete('/api/posts/:id',auth.authentication,postController.deletePost) // would delete post with {id} created by the authenticated user.

router.post('/api/like/:id',auth.authentication,postController.like)   //would like the post with {id} by the authenticated user.

router.post('/api/unlike/:id',auth.authentication,postController.unlike)  // would unlike the post with {id} by the authenticated user.

router.post('/api/comment/:id',auth.authentication,postController.comment)  // add comment for post with {id} by the authenticated user.

router.get('/api/posts/:id',auth.authentication,postController.getPost)  //would return a single post with {id} populated with its number of likes and comments  

router.get('/api/all_posts',auth.authentication,postController.getPosts)    // would return all posts created by authenticated user sorted by post time.









module.exports = router