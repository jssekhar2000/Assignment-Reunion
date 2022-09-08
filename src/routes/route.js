const router = require('express').Router();
const userController = require('../Controllers/userController')


router.post('/createUser',userController.createUser) // create User No Need

router.post('/api/authenticate',userController.login)    //should perform user authentication and return a JWT token.

router.post('/api/follow/userId/:id')  //authenticated user would follow user with {id}

router.post('/api/unfollow/userId/:id') // authenticated user would unfollow a user with {id}

router.get('/api/user')     // should authenticate the request and return the respective user profile.

router.post('api/posts')    // would add a new post created by the authenticated user.

router.delete('api/posts/postId/:id') // would delete post with {id} created by the authenticated user.

router.post('/api/like/postId/:id')   //would like the post with {id} by the authenticated user.

router.post('/api/unlike/postId/:id')  // would unlike the post with {id} by the authenticated user.

router.post('/api/comment/postId:id')  // add comment for post with {id} by the authenticated user.

router.get('api/posts/postId/:id')  //would return a single post with {id} populated with its number of likes and comments  

router.get('/api/all_posts')    // would return all posts created by authenticated user sorted by post time.









module.exports = router