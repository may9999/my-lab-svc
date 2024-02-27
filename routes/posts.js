const express = require('express');
const router = express.Router();
const Posts = require('../models/Posts')

router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find();
        res.json(posts);
    } catch(err) {
        res.json({message: err});
    }
});

router.post('/', async (req, res) => {
    const post = new Posts({
        title: req.body.title,
        description: req.body.description
    });
    
    try {
        const savedPosts = await post.save()
        res.json(savedPosts);
    } catch(err) {
        res.json({message: err});
    }
    
});

module.exports = router;