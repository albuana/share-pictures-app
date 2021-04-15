const express=require('express');
const router=express.Router();
//Posts models
const Posts=require('../../models/Posts');

//@routes GET Posts
//@ GET Posts
router.get('/', async (req, res) => {
    try{
        const posts=await Posts.find();
        if(!posts) res.status(400).json("No posts found");
        res.json(posts);
    }catch(err){
        res.status(400).json("No posts found");
    }
})

//@routes GET Posts by recent
//@ GET Posts
router.get('/recent', async (req, res) => {
    try{
        const posts=await Posts.find().sort({date: -1});
        if(!posts) res.status(400).json("No posts found");
        res.json(posts);
    }catch(err){
        res.status(400).json("No posts found");
    }
})

//@routes GET Posts by likes
//@ GET Posts
router.get('/likes', async (req, res) => {
    try{
        const posts=await Posts.find().sort({likes: -1});
        if(!posts) res.status(400).json("No posts found");
        res.json(posts);
    }catch(err){
        res.status(400).json("No posts found");
    }
})
//@routes GET Posts by user
//@ GET Posts
router.get('/user/:userId', async (req, res) => {
    try{
        const post=await Posts.find({ user: req.params.userId }).sort({date: -1});
        if(!post) res.status(400).json("No post found");
        res.json(post);
    }catch(err){
        res.status(400).json("No post found");    }
})

//@routes GET post Posts
//@desc GET a post
router.get('/:id', async (req, res) => {
    try{
        const post=await Posts.findById(req.params.id);
        if(!post) res.status(400).json("No post found");
        res.json(post);
    }catch(err){
        res.status(400).json("No post found");    }
})

//@routes post Posts
//@ create a post
router.post('/', async (req, res) => {
    const newpost=new Posts(req.body)

    try{
        const post=await newpost.save();
        if(!post) res.status(400).json("Couldn't save post");
        res.json(post);
    }catch(err){
        res.status(400).json("Couldn't save post");
    }
});

//@routes DELETE post Posts
//@desc DELETE a post
router.delete('/:id', async (req, res) => {
    try{
        const post=await Posts.findByIdAndDelete(req.params.id);
        if(!post)  res.status(400).json("No post found");
        res.json();
    }catch(err){
        res.status(400).json("No post found");
    }
})

//@routes PUT post Posts
//@desc PUT a post
router.put('/:id', async (req, res) => {
    try{
        const post=await Posts.findByIdAndUpdate(req.params.id, req.body);
        if(!post) res.status(400).json("Couldn't update");
        res.json();
    }catch(err){
        res.status(400).json("Couldn't update");    }
})

module.exports=router;
