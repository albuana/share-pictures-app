const express=require('express');
const router=express.Router();
//users models
const Users=require('../../models/Users');

//@routes GET users
//@ GET users
router.get('/', async (req, res) => {
    try{
        const users=await Users.find();
        if(!users) res.status(400).json("No users found");
        console.log(users);
        res.json(users);
    }catch(err){
        res.status(400).json("No users found");
    }
})

//@routes GET user users
//@desc GET a user
router.get('/:id', async (req, res) => {
    try{
        const user=await Users.findById(req.params.id);
        if(!user) res.status(400).json("No user found");
        console.log(user);
        res.json(user);
    }catch(err){
        res.status(400).json("No user found");    }
})

//@routes GET user users
//@desc GET a user
router.get('/nick/:nickname', async (req, res) => {
    try{
        const user=await Users.find({nickname:req.params.nickname});
        if(!user) res.status(400).json("No user found");
        console.log(user);
        res.json(user);
    }catch(err){
        res.status(400).json("No user found");    }
})

//@routes user users
//@ create a user
router.post('/', async (req, res) => {
    const newuser=new Users(req.body)

    try{
        const user=await newuser.save();
        console.log(user);
        if(!user) res.status(400).json("Couldn't save user");
        res.json(user);
    }catch(err){
        res.status(400).json("Couldn't save user");
    }
});

//@routes DELETE user users
//@desc DELETE a user
router.delete('/:id', async (req, res) => {
    try{
        const user=await Users.findByIdAndDelete(req.params.id);
        if(!user)  res.status(400).json("No user found");
        res.json();
    }catch(err){
        res.status(400).json("No user found");
    }
})

//@routes PUT user users
//@desc PUT a user
router.put('/:id', async (req, res) => {
    try{
        const user=await Users.findByIdAndUpdate(req.params.id, req.body);
        if(!user) res.status(400).json("Couldn't update");
        res.json();
    }catch(err){
        res.status(400).json("Couldn't update");    }
})

module.exports=router;