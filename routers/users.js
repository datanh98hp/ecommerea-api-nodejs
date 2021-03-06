const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('name phone email'); // Loại trừ/special feild trả về

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})
// 
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select("-passwordHash");
    
    if (!user) {
        res.status(500).json({ message: "The user with the given id was not found" })
    }
    res.status(200).send(user)
})

// 
router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        color: req.body.icon,
        passwordHash:bcrypt.hashSync(req.body.passwordHash,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });

    user = await user.save();

    if (!user)
        return res.status(404).send('The user can not created.!');
    res.send(user)
})
// 
router.post('/register', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if (!user)
        return res.status(400).send('the user cannot be created!')

    res.send(user);
})
////
router.post('/login',async (req,res)=>{
    const secretString = process.env.secretString;
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return res.status(400).send({ message: 'User not fouind' });
    }
    // 
    if(user && bcrypt.compareSync(req.body.passwordHash,user.passwordHash)) {
        
        const token = jwt.sign(
            {
                userId:user.id,
                isAdmin:user.isAdmin
            },
            secretString,
            {expiresIn:'1d'}
        )
        
        res.status(200).send({message:'user Authenticated',user:user.email,token:token})
    }else {
        res.status(400).send({ message: 'Password is wrong.' })
    }
})

//user count

router.get(`/get/count`,async (req,res)=>{
    const userCount = await User.countDocuments()

    if (!userCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        count: userCount
    })
})

// delete user
router.delete('/:id', async (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if (user) {
            res.status(200).json({ success: true, message: 'The user is deleted.' })
        } else {
            return res.status(404).json({ success: false, message: 'User not found.' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
})
////// 7 Protect  the api and Authentication JWT Middleware


module.exports =router;