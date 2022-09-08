const router = require('express').Router();



router.post('/api')

router.post('/api/follow/userId/:id')

router.post('/api/unfollow/userId/:id')

router.get('/api/user')

router.post('api/posts')

router.delete('api/posts/postId/:id')

router.post('/api/like/postId/:id')

router.post('/api/unlike/postId/:id')

router.post('/api/comment/postId:id')

router.get('api/posts/postId/:id')

router.get('/api/all_posts')









module.exports = router